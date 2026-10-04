import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Checking / Creating AbandonedCheckout table...");
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AbandonedCheckout" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "orderId" TEXT UNIQUE,
      "customerName" TEXT NOT NULL,
      "customerEmail" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "shippingAddress" TEXT,
      "shippingCity" TEXT,
      "totalAmount" DOUBLE PRECISION NOT NULL,
      "items" JSONB NOT NULL,
      "orderNotes" TEXT,
      "couponCode" TEXT,
      "discountApplied" DOUBLE PRECISION DEFAULT 0,
      "shippingCost" DOUBLE PRECISION DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'ABANDONED',
      "isContacted" BOOLEAN NOT NULL DEFAULT false,
      "adminNotes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AbandonedCheckout_customerEmail_idx" ON "AbandonedCheckout"("customerEmail");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AbandonedCheckout_customerPhone_idx" ON "AbandonedCheckout"("customerPhone");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AbandonedCheckout_createdAt_idx" ON "AbandonedCheckout"("createdAt");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AbandonedCheckout_status_idx" ON "AbandonedCheckout"("status");
  `);

  console.log("✅ AbandonedCheckout table created/verified successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
