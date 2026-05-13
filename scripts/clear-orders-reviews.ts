import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting cleanup of all reviews and orders...");

  const deletedReviews = await prisma.review.deleteMany({});
  console.log(`Successfully deleted ${deletedReviews.count} reviews.`);

  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Successfully deleted ${deletedOrders.count} orders.`);

  console.log("Database cleanup completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
