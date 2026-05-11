import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🧹 Starting database orders cleanup...");

  // 1. Delete all orders (this cascades and deletes all OrderItem records automatically)
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`✅ Successfully deleted ${deletedOrders.count} order(s) from the database.`);

  // 2. Reset usedCount of all coupons back to 0
  const updatedCoupons = await prisma.coupon.updateMany({
    data: {
      usedCount: 0
    }
  });
  console.log(`✅ Successfully reset coupon redemptions for ${updatedCoupons.count} coupon campaigns.`);

  console.log("🎉 Cleanup complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error executing database cleanup script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
