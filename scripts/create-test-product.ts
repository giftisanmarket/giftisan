import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- 2026 Live Test Product Setup ---');

  // 1. Find an approved artisan
  const artisan = await prisma.artisanProfile.findFirst({
    where: { status: 'APPROVED' },
    include: { user: true }
  });

  if (!artisan) {
    console.error('No approved artisan found. Please approve an artisan first.');
    return;
  }

  console.log(`Using Artisan: ${artisan.studioName || artisan.user?.name}`);

  // 2. Create the test product
  const testProduct = await prisma.product.upsert({
    where: { slug: 'live-test-product-2026' },
    update: {
      price: 10,
      status: 'APPROVED'
    },
    create: {
      name: '2026 Live Test Product',
      slug: 'live-test-product-2026',
      description: 'A 10.00 EGP product created specifically for verifying the live Paymob integration for the 2026 season launch.',
      price: 10,
      images: ['https://res.cloudinary.com/dlnnwqgob/image/upload/v1714488310/placeholder_d49hxw.jpg'],
      category: 'Art & Collectibles',
      status: 'APPROVED',
      stock: 99,
      artisanId: artisan.id
    }
  });

  console.log('--- SUCCESS ---');
  console.log(`Product Name: ${testProduct.name}`);
  console.log(`Live URL: https://www.giftisan.com/en/products/${testProduct.slug}`);
  console.log('Action: Visit the URL above and attempt a real checkout to verify the live payment system.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
