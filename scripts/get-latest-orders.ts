import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 Fetching latest orders from database...\n");
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  if (orders.length === 0) {
    console.log("🫙 No orders found in the database yet!");
    return;
  }

  orders.forEach((order, index) => {
    console.log(`${index + 1}. Order ID: ${order.id}`);
    console.log(`   Customer: ${order.user?.name || "Guest"} (${order.clientEmail || order.user?.email || "N/A"})`);
    console.log(`   Total: ${order.totalAmount} EGP`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Date: ${order.createdAt.toLocaleDateString()}`);
    console.log(`----------------------------------------`);
  });

  console.log("\n💡 Copy any Order ID from above and run the simulator:");
  console.log("   npx tsx -r dotenv/config scripts/simulate-payment.ts <order_id>");
}

main()
  .catch((e) => {
    console.error("❌ Error fetching orders:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
