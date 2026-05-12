import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { PAYMOB_HMAC } from "@/lib/paymob";
import { sendOrderNotification } from "@/lib/mail";

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

    const rawOrderId = obj.order.merchant_order_id;
    const orderId = typeof rawOrderId === "string" && rawOrderId.includes("-") 
      ? rawOrderId.split("-")[0] 
      : rawOrderId;
    const isSuccess = obj.success === true && obj.pending === false;

    if (isSuccess) {
      // Success flow: mark as PROCESSING and notify artisans
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  artisan: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (order && order.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          // Update Order Status
          await tx.order.update({
            where: { id: orderId },
            data: { status: "PROCESSING" }
          });

          // Process ledger transactions and balances for each order item
          for (const item of order.items) {
            const product = item.product;
            const artisan = product.artisan;
            if (!artisan) continue;

            const itemTotal = item.price * item.quantity;
            const commission = artisan.commissionRate ?? 0.0; // e.g. 0.15 (15%)
            const adminShare = itemTotal * commission;
            const artisanShare = itemTotal - adminShare;

            // Log the sale transaction
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

            // Update the artisan's balance
            await tx.artisanBalance.upsert({
              where: { artisanId: artisan.id },
              update: {
                pending: {
                  increment: artisanShare
                }
              },
              create: {
                artisanId: artisan.id,
                pending: artisanShare,
                withdrawable: 0.0,
                withdrawn: 0.0
              }
            });
          }
        });
        console.log(`Order ${orderId} marked as PROCESSING and financial ledger updated via Paymob webhook.`);

        // Send email notifications to artisans
        try {
          const artisanEarnings = new Map();
          order.items.forEach(item => {
            const artisan = item.product.artisan;
            if (artisan.user.email) {
              const current = artisanEarnings.get(artisan.user.email) || {
                name: artisan.user.name || artisan.studioName,
                email: artisan.user.email,
                total: 0
              };
              current.total += item.price * item.quantity;
              artisanEarnings.set(artisan.user.email, current);
            }
          });

          // Send emails
          artisanEarnings.forEach(data => {
            sendOrderNotification(data.email, data.name, order.id, data.total)
              .catch(err => console.error(`Failed to send order notification to ${data.email}:`, err));
          });
        } catch (err) {
          console.error("Failed to process order notification emails inside webhook:", err);
        }
      } else if (order) {
        console.log(`Order ${orderId} has status: ${order.status} (Skipped email/status update)`);
      }
    } else {
      // Failure flow: payment failed or cancelled
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (order && order.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          // Mark order as CANCELLED
          await tx.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" }
          });

          // Restore stock
          for (const item of order.items) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stock: {
                    increment: item.quantity
                  }
                }
              });
            } else {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    increment: item.quantity
                  }
                }
              });
            }
          }
        });
        console.log(`Order ${orderId} payment failed. Marked as CANCELLED and restored stock.`);
      } else if (order) {
        console.log(`Order ${orderId} has status: ${order.status} (No stock restoration needed)`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Paymob webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

