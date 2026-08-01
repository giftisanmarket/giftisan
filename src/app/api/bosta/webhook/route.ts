import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdateEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

// Bosta statuses that represent delivery completed
const BOSTA_DELIVERED_STATUSES = ["Delivered", "DELIVERED", "delivered"];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("[Bosta Webhook] Received payload:", JSON.stringify(data));

    // Bosta webhook payload usually has state name, e.g. data.state or data.status or data.event
    // Standard Bosta webhook structure: { event: "delivery.delivered", trackingNumber: "..." }
    const trackingNumber = data.trackingNumber || data.data?.trackingNumber || data.data?.trackingId;
    const rawStatus = data.status || data.state || data.data?.status || data.data?.state || data.event;

    if (!trackingNumber) {
      return NextResponse.json({ error: "Missing trackingNumber in payload" }, { status: 400 });
    }

    const isDelivered = BOSTA_DELIVERED_STATUSES.includes(rawStatus) || 
                        (typeof rawStatus === "string" && rawStatus.toLowerCase().includes("deliver"));

    if (isDelivered) {
      const updated = await markItemAsDelivered(trackingNumber);
      if (updated) {
        return NextResponse.json({ success: true, message: "Order item successfully updated to DELIVERED" });
      }
    }

    return NextResponse.json({ success: true, message: "Received but status is not delivered" });
  } catch (error: any) {
    console.error("[Bosta Webhook Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Backup GET sync route: Visiting /api/bosta/webhook?trackingId=21344 will fetch Bosta's API and sync!
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get("trackingId") || searchParams.get("trackingNumber");

    if (!trackingId) {
      return NextResponse.json({ error: "Missing trackingId query parameter" }, { status: 400 });
    }

    console.log(`[Bosta Sync] Fetching public tracking for ID: ${trackingId}`);
    
    // Call Bosta's public tracking endpoint
    const response = await fetch(`https://api.bosta.co/shipments/track/${trackingId}`, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.warn(`[Bosta Sync] Public tracking API returned status ${response.status}.`);
      return NextResponse.json({ success: false, error: "Tracking record not found on Bosta's servers" });
    }

    const data = await response.json();
    console.log("[Bosta Sync] API Response:", JSON.stringify(data));

    // Bosta tracking response standard status lies in data.state.value or data.state or data.status
    const rawState = data.state?.value || data.state || data.status;
    const isDelivered = BOSTA_DELIVERED_STATUSES.includes(rawState) || 
                        (typeof rawState === "string" && rawState.toLowerCase().includes("deliver"));

    if (isDelivered) {
      const updated = await markItemAsDelivered(trackingId);
      if (updated) {
        return NextResponse.json({ success: true, status: "DELIVERED", synced: true });
      }
    }

    return NextResponse.json({ success: true, status: rawState || "SHIPPED", synced: false });
  } catch (error: any) {
    console.error("[Bosta GET Sync Error]:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

async function markItemAsDelivered(trackingNumber: string) {
  // Find the OrderItem associated with this tracking number
  const orderItem = await prisma.orderItem.findFirst({
    where: { 
      trackingNumber: trackingNumber,
      status: "SHIPPED" // Only update if currently shipped
    },
    include: {
      order: {
        include: {
          user: true
        }
      },
      product: true
    }
  });

  if (!orderItem) {
    console.log(`[Bosta Automation] No matching SHIPPED OrderItem found for tracking: ${trackingNumber}`);
    return false;
  }

  const orderId = orderItem.orderId;
  const itemId = orderItem.id;

  // 1. Update OrderItem status to DELIVERED
  const updatedItem = await prisma.orderItem.update({
    where: { id: itemId },
    data: { status: "DELIVERED" },
    include: {
      order: {
        include: {
          user: true
        }
      },
      product: true
    }
  });

  console.log(`[Bosta Automation] Successfully marked Item ${itemId} as DELIVERED via tracking auto-sync.`);

  // 2. Fetch all other items to see if entire order is DELIVERED
  const allOrderItems = await prisma.orderItem.findMany({
    where: { orderId: orderId }
  });

  const allDelivered = allOrderItems.every(item => item.status === "DELIVERED");

  if (allDelivered && updatedItem.order.status !== "DELIVERED") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" }
    });
    console.log(`[Bosta Automation] Updated parent Order ${orderId} status to "DELIVERED" since all items are fulfilled.`);
  }

  // 3. Reset the transaction escrow holding period to start NOW (from physical delivery confirmation)
  await prisma.artisanTransaction.updateMany({
    where: {
      orderId: orderId,
      artisanId: orderItem.product.artisanId,
      type: "SALE",
      status: "PENDING"
    },
    data: {
      createdAt: new Date()
    }
  });
  console.log(`[Bosta Automation] Escrow countdown triggered starting now for order ${orderId}.`);

  const recipientEmail = updatedItem.order.user?.email || updatedItem.order.clientEmail;
  const recipientName = updatedItem.order.user?.name || "Customer";

  // 4. Send beautiful delivery confirmation email notification to buyer
  if (recipientEmail) {
    sendOrderStatusUpdateEmail(
      recipientEmail,
      recipientName,
      updatedItem.order.id,
      "DELIVERED",
      updatedItem.product.name,
      updatedItem.product.slug || undefined,
      trackingNumber,
      updatedItem.carrier || "Bosta"
    ).catch(err => console.error("[Bosta Automation] Failed to send delivery email:", err));
  }

  revalidatePath("/profile");
  revalidatePath("/studio");
  return true;
}
