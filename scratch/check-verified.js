const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const verifiedArtisans = await prisma.artisanProfile.findMany({
    where: { isVerified: true },
    include: { user: { select: { name: true } } }
  });
  
  console.log('Verified Artisans:');
  verifiedArtisans.forEach(a => console.log(`- ${a.user.name} (${a.userId})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
