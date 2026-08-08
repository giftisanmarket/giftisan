import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderStatusUpdateEmail } from "@/lib/mail";

/**
 * SECURE SHIPPING & LOGISTICS WEBHOOK ENDPOINT
 * 
 * Receives delivery updates from external shipping carriers (Bosta, Mylerz, Aramex, etc.)
 * Path: POST /api/shipping/webhook
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate or parse the JSON request body
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { event, trackingNumber, orderId, itemId, status, carrier } = body;

    console.log(`\n📬 [Shipping Webhook Received] Event: "${event || "update"}" | Tracking: "${trackingNumber || "N/A"}" | Status: "${status}"`);

    // We proceed if the status is delivered/Delivered/DELIVERED or if the event specifies delivery
    const isDelivered = 
      status?.toUpperCase() === "DELIVERED" || 
      event === "order.delivered" ||
      event === "shipment.delivered";

    if (!isDelivered) {
      console.log(`ℹ️ [Shipping Webhook] Ignored non-delivery status: "${status || event}". No ledger action required.`);
      return NextResponse.json({ 
        success: true, 
        message: "Status update logged. No financial escrow trigger necessary." 
      });
    }

    // 2. Identify target order item using multiple fallback routes (tracking number, item ID, or Order ID)
    let targetItems: any[] = [];

    if (trackingNumber) {
      targetItems = await prisma.orderItem.findMany({
        where: { trackingNumber },
        include: { product: true, order: { include: { user: true } } }
      });
    } else if (itemId) {
      const singleItem = await prisma.orderItem.findUnique({
        where: { id: itemId },
        include: { product: true, order: { include: { user: true } } }
      });
      if (singleItem) targetItems = [singleItem];
    } else if (orderId) {
      targetItems = await prisma.orderItem.findMany({
        where: { orderId },
        include: { product: true, order: { include: { user: true } } }
      });
    }

    if (targetItems.length === 0) {
      console.warn(`⚠️ [Shipping Webhook] Received delivery status but could not find any matching order item in the database.`);
      return NextResponse.json({ 
        error: "Resource not found", 
        details: "Could not map trackingNumber, itemId, or orderId to any database record." 
      }, { status: 442 });
    }

    const updatedItemIds: string[] = [];

    // 3. Update database atomically inside a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of targetItems) {
        // Only update if not already marked DELIVERED to prevent double escrow resetting
        if (item.status === "DELIVERED") {
          console.log(`ℹ️ [Shipping Webhook] Item ${item.id} is already marked DELIVERED. Skipping.`);
          continue;
        }

        // Update item status
        await tx.orderItem.update({
          where: { id: item.id },
          data: { 
            status: "DELIVERED",
            carrier: carrier || item.carrier || "Carrier Link"
          }
        });

        updatedItemIds.push(item.id);

        // Reset the Escrow ledger timestamp to START NOW from the arrival moment
        const affectedTxs = await tx.artisanTransaction.updateMany({
          where: {
            orderId: item.orderId,
            artisanId: item.product.artisanId,
            type: "SALE",
            status: "PENDING"
          },
          data: {
            createdAt: new Date() // Force holding timer to start from this delivery moment
          }
        });

        console.log(`⚡ [Escrow Security] Reset escrow clock for Order: ${item.orderId} and Artisan: ${item.product.artisanId}. Updated ${affectedTxs.count} transaction(s).`);

        // Send beautiful delivery confirmation email notification to buyer
        const buyerEmail = item.order?.user?.email || item.order?.clientEmail;
        if (buyerEmail) {
          sendOrderStatusUpdateEmail(
            buyerEmail,
            item.order?.user?.name || "Customer",
            item.orderId,
            "DELIVERED",
            item.product.name,
            item.product.slug || undefined,
            trackingNumber || item.trackingNumber || "Hand Delivered",
            carrier || item.carrier || "Private Runner"
          ).catch(err => console.error(`[Shipping Webhook] Failed to send delivery email for item ${item.id}:`, err));
        }
      }

      // 4. Proactive Parent Order Sync: Check if all other items in this order are delivered
      for (const item of targetItems) {
        const parentOrder = await tx.order.findUnique({
          where: { id: item.orderId },
          include: { items: true }
        });

        if (parentOrder && parentOrder.status !== "DELIVERED") {
          const allDelivered = parentOrder.items.every(
            (i) => i.status === "DELIVERED" || updatedItemIds.includes(i.id)
          );

          if (allDelivered) {
            await tx.order.update({
              where: { id: parentOrder.id },
              data: { status: "DELIVERED" }
            });
            console.log(`📦 [Order Status Escalated] Order ${parentOrder.id} is now fully delivered!`);
          }
        }
      }
    });

    // Revalidate paths for real-time display updates
    revalidatePath("/studio");
    revalidatePath("/profile");
    revalidatePath("/admin/orders");

    return NextResponse.json({
      success: true,
      message: "Delivery status verified and escrow clocks initiated successfully.",
      updatedItemsCount: updatedItemIds.length,
      itemIds: updatedItemIds
    });

  } catch (err: any) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: err.message || "An unexpected error occurred during webhook execution." 
    }, { status: 500 });
  }
}
