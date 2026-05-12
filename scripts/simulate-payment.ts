import { prisma } from "../src/lib/prisma";

async function main() {
  const orderId = process.argv[2];
  if (!orderId) {
    console.error("❌ Error: Please provide an order ID as an argument.");
    console.log("👉 Example: npx tsx -r dotenv/config scripts/simulate-payment.ts <order_id>");
    process.exit(1);
  }

  console.log(`⏳ Processing simulated split for Order ID: ${orderId}...`);

  // Fetch order details with products and artisans
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              artisan: true
            }
          }
        }
      }
    }
  });

  if (!order) {
    console.error(`❌ Error: Order with ID "${orderId}" not found in database.`);
    process.exit(1);
  }

  // Prevent double crediting
  const existingTx = await prisma.artisanTransaction.findFirst({
    where: { orderId: order.id }
  });

  if (existingTx) {
    console.log(`⚠️ Warning: This order has already been processed in the financial ledger.`);
    console.log(`👉 Clear the database ledger if you want to rerun testing.`);
    return;
  }

  // Run transaction to split funds
  await prisma.$transaction(async (tx) => {
    // 1. Update order status to PROCESSING (if not already)
    if (order.status === "PENDING") {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" }
      });
    }

    // 2. Process ledger balances for each order item
    for (const item of order.items) {
      const product = item.product;
      const artisan = product.artisan;
      if (!artisan) continue;

      const itemTotal = item.price * item.quantity;
      const commission = artisan.commissionRate ?? 0.0; // e.g. 0.15 (15%)
      const adminShare = itemTotal * commission;
      const artisanShare = itemTotal - adminShare;

      // Log transaction
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

      // Update balance
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

  console.log(`\n🎉 Success! Simulated split-payment for Order ${orderId}!`);
  console.log(`👉 The artisan's PENDING balance has been successfully credited.`);
  console.log(`👉 Refresh your browser to see the updated cards inside the Payments tab.`);
}

main()
  .catch((e) => {
    console.error("❌ Simulation Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
