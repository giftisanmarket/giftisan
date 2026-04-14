const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log('--- LATEST PRODUCTS ---');
  products.forEach(p => {
    console.log(`ID: ${p.id} | Slug: "${p.slug}" | Name: "${p.name}" | HasSpace: ${p.slug?.includes(' ')}`);
  });
  console.log('--- END ---');
}
main().catch(console.error).finally(() => prisma.$disconnect());
