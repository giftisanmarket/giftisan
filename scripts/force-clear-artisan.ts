import { prisma } from "../src/lib/prisma";

async function main() {
  const targetEmail = process.argv[2] || "support@giftisan.com";
  console.log(`⏳ Finding artisan with email: ${targetEmail}...`);

  const artisan = await prisma.artisanProfile.findFirst({
    where: {
      user: {
        email: targetEmail
      }
    },
    include: {
      user: true
    }
  });

  if (!artisan) {
    console.error(`❌ Artisan with email ${targetEmail} not found!`);
    return;
  }

  const balance = await prisma.artisanBalance.findUnique({
    where: { artisanId: artisan.id }
  });

  console.log(`✅ Found Artisan: ${artisan.studioName || artisan.user.name} (ID: ${artisan.id})`);
  console.log(`Current Balance: Pending = ${balance?.pending} EGP, Withdrawable = ${balance?.withdrawable} EGP`);

  const pendingSales = await prisma.artisanTransaction.findMany({
    where: {
      artisanId: artisan.id,
      type: "SALE",
      status: "PENDING"
    }
  });

  if (pendingSales.length === 0) {
    console.log(`🫙 No pending SALE escrow transactions found for ${targetEmail}.`);
    return;
  }

  console.log(`👉 Found ${pendingSales.length} pending escrow transaction(s) to settle immediately.`);

  let totalAmount = 0;
  for (const tx of pendingSales) {
    await prisma.$transaction(async (prismaTx) => {
      await prismaTx.artisanTransaction.update({
        where: { id: tx.id },
        data: { status: "CLEARED" }
      });

      await prismaTx.artisanBalance.update({
        where: { artisanId: tx.artisanId },
        data: {
          pending: { decrement: tx.amount },
          withdrawable: { increment: tx.amount }
        }
      });
    });
    totalAmount += tx.amount;
    console.log(`   - Cleared tx ${tx.id} (${tx.amount} EGP)`);
  }

  console.log(`\n🎉 Successfully moved ${totalAmount} EGP from Pending Escrow to Withdrawable for ${targetEmail}!`);
}

main()
  .catch((e) => {
    console.error("❌ Force clear script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
