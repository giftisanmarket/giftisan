import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🚮 Clearing all orders and financial records...');

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete Order Items first (FK dependency)
      const deletedOrderItems = await tx.orderItem.deleteMany({});
      console.log(`✅ Deleted ${deletedOrderItems.count} order items.`);

      // 2. Delete Artisan Transactions (FK dependency)
      const deletedTransactions = await tx.artisanTransaction.deleteMany({});
      console.log(`✅ Deleted ${deletedTransactions.count} artisan transactions.`);

      // 3. Delete Orders
      const deletedOrders = await tx.order.deleteMany({});
      console.log(`✅ Deleted ${deletedOrders.count} orders.`);

      // 4. Reset Artisan Balances
      const updatedBalances = await tx.artisanBalance.updateMany({
        data: {
          pending: 0,
          withdrawable: 0,
          withdrawn: 0
        }
      });
      console.log(`✅ Reset ${updatedBalances.count} artisan balances to zero.`);
    });

    console.log('\n✨ Database successfully cleared of all transactional data.');
  } catch (error) {
    console.error('❌ Failed to clear orders:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
