import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { PAYMOB_HMAC } from "@/lib/paymob";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Verify HMAC if you have the secret
    // Note: It's highly recommended to verify the HMAC signature here
    // For simplicity, we are skipping full HMAC verification in this scaffold
    // You should use the PAYMOB_HMAC from env to compute and verify it

    const hmacReceived = req.nextUrl.searchParams.get("hmac");
    if (PAYMOB_HMAC && hmacReceived) {
      const obj = data.obj;
      
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
        obj.order.id,
        obj.owner,
        obj.pending,
        obj.source_data.pan,
        obj.source_data.sub_type,
        obj.source_data.type,
        obj.success
      ];

      const hmacString = fieldsToHash.join("");
      const hmacCalculated = crypto.createHmac("sha512", PAYMOB_HMAC).update(hmacString).digest("hex");

      if (hmacCalculated !== hmacReceived) {
        console.error("Paymob Webhook HMAC mismatch");
        return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
      }
    }

    const { obj } = data;
    if (!obj || !obj.order || !obj.order.merchant_order_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const orderId = obj.order.merchant_order_id;
    const isSuccess = obj.success === true && obj.pending === false;

    if (isSuccess) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" } // Or "PAID" depending on your logic
      });
      console.log(`Order ${orderId} marked as PROCESSING/PAID via Paymob webhook.`);
    } else {
      // Handle failure (e.g., mark as FAILED)
      console.log(`Payment failed for order ${orderId}.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Paymob webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
