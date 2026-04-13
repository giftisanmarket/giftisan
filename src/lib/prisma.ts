import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use environment variable with hardcoded fallback for debug stability
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Vk1WClEjyQN8@ep-sweet-bread-amgrccvn-pooler.c-5.us-east-1.aws.neon.tech/neondb?uselibpqcompat=true&sslmode=require";

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
