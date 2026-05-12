import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("⏳ Force clearing ALL pending escrow balances to withdrawable balances for testing...");

  const pendingSales = await prisma.artisanTransaction.findMany({
    where: {
      type: "SALE",
      status: "PENDING"
    }
  });

  if (pendingSales.length === 0) {
    console.log("🫙 No pending transactions found to clear.");
    return;
  }

  console.log(`✅ Found ${pendingSales.length} transaction(s) to force-clear.`);

  let clearedCount = 0;

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

      console.log(`   - Force-cleared transaction ${tx.id} (${tx.amount} EGP)`);
      clearedCount++;
    } catch (err) {
      console.error(`   - ❌ Failed to clear transaction ${tx.id}:`, err);
    }
  }

  console.log(`\n🎉 Success! Force-cleared ${clearedCount} transaction(s).`);
  console.log(`👉 Refresh your browser to see the money move and the "Request Withdrawal" button appear!`);
}

main()
  .catch((e) => {
    console.error("❌ Force clear error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
