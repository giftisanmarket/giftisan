import { prisma } from "../src/lib/prisma";

async function main() {
  const argType = process.argv[2]; // "tracking" | "order" | "item"
  const argValue = process.argv[3];

  if (!argType || !argValue) {
    console.error("❌ Error: Missing parameters.");
    console.log("👉 Usage: npx tsx -r dotenv/config scripts/simulate-shipping-delivery.ts <type> <value>");
    console.log("   <type> can be: 'tracking', 'order', or 'item'");
    console.log("👉 Example: npx tsx -r dotenv/config scripts/simulate-shipping-delivery.ts tracking TRK-123456");
    process.exit(1);
  }

  console.log(`⏳ Initializing Shipping Carrier Webhook Simulation...`);
  console.log(`🔍 Input type: [${argType.toUpperCase()}] | Value: "${argValue}"\n`);

  // Let's call our webhook logic directly or simulate it
  let targetItems: any[] = [];

  if (argType === "tracking") {
    targetItems = await prisma.orderItem.findMany({
      where: { trackingNumber: argValue },
      include: { 
        product: true,
        order: true
      }
    });
  } else if (argType === "item") {
    const singleItem = await prisma.orderItem.findUnique({
      where: { id: argValue },
      include: { 
        product: true,
        order: true
      }
    });
    if (singleItem) targetItems = [singleItem];
  } else if (argType === "order") {
    targetItems = await prisma.orderItem.findMany({
      where: { orderId: argValue },
      include: { 
        product: true,
        order: true
      }
    });
  }

  if (targetItems.length === 0) {
    console.error(`❌ Error: Could not find any order items matching search criteria in the database.`);
    process.exit(1);
  }

  console.log(`📦 Found ${targetItems.length} matching order item(s). Processing delivery transitions...`);

  await prisma.$transaction(async (tx) => {
    for (const item of targetItems) {
      if (item.status === "DELIVERED") {
        console.log(`   - ⚠️ Item ${item.id} is already marked DELIVERED. Skipping.`);
        continue;
      }

      // Update order item status
      await tx.orderItem.update({
        where: { id: item.id },
        data: { 
          status: "DELIVERED"
        }
      });

      console.log(`   - ✅ Transitioned OrderItem ${item.id} status to "DELIVERED"`);

      // Reset transaction escrow clock to now
      const updatedTxs = await tx.artisanTransaction.updateMany({
        where: {
          orderId: item.orderId,
          artisanId: item.product.artisanId,
          type: "SALE",
          status: "PENDING"
        },
        data: {
          createdAt: new Date() // Force holding timer to start from this delivery moment
        }
      });

      console.log(`   - ⚡ Reset escrow clock for corresponding transaction. Started 7-day holding period from THIS MOMENT. (${updatedTxs.count} transactions affected).`);
    }

    // Auto escalate parent order
    for (const item of targetItems) {
      const parentOrder = await tx.order.findUnique({
        where: { id: item.orderId },
        include: { items: true }
      });

      if (parentOrder && parentOrder.status !== "DELIVERED") {
        const allDelivered = parentOrder.items.every(
          (i) => i.status === "DELIVERED" || targetItems.some(t => t.id === i.id)
        );

        if (allDelivered) {
          await tx.order.update({
            where: { id: parentOrder.id },
            data: { status: "DELIVERED" }
          });
          console.log(`   - 🚀 All items in order ${parentOrder.id} are delivered! Escales parent Order status to "DELIVERED".`);
        }
      }
    }
  });

  console.log(`\n🎉 Webhook Simulation completed successfully!`);
  console.log(`👉 The escrow countdown holds the funds securely for the next 7 days from now.`);
  console.log(`👉 Clear the escrow anytime by running: npm run clear-escrow (or scripts/clear-escrow.ts)`);
}

main()
  .catch((e) => {
    console.error("❌ Simulation Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
