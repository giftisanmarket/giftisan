const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const product = await prisma.product.findFirst();
  if (product && product.images && product.images.length > 0) {
    console.log('Product Image Prefix:', product.images[0].substring(0, 100));
    console.log('Image Length:', product.images[0].length);
  } else {
    console.log('No products found or no images.');
  }

  const artisan = await prisma.artisanProfile.findFirst();
  if (artisan) {
    console.log('Artisan Avatar Prefix:', artisan.avatar?.substring(0, 100));
    console.log('Artisan Banner Prefix:', artisan.bannerImage?.substring(0, 100));
  }
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
