
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const productId = 'cmnwa747p0002tkf2dwtz5i14';
    const product = await prisma.product.findUnique({ where: { id: productId } });
    console.log(`Product ${productId} exists:`, !!product);
  } finally {
    await prisma.$disconnect();
  }
}

main();
