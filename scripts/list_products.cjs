const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, price: true, status: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('TOTAL PRODUCTS:', products.length);
  const catCount = {};
  products.forEach(p => {
    catCount[p.category] = (catCount[p.category] || 0) + 1;
  });
  console.log('CATEGORY COUNTS:', JSON.stringify(catCount, null, 2));
  console.log('\nPRODUCTS LIST:');
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] "${p.name}" | Status: ${p.status} | Category: "${p.category}"`);
  });
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
