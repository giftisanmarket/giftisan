import { prisma } from "../src/lib/prisma";

async function main() {
  const keepId = "cmslqj3cd000004l87dxycd7i";
  console.log(`Checking orders in database... Target to keep: ${keepId}`);

  const allOrders = await prisma.order.findMany({
    select: {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      clientEmail: true,
      user: { select: { name: true, email: true } }
    }
  });

  console.log(`Found ${allOrders.length} total orders in database:`);
  for (const o of allOrders) {
    console.log(`- ID: ${o.id} | Amount: ${o.totalAmount} | Status: ${o.status} | Email: ${o.clientEmail || o.user?.email}`);
  }

  const targetOrder = allOrders.find(o => o.id === keepId || o.id.includes("cmslqj3cd"));
  if (targetOrder) {
    console.log(`\n🎯 Found target order to KEEP: ${targetOrder.id}`);
  } else {
    console.log(`\n⚠️ Warning: Exact target order ${keepId} not found among existing orders.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
