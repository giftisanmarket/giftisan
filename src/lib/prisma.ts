import "dotenv/config";
// Force reload to pick up schema changes
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
  },
  max: 4, // Restrict active connections per Next.js server instance to prevent socket exhaustion on Neon
  idleTimeoutMillis: 30000, // Close idle pool connections after 30 seconds
  connectionTimeoutMillis: 5000, // Fail fast if Postgres is experiencing peak loads
});

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
