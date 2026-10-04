import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { PAYMOB_HMAC } from "@/lib/paymob";
import { sendOrderNotification, sendBuyerOrderReceiptEmail } from "@/lib/mail";
import { createOrderFromAbandonedCheckout } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const hmacReceived = req.nextUrl.searchParams.get("hmac");
    const isProd = process.env.NODE_ENV === "production";

    if (PAYMOB_HMAC) {
      if (!hmacReceived) {
        console.error("Paymob Webhook HMAC missing");
        return NextResponse.json({ error: "Unauthorized: Missing HMAC" }, { status: 401 });
      }

      const obj = data.obj;
      if (!obj) {
        return NextResponse.json({ error: "Invalid payload: Missing obj" }, { status: 400 });
      }

      const fieldsToHash = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order?.id,
        obj.owner,
        obj.pending,
        obj.source_data?.pan,
        obj.source_data?.sub_type,
        obj.source_data?.type,
        obj.success
      ];

      const hmacString = fieldsToHash.map(v => v === undefined || v === null ? "" : String(v)).join("");
      const hmacCalculated = crypto.createHmac("sha512", PAYMOB_HMAC).update(hmacString).digest("hex");

      if (hmacCalculated !== hmacReceived) {
        console.error("Paymob Webhook HMAC mismatch");
        return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
      }
    } else if (isProd) {
      console.warn("PAYMOB_HMAC is not configured in production. Enforcing HMAC check is skipped but highly recommended.");
    }

    const { obj } = data;
    if (!obj || !obj.order || !obj.order.merchant_order_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const rawReference = obj.order.merchant_order_id as string;
    const isSuccess = obj.success === true && obj.pending === false;

    // ── Parse the reference to determine if this is an AbandonedCheckout-based payment ──
    // New format:  AC-<abandonedCheckoutId>-<timestamp>
    // Legacy format: <orderId>-<timestamp>  (from older PENDING order flow)
    const isAbandonedCheckoutRef = rawReference.startsWith("AC-");

    if (isSuccess) {
      if (isAbandonedCheckoutRef) {
        // ── New flow: create real Order from AbandonedCheckout ──
        const abandonedCheckoutId = rawReference.replace(/^AC-/, "").split("-").slice(0, -1).join("-");

        console.log(`Paymob success webhook: Creating order from AbandonedCheckout ${abandonedCheckoutId}`);

        let order: any = null;
        try {
          order = await createOrderFromAbandonedCheckout(abandonedCheckoutId, rawReference);
        } catch (err: any) {
          console.error(`Failed to create order from AbandonedCheckout ${abandonedCheckoutId}:`, err?.message);
          // Mark as FAILED_PAYMENT even though payment succeeded — this is a rare edge case (stock ran out)
          await prisma.$executeRawUnsafe(
            `UPDATE "AbandonedCheckout" SET status = 'FAILED_PAYMENT', "updatedAt" = NOW() WHERE id = $1`,
            abandonedCheckoutId
          );
          // Still return 200 so Paymob doesn't retry
          return NextResponse.json({ success: true, warning: "Order creation failed after payment — manual review required." });
        }

        if (!order) {
          console.warn(`createOrderFromAbandonedCheckout returned null for ${abandonedCheckoutId}`);
          return NextResponse.json({ success: true });
        }

        console.log(`Order ${order.id} created from AbandonedCheckout ${abandonedCheckoutId}.`);

        // Process artisan ledger
        try {
          await prisma.$transaction(async (tx) => {
            for (const item of order.items) {
              const product = item.product;
              const artisan = product.artisan;
              if (!artisan) continue;

              const itemTotal = item.price * item.quantity;
              const commission = artisan.commissionRate ?? 0.0;
              const adminShare = itemTotal * commission;
              const artisanShare = itemTotal - adminShare;

              await tx.artisanTransaction.create({
                data: {
                  artisanId: artisan.id,
                  orderId: order.id,
                  amount: artisanShare,
                  type: "SALE",
                  status: "PENDING",
                  description: `Earnings from "${product.name}" (Qty: ${item.quantity}). Total: ${itemTotal} EGP${adminShare > 0 ? ` (Commission: ${adminShare.toFixed(2)} EGP)` : ""}`
                }
              });

              await tx.artisanBalance.upsert({
                where: { artisanId: artisan.id },
                update: { pending: { increment: artisanShare } },
                create: { artisanId: artisan.id, pending: artisanShare, withdrawable: 0.0, withdrawn: 0.0 }
              });
            }
          });
        } catch (ledgerErr) {
          console.error(`Failed to update artisan ledger for order ${order.id}:`, ledgerErr);
        }

        // Send buyer receipt email
        try {
          const buyerEmail = order.clientEmail || order.user?.email;
          const buyerName = order.user?.name || "Customer";
          if (buyerEmail) {
            const receiptItems = order.items.map((i: any) => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.price
            }));
            sendBuyerOrderReceiptEmail(buyerEmail, buyerName, order.id, order.totalAmount, receiptItems, order.shippingCity || undefined)
              .catch(err => console.error(`Failed to send buyer receipt email to ${buyerEmail}:`, err));
          }
        } catch (err) {
          console.error("Failed to send buyer receipt email:", err);
        }

        // Send artisan notifications
        try {
          const artisanEarnings = new Map<string, { name: string; email: string; total: number }>();
          order.items.forEach((item: any) => {
            const artisan = item.product.artisan;
            if (artisan?.user?.email) {
              const current = artisanEarnings.get(artisan.user.email) || {
                name: artisan.user.name || artisan.studioName || "Artisan",
                email: artisan.user.email,
                total: 0
              };
              current.total += item.price * item.quantity;
              artisanEarnings.set(artisan.user.email, current);
            }
          });

          artisanEarnings.forEach(data => {
            sendOrderNotification(data.email, data.name, order.id, data.total)
              .catch(err => console.error(`Failed to send order notification to ${data.email}:`, err));
          });
        } catch (err) {
          console.error("Failed to send artisan notification emails:", err);
        }

      } else {
        // ── Legacy flow: order already exists with PENDING status ──
        const orderId = rawReference.includes("-") ? rawReference.split("-")[0] : rawReference;

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: true,
            items: {
              include: {
                product: {
                  include: {
                    artisan: {
                      include: { user: true }
                    }
                  }
                }
              }
            }
          }
        });

        if (order && order.status === "PENDING") {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } });

            for (const item of order.items) {
              const product = item.product;
              const artisan = product.artisan;
              if (!artisan) continue;

              const itemTotal = item.price * item.quantity;
              const commission = artisan.commissionRate ?? 0.0;
              const adminShare = itemTotal * commission;
              const artisanShare = itemTotal - adminShare;

              await tx.artisanTransaction.create({
                data: {
                  artisanId: artisan.id,
                  orderId: order.id,
                  amount: artisanShare,
                  type: "SALE",
                  status: "PENDING",
                  description: `Earnings from "${product.name}" (Qty: ${item.quantity}). Total: ${itemTotal} EGP${adminShare > 0 ? ` (Commission: ${adminShare.toFixed(2)} EGP)` : ""}`
                }
              });

              await tx.artisanBalance.upsert({
                where: { artisanId: artisan.id },
                update: { pending: { increment: artisanShare } },
                create: { artisanId: artisan.id, pending: artisanShare, withdrawable: 0.0, withdrawn: 0.0 }
              });
            }
          });

          console.log(`[Legacy] Order ${orderId} marked as PROCESSING via Paymob webhook.`);

          try {
            const buyerEmail = order.clientEmail || order.user?.email;
            const buyerName = order.user?.name || "Customer";
            if (buyerEmail) {
              const receiptItems = order.items.map(i => ({
                name: i.product.name,
                quantity: i.quantity,
                price: i.price
              }));
              sendBuyerOrderReceiptEmail(buyerEmail, buyerName, order.id, order.totalAmount, receiptItems, order.shippingCity || undefined)
                .catch(err => console.error(`Failed to send buyer receipt email to ${buyerEmail}:`, err));
            }
          } catch (err) {
            console.error("Failed to send buyer receipt email:", err);
          }

          try {
            const artisanEarnings = new Map<string, { name: string; email: string; total: number }>();
            order.items.forEach(item => {
              const artisan = item.product.artisan;
              if (artisan.user.email) {
                const current = artisanEarnings.get(artisan.user.email) || {
                  name: artisan.user.name || artisan.studioName || "Artisan",
                  email: artisan.user.email,
                  total: 0
                };
                current.total += item.price * item.quantity;
                artisanEarnings.set(artisan.user.email, current);
              }
            });

            artisanEarnings.forEach(data => {
              sendOrderNotification(data.email, data.name, order.id, data.total)
                .catch(err => console.error(`Failed to send order notification to ${data.email}:`, err));
            });
          } catch (err) {
            console.error("Failed to process order notification emails inside webhook:", err);
          }
        } else if (order) {
          console.log(`[Legacy] Order ${orderId} has status: ${order.status} (Skipped update)`);
        }
      }

    } else {
      // ── Payment failed or cancelled ──
      if (isAbandonedCheckoutRef) {
        // New flow: just mark AbandonedCheckout as FAILED_PAYMENT — nothing to restore
        const abandonedCheckoutId = rawReference.replace(/^AC-/, "").split("-").slice(0, -1).join("-");
        await prisma.$executeRawUnsafe(
          `UPDATE "AbandonedCheckout" SET status = 'FAILED_PAYMENT', "updatedAt" = NOW() WHERE id = $1 AND status = 'ABANDONED'`,
          abandonedCheckoutId
        );
        console.log(`AbandonedCheckout ${abandonedCheckoutId} marked as FAILED_PAYMENT. No stock to restore.`);
      } else {
        // Legacy flow: restore stock for old PENDING orders
        const orderId = rawReference.includes("-") ? rawReference.split("-")[0] : rawReference;

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        });

        if (order && order.status === "PENDING") {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({ where: { id: orderId }, data: { status: "FAILED" } });

            for (const item of order.items) {
              if (item.variantId) {
                await tx.productVariant.update({
                  where: { id: item.variantId },
                  data: { stock: { increment: item.quantity } }
                });
              } else {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { increment: item.quantity } }
                });
              }
            }
          });
          console.log(`[Legacy] Order ${orderId} payment failed. Marked as FAILED and restored stock.`);
        } else if (order) {
          console.log(`[Legacy] Order ${orderId} has status: ${order.status} (No stock restoration needed)`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Paymob webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
