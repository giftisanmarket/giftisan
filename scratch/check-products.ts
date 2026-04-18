import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      artisan: {
        select: {
          studioName: true,
          status: true
        }
      }
    }
  });

  console.log('--- ALL PRODUCTS ---');
  products.forEach(p => {
    console.log(`${p.status} | Product: ${p.name} | Studio: ${p.artisan.studioName} (${p.artisan.status})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
