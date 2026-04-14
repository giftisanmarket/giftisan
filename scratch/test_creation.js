
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Testing Message creation with attachment...");
    // Try to create a dummy message
    const msg = await prisma.message.create({
      data: {
        content: "Test attachment column",
        senderId: "cmnxj74k10001mkf2h3m7aqw7",
        receiverId: "cmnvb1nj30000r4f21sr3e0u8",
        attachment: "test"
      }
    });
    console.log("Successfully created message with attachment!");
    // Delete it immediately
    await prisma.message.delete({ where: { id: msg.id } });
  } catch (e) {
    console.error("FAILED to create message with attachment:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
