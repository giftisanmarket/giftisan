import { prisma } from "../src/lib/prisma";

async function main() {
  const keepOrderId = "cmslqj3cd000004l87dxycd7i";
  console.log(`🧹 Clearing all orders EXCEPT: ${keepOrderId} ...`);

  // Verify target order exists
  const targetOrder = await prisma.order.findUnique({
    where: { id: keepOrderId },
    include: {
      items: true,
      refundRequests: true
    }
  });

  if (!targetOrder) {
    console.error(`❌ Target order ${keepOrderId} not found! Aborting.`);
    process.exit(1);
  }

  console.log(`✅ Verified target order to KEEP: ${targetOrder.id} (${targetOrder.totalAmount} EGP, status: ${targetOrder.status})`);

  await prisma.$transaction(async (tx) => {
    // 1. Delete Refund Requests for all other orders
    const deletedRefunds = await tx.refundRequest.deleteMany({
      where: {
        orderId: { not: keepOrderId }
      }
    });
    console.log(`Deleted ${deletedRefunds.count} refund requests from other orders.`);

    // 2. Delete Artisan Transactions for all other orders
    const deletedTransactions = await tx.artisanTransaction.deleteMany({
      where: {
        orderId: { not: keepOrderId }
      }
    });
    console.log(`Deleted ${deletedTransactions.count} artisan transactions from other orders.`);

    // 3. Delete Order Items for all other orders
    const deletedOrderItems = await tx.orderItem.deleteMany({
      where: {
        orderId: { not: keepOrderId }
      }
    });
    console.log(`Deleted ${deletedOrderItems.count} order items from other orders.`);

    // 4. Delete all other Orders
    const deletedOrders = await tx.order.deleteMany({
      where: {
        id: { not: keepOrderId }
      }
    });
    console.log(`Deleted ${deletedOrders.count} other orders.`);

    // 5. Recalculate and sync all artisan balances
    const artisans = await tx.artisanProfile.findMany({
      include: {
        transactions: true,
        balances: true
      }
    });

    for (const artisan of artisans) {
      const txs = artisan.transactions;
      
      const pending = txs
        .filter(t => t.type === "SALE" && t.status === "PENDING")
        .reduce((sum, t) => sum + Math.max(0, t.amount), 0);

      const clearedSales = txs
        .filter(t => t.type === "SALE" && t.status === "CLEARED")
        .reduce((sum, t) => sum + Math.max(0, t.amount), 0);

      const completedPayouts = txs
        .filter(t => t.type === "PAYOUT" && t.status === "COMPLETED")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const withdrawable = Math.max(0, clearedSales - completedPayouts);

      await tx.artisanBalance.upsert({
        where: { artisanId: artisan.id },
        create: {
          artisanId: artisan.id,
          pending,
          withdrawable,
          withdrawn: completedPayouts
        },
        update: {
          pending,
          withdrawable,
          withdrawn: completedPayouts
        }
      });
    }
  });

  const remainingOrders = await prisma.order.findMany({});
  console.log(`\n🎉 Done! Database now contains ${remainingOrders.length} order:`);
  for (const o of remainingOrders) {
    console.log(`   - Order #${o.id} | Amount: ${o.totalAmount} EGP | Status: ${o.status}`);
  }
}

main()
  .catch((e) => {
    console.error("Error clearing orders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
