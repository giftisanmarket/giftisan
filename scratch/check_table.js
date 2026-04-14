
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Checking Message table structure...");
    // Try to find a message but just get the keys of the first one
    const msg = await prisma.message.findFirst();
    if (msg) {
      console.log("Keys in Message object:", Object.keys(msg));
    } else {
      console.log("No messages found, so we can't check keys this way.");
    }
  } catch (e) {
    console.error("Error checking table:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
