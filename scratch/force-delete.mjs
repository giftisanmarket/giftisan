import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function forceDeleteUser() {
  const email = "giftisanmarket@gmail.com";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("Found user, deleting...", user.id);
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log("User successfully vaporized.");
    } else {
      console.log("No user found with that email. It's already gone.");
    }
  } catch (err) {
    console.error("Critical Failure:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

forceDeleteUser();
