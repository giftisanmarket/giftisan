import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 Scanning for duplicate REFUND_DEBIT transactions and calculating balances...");

  // 1. Find all refund claims
  const refundClaims = await prisma.refundRequest.findMany({
    where: { status: "APPROVED" }
  });

  console.log(`Found ${refundClaims.length} approved refund claim(s).`);

  // 2. For each claim, check for duplicate REFUND_DEBIT transactions for the same orderId
  for (const claim of refundClaims) {
    const debits = await prisma.artisanTransaction.findMany({
      where: {
        orderId: claim.orderId,
        type: "REFUND_DEBIT"
      },
      orderBy: { createdAt: "asc" }
    });

    if (debits.length > 1) {
      console.log(`⚠️ Order ${claim.orderId} has ${debits.length} REFUND_DEBIT transactions! Keeping 1, deleting ${debits.length - 1}...`);
      const toDelete = debits.slice(1);
      for (const d of toDelete) {
        await prisma.artisanTransaction.delete({
          where: { id: d.id }
        });
        console.log(`   - Deleted duplicate tx: ${d.id} (${d.amount} EGP)`);
      }
    }

    // Also ensure SALE transactions for this refunded order are marked FAILED
    const pendingSales = await prisma.artisanTransaction.findMany({
      where: {
        orderId: claim.orderId,
        type: "SALE",
        status: "PENDING"
      }
    });

    if (pendingSales.length > 0) {
      console.log(`🔄 Marking ${pendingSales.length} dangling PENDING sale(s) as FAILED for refunded order ${claim.orderId}...`);
      await prisma.artisanTransaction.updateMany({
        where: {
          orderId: claim.orderId,
          type: "SALE",
          status: "PENDING"
        },
        data: { status: "FAILED" }
      });
    }
  }

  // 3. Re-calculate and normalize all artisan balances based on existing transactions
  const artisans = await prisma.artisanProfile.findMany({
    include: {
      balances: true,
      transactions: true
    }
  });

  console.log(`\n📊 Recalculating balances for ${artisans.length} artisan(s)...`);

  for (const artisan of artisans) {
    const txs = artisan.transactions;
    
    // Pending: sum of active PENDING sales
    const pending = txs
      .filter(t => t.type === "SALE" && t.status === "PENDING")
      .reduce((sum, t) => sum + Math.max(0, t.amount), 0);

    // Withdrawable: CLEARED sales minus completed PAYOUTs and completed REFUND_DEBITs (if debited from withdrawable)
    const clearedSales = txs
      .filter(t => t.type === "SALE" && t.status === "CLEARED")
      .reduce((sum, t) => sum + Math.max(0, t.amount), 0);

    const completedPayouts = txs
      .filter(t => t.type === "PAYOUT" && t.status === "COMPLETED")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const withdrawable = Math.max(0, clearedSales - completedPayouts);

    console.log(`Artisan ${artisan.studioName || artisan.id}:`);
    console.log(`   Pending: ${pending} EGP (was ${artisan.balances?.[0]?.pending ?? 0})`);
    console.log(`   Withdrawable: ${withdrawable} EGP (was ${artisan.balances?.[0]?.withdrawable ?? 0})`);

    await prisma.artisanBalance.upsert({
      where: { artisanId: artisan.id },
      create: {
        artisanId: artisan.id,
        pending,
        withdrawable,
        withdrawn: completedPayouts
      },
      update: {
        pending,
        withdrawable,
        withdrawn: completedPayouts
      }
    });
  }

  console.log("\n✅ Database financial ledger and balances synchronized successfully!");
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
