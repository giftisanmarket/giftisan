const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Searching for PENDING orders in the database...");
  
  // Find a pending order, or any order we can use
  let order = await prisma.order.findFirst({
    where: { status: "PENDING" },
    include: { items: true, user: true }
  });

  if (!order) {
    console.log("No PENDING order found. Let's look for any order we can reset or clone...");
    order = await prisma.order.findFirst({
      include: { items: true, user: true }
    });
    
    if (!order) {
      console.log("No orders found at all in the database! Please checkout a product on the UI first.");
      await prisma.$disconnect();
      return;
    }
    
    console.log(`Found order ${order.id} with status ${order.status}. Setting its status to PENDING for testing...`);
    order = await prisma.order.update({
      where: { id: order.id },
      data: { status: "PENDING" },
      include: { items: true, user: true }
    });
  }

  console.log(`Using Order ID: ${order.id}`);
  console.log(`Current Order Status: ${order.status}`);
  console.log("Order items:");
  for (const item of order.items) {
    const prod = await prisma.product.findUnique({ where: { id: item.productId } });
    console.log(` - Product: ${prod.name} (Stock: ${prod.stock}), Qty: ${item.quantity}`);
  }

  // Build webhook payload
  const obj = {
    amount_cents: Math.round(order.totalAmount * 100),
    created_at: new Date().toISOString(),
    currency: "EGP",
    error_occured: true,
    has_parent_transaction: false,
    id: 9999999, // dummy txn id
    integration_id: 5660937,
    is_3d_secure: true,
    is_auth: false,
    is_capture: false,
    is_refunded: false,
    is_standalone_payment: true,
    is_voided: false,
    order: {
      id: 8888888, // dummy paymob order id
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

  console.log("Calculated HMAC:", hmacCalculated);

  console.log("Sending POST request to simulate failed payment webhook...");
  const response = await fetch(`http://localhost:3000/api/paymob/webhook?hmac=${hmacCalculated}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ obj })
  });

  const resText = await response.text();
  console.log("Webhook Response Status:", response.status);
  console.log("Webhook Response Body:", resText);

  // Check order status and stock after webhook
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true }
  });

  console.log(`Updated Order Status (Should be FAILED): ${updatedOrder.status}`);
  for (const item of updatedOrder.items) {
    const prod = await prisma.product.findUnique({ where: { id: item.productId } });
    console.log(` - Product: ${prod.name} (Stock updated: ${prod.stock}), Qty: ${item.quantity}`);
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Error running script:", err);
});
