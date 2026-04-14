const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.artisanProfile.updateMany({
    data: { isVerified: false }
  });
  
  console.log(`Successfully unverified ${result.count} artisans. The marketplace is now fresh.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
