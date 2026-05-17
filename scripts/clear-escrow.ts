/**
 * One-off admin script: move all PENDING escrow → Withdrawable
 * for the artisan whose user email is support@giftisan.com
 *
 * Run with:  npx tsx scripts/clear-escrow.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const artisan = await prisma.artisanProfile.findFirst({
    where: { user: { email: "support@giftisan.com" } },
    include: { balances: true },
  });

  if (!artisan) {
    console.error("❌  No artisan found for support@giftisan.com");
    return;
  }
  console.log(`✅  Found artisan: ${artisan.id}`);

  const balance = artisan.balances[0];
  if (!balance) {
    console.error("❌  Artisan has no balance record");
    return;
  }

  const pendingAmount = balance.pending;
  console.log(`💰  Pending escrow: ${pendingAmount} EGP`);

  if (pendingAmount <= 0) {
    console.log("ℹ️   Nothing to move — pending is already 0");
    return;
  }

  const updatedTxns = await prisma.artisanTransaction.updateMany({
    where: { artisanId: artisan.id, status: "PENDING" },
    data: { status: "CLEARED" },
  });
  console.log(`🔄  Marked ${updatedTxns.count} transaction(s) as CLEARED`);

  const updatedBalance = await prisma.artisanBalance.update({
    where: { artisanId: artisan.id },
    data: {
      withdrawable: { increment: pendingAmount },
      pending: 0,
    },
  });

  console.log(
    `✅  Done! Withdrawable: ${updatedBalance.withdrawable} EGP | Pending: ${updatedBalance.pending} EGP`
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => pool.end());
