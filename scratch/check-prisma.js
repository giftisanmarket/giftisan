const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const fields = Object.keys(prisma.product.fields || {});
    console.log('Product fields:', fields);
    console.log('isFeatured exists:', fields.includes('isFeatured'));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
