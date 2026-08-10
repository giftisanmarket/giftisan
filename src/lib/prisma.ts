import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// DATABASE_URL must be set via environment variables — never hardcode credentials here
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Check your .env file."
  );
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 4, // Restrict active connections per Next.js server instance to prevent socket exhaustion on Neon
  idleTimeoutMillis: 30000, // Close idle pool connections after 30 seconds
  connectionTimeoutMillis: 5000, // Fail fast if Postgres is experiencing peak loads
});

const adapter = new PrismaPg(pool);

// Standard singleton: reuse global instance in dev to avoid hot-reload leaks,
// but re-instantiate if schema has been regenerated with new models.
const existingPrisma = globalForPrisma.prisma;
export const prisma = (existingPrisma && (existingPrisma as any).artisanBioLink)
  ? existingPrisma
  : new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

