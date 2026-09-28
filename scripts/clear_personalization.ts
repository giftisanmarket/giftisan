import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔄 Removing personalization & variants from all products...\n");

  // 1. Delete all product variants
  const deletedVariants = await prisma.productVariant.deleteMany({});
  console.log(`🗑️  Deleted ${deletedVariants.count} product variants`);

  // 2. Reset all personalization fields on every product
  const updatedProducts = await prisma.product.updateMany({
    data: {
      canPersonalize: false,
      personalizationPrompt: null,
      requiresClientImage: false,
      clientImagePrompt: null,
    },
  });
  console.log(`✅ Cleared personalization on ${updatedProducts.count} products`);

  console.log("\n✅ Done!");
}

main()
  .catch(err => {
    console.error("❌ Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
