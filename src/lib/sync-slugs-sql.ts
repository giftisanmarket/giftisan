import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Syncing slugs via SQL...");
  
  // Products
  const res1 = await prisma.$executeRawUnsafe(`
    UPDATE "Product" 
    SET "slug" = LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || RIGHT("id", 7)
    WHERE "slug" IS NULL;
  `);
  console.log(`Updated ${res1} products`);

  // Artisans
  const res2 = await prisma.$executeRawUnsafe(`
    UPDATE "ArtisanProfile" 
    SET "slug" = LOWER(REGEXP_REPLACE(COALESCE("studioName", 'artisan'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || RIGHT("id", 4)
    WHERE "slug" IS NULL;
  `);
  console.log(`Updated ${res2} artisans`);

  console.log("Sync complete!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
