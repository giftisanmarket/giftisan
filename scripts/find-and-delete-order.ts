import { prisma } from "../src/lib/prisma";

async function main() {
  const query = process.argv[2];
  if (!query) {
    console.error("❌ Please provide an Order ID or a prefix (e.g. cmq585fy)");
    process.exit(1);
  }

  console.log(`🔍 Searching for order matching: "${query}"...`);

  const orders = await prisma.order.findMany({
    where: {
      id: {
        contains: query,
        mode: "insensitive"
      }
    },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: {
              artisan: true
            }
          }
        }
      },
      transactions: true
    }
  });

  if (orders.length === 0) {
    console.log("🫙 No matching orders found.");
    return;
  }

  if (orders.length > 1) {
    console.log(`⚠️ Found multiple matching orders (${orders.length}):`);
    orders.forEach((o) => {
      console.log(`- ID: ${o.id} | Customer: ${o.user?.name || o.clientEmail} | Amount: ${o.totalAmount} EGP`);
    });
    console.log("Please specify a more precise Order ID.");
    return;
  }

  const order = orders[0];
  console.log(`✅ Found Order:`);
  console.log(`   ID: ${order.id}`);
  console.log(`   Customer: ${order.user?.name || "Guest"} (${order.clientEmail || order.user?.email || "N/A"})`);
  console.log(`   Amount: ${order.totalAmount} EGP`);
  console.log(`   Status: ${order.status}`);
  console.log(`   Created At: ${order.createdAt}`);
  console.log(`   Items: ${order.items.length}`);
  order.items.forEach((item) => {
    console.log(`     - ${item.product.name} (Qty: ${item.quantity}, Price: ${item.price} EGP, Artisan: ${item.product.artisan.studioName})`);
  });
  console.log(`   Transactions: ${order.transactions.length}`);
  order.transactions.forEach((tx) => {
    console.log(`     - ID: ${tx.id} | Amount: ${tx.amount} EGP | Type: ${tx.type} | Status: ${tx.status} | Artisan ID: ${tx.artisanId}`);
  });

  console.log("\n🚮 Deleting order and reverting financial transactions...");

  await prisma.$transaction(async (tx) => {
    // Revert artisan balances based on transactions
    for (const transaction of order.transactions) {
      if (transaction.type === "SALE") {
        if (transaction.status === "PENDING") {
          console.log(`   Reverting pending sale of ${transaction.amount} EGP for artisan ${transaction.artisanId}...`);
          await tx.artisanBalance.update({
            where: { artisanId: transaction.artisanId },
            data: {
              pending: { decrement: transaction.amount }
            }
          });
        } else if (transaction.status === "CLEARED") {
          console.log(`   Reverting cleared sale of ${transaction.amount} EGP for artisan ${transaction.artisanId}...`);
          await tx.artisanBalance.update({
            where: { artisanId: transaction.artisanId },
            data: {
              withdrawable: { decrement: transaction.amount }
            }
          });
        }
      }
    }

    // Delete related transactions
    if (order.transactions.length > 0) {
      const deletedTxs = await tx.artisanTransaction.deleteMany({
        where: { orderId: order.id }
      });
      console.log(`   Deleted ${deletedTxs.count} artisan transactions.`);
    }

    // Delete order items (although cascade onDelete is active, doing it explicitly is safer)
    const deletedItems = await tx.orderItem.deleteMany({
      where: { orderId: order.id }
    });
    console.log(`   Deleted ${deletedItems.count} order items.`);

    // Delete the order itself
    await tx.order.delete({
      where: { id: order.id }
    });
    console.log(`   Deleted order ${order.id}.`);
  });

  console.log("\n✨ Order successfully cleared from the website database!");
}

main()
  .catch((e) => {
    console.error("❌ Error clearing order:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
