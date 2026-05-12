import { prisma } from "../src/lib/prisma";

async function main() {
  // Configurable holding window (7 days is standard ecommerce escrow)
  const HOLDING_DAYS = 7;
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - HOLDING_DAYS);

  console.log(`⏳ Running escrow clearance check...`);
  console.log(`👉 Scanning for SALE transactions created before: ${thresholdDate.toLocaleString()}\n`);

  // Find all pending sales older than the threshold
  const pendingSales = await prisma.artisanTransaction.findMany({
    where: {
      type: "SALE",
      status: "PENDING",
      createdAt: {
        lt: thresholdDate
      }
    }
  });

  if (pendingSales.length === 0) {
    console.log("🫙 No pending escrow balances match the clearance criteria today.");
    return;
  }

  console.log(`✅ Found ${pendingSales.length} transaction(s) eligible for clearance.`);

  let clearedCount = 0;

  // Process each transaction atomically
  for (const tx of pendingSales) {
    try {
      await prisma.$transaction(async (prismaTx) => {
        // 1. Mark transaction as CLEARED
        await prismaTx.artisanTransaction.update({
          where: { id: tx.id },
          data: { status: "CLEARED" }
        });

        // 2. Transfer funds from pending to withdrawable
        await prismaTx.artisanBalance.update({
          where: { artisanId: tx.artisanId },
          data: {
            pending: { decrement: tx.amount },
            withdrawable: { increment: tx.amount }
          }
        });
      });

      console.log(`   - Cleared transaction ${tx.id} (${tx.amount} EGP) for Artisan: ${tx.artisanId}`);
      clearedCount++;
    } catch (err) {
      console.error(`   - ❌ Failed to clear transaction ${tx.id}:`, err);
    }
  }

  console.log(`\n🎉 Escrow process completed! Successfully cleared ${clearedCount} transaction(s).`);
}

main()
  .catch((e) => {
    console.error("❌ Escrow script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
