import { prisma } from "../src/lib/prisma";
import crypto from "crypto";
import { createPaymobIntention } from "../src/lib/paymob";

async function main() {
  console.log("🔍 Searching for a PENDING order to test payment failure & retry...");
  
  let order = await prisma.order.findFirst({
    where: { status: "PENDING" },
    include: { items: { include: { product: true } }, user: true }
  });

  if (!order) {
    console.log("ℹ️ No PENDING order found. Resetting an existing order to PENDING for testing...");
    order = await prisma.order.findFirst({
      include: { items: { include: { product: true } }, user: true }
    });
    
    if (!order) {
      console.error("❌ No orders found in the database. Please place an order in the UI first.");
      process.exit(1);
    }
    
    order = await prisma.order.update({
      where: { id: order.id },
      data: { status: "PENDING" },
      include: { items: { include: { product: true } }, user: true }
    });
  }

  console.log(`\n========================================`);
  console.log(`1. INITIAL STATE`);
  console.log(`========================================`);
  console.log(`Order ID: ${order.id}`);
  console.log(`User Email: ${order.user?.email || order.clientEmail || "N/A"}`);
  console.log(`Order Status: ${order.status}`);
  
  const initialStocks: { [id: string]: number } = {};
  for (const item of order.items) {
    initialStocks[item.productId] = item.product.stock;
    console.log(`- Product "${item.product.name}": Qty Ordered = ${item.quantity}, Current Db Stock = ${item.product.stock}`);
  }

  console.log(`\n========================================`);
  console.log(`2. SIMULATING PAYMOB PAYMENT FAILURE/CANCEL webhook`);
  console.log(`========================================`);
  
  // Construct Paymob webhook failure payload
  const obj = {
    amount_cents: Math.round(order.totalAmount * 100),
    created_at: new Date().toISOString(),
    currency: "EGP",
    error_occured: true,
    has_parent_transaction: false,
    id: 9999999,
    integration_id: 5660937,
    is_3d_secure: true,
    is_auth: false,
    is_capture: false,
    is_refunded: false,
    is_standalone_payment: true,
    is_voided: false,
    order: {
      id: 8888888,
      merchant_order_id: order.id
    },
    owner: 111111,
    pending: false,
    source_data: {
      pan: "1234",
      sub_type: "visa",
      type: "card"
    },
    success: false
  };

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

  const hmacString = fieldsToHash.map(v => v === undefined || v === null ? "" : String(v)).join("");
  const PAYMOB_HMAC = process.env.PAYMOB_HMAC || "A0C8FA7B2DC4C3BD45F9AFD492BAD3BD";
  const hmacCalculated = crypto.createHmac("sha512", PAYMOB_HMAC).update(hmacString).digest("hex");

  console.log(`Sending webhook request to local Next.js dev server...`);
  const response = await fetch(`http://localhost:3000/api/paymob/webhook?hmac=${hmacCalculated}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ obj })
  });

  if (!response.ok) {
    throw new Error(`Failed webhook simulation: ${response.status} ${await response.text()}`);
  }

  console.log(`Webhook triggered successfully. Status: ${response.status}`);

  // Retrieve post-webhook state
  let afterWebhookOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: { include: { product: true } } }
  });

  if (!afterWebhookOrder) throw new Error("Order lost after webhook");

  console.log(`\nPost-Failure State:`);
  console.log(`Order Status: ${afterWebhookOrder.status} (Should be FAILED)`);
  
  for (const item of afterWebhookOrder.items) {
    const expectedStock = initialStocks[item.productId] + item.quantity;
    console.log(`- Product "${item.product.name}": Expected Stock = ${expectedStock}, Current Db Stock = ${item.product.stock}`);
    if (item.product.stock !== expectedStock) {
      console.warn(`⚠️ Warning: Stock for product ${item.productId} was not incremented correctly!`);
    }
  }

  console.log(`\n========================================`);
  console.log(`3. SIMULATING RETRY PAYMENT ACTION`);
  console.log(`========================================`);

  console.log(`Executing retry action logic for FAILED order...`);
  
  // Run the retry transaction block to re-reserve stock and set state back to PENDING
  await prisma.$transaction(async (tx) => {
    for (const item of afterWebhookOrder!.items) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, name: true }
        });
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`The variation "${variant?.name || 'One of your items'}" just sold out!`);
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      } else {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true }
        });
        if (!product || product.stock < item.quantity) {
          throw new Error(`The treasure "${product?.name || 'One of your items'}" just sold out!`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    // Restore to PENDING
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PENDING" }
    });
  });

  console.log("Stock re-reserved, status set back to PENDING.");

  // Generate new Paymob payment intention/session url
  const amountCents = Math.round(order.totalAmount * 100);
  const itemsForPaymob = order.items.map(item => ({
    name: item.product.name || "Item",
    amount_cents: Math.round(item.price * 100),
    description: item.product.description || "Giftisan Product",
    quantity: item.quantity,
    image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ""
  }));

  if (order.discountApplied && order.discountApplied > 0) {
    itemsForPaymob.push({
      name: "Promo Discount",
      amount_cents: -Math.round(order.discountApplied * 100),
      description: "Applied coupon discount",
      quantity: 1,
      image: ""
    });
  }

  if (order.shippingCost && order.shippingCost > 0) {
    itemsForPaymob.push({
      name: "Shipping",
      amount_cents: Math.round(order.shippingCost * 100),
      description: "Shipping Cost",
      quantity: 1,
      image: ""
    });
  }

  const billingData = {
    firstName: order.shippingAddress ? "Test" : "NA",
    lastName: order.shippingAddress ? "User" : "NA",
    email: order.clientEmail || order.user?.email || "test@test.com",
    phone: order.clientPhone || "+20123456789",
    address: order.shippingAddress || "NA",
    city: order.shippingCity || "NA",
    country: order.shippingCountry || "EG"
  };

  console.log("Calling Paymob intention API to generate new payment session...");
  const clientSecret = await createPaymobIntention(amountCents, order.id, billingData, itemsForPaymob);
  
  const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?api_key=${process.env.PAYMOB_PUBLIC_KEY}&client_secret=${clientSecret}`;
  console.log(`✅ Success! Generated payment URL: ${paymentUrl}`);

  // Retrieve post-retry state
  let afterRetryOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: { include: { product: true } } }
  });

  if (!afterRetryOrder) throw new Error("Order lost after retry");

  console.log(`\nPost-Retry State:`);
  console.log(`Order Status: ${afterRetryOrder.status} (Should be PENDING)`);
  for (const item of afterRetryOrder.items) {
    console.log(`- Product "${item.product.name}": Expected Stock = ${initialStocks[item.productId]}, Current Db Stock = ${item.product.stock}`);
    if (item.product.stock !== initialStocks[item.productId]) {
      console.warn(`⚠️ Warning: Stock for product ${item.productId} was not decremented back to initial reserved levels!`);
    }
  }

  console.log(`\n🎉 Lifecycle test completed successfully and validated all states!`);
}

main()
  .catch(err => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
