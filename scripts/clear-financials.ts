import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting cleanup of all financial earnings, transactions, and balances...");

  const deletedTransactions = await prisma.artisanTransaction.deleteMany({});
  console.log(`Successfully deleted ${deletedTransactions.count} financial ledger transactions.`);

  const updatedBalances = await prisma.artisanBalance.updateMany({
    data: {
      pending: 0.0,
      withdrawable: 0.0,
      withdrawn: 0.0,
    },
  });
  console.log(`Successfully reset ${updatedBalances.count} artisan balances to zero.`);

  console.log("Financial database records cleared successfully.");
}

main()
  .catch((e) => {
    console.error("Error during financial database cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
