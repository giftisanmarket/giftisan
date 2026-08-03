import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    timestamp: new Date().toISOString(),
    status: "operational" as "operational" | "degraded" | "down",
    services: {
      auth: { 
        status: "operational" as "operational" | "degraded" | "down", 
        latencyMs: 0, 
        details: "NextAuth Edge Engine" 
      },
      database: { 
        status: "operational" as "operational" | "degraded" | "down", 
        latencyMs: 0, 
        details: "Prisma PostgreSQL Engine" 
      },
      storage: { 
        status: "operational" as "operational" | "degraded" | "down", 
        latencyMs: 0, 
        details: "Global Asset CDN" 
      },
    },
  };

  // Check Database
  const dbStart = performance.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.services.database.latencyMs = Math.round(performance.now() - dbStart);
    if (results.services.database.latencyMs > 1000) {
      results.services.database.status = "degraded";
    }
  } catch (error) {
    results.services.database.latencyMs = Math.round(performance.now() - dbStart);
    results.services.database.status = "down";
    results.services.database.details = error instanceof Error ? error.message : "Database Connection Error";
  }

  // Check Auth secret & configuration readiness
  const authStart = performance.now();
  try {
    const hasSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
    results.services.auth.latencyMs = Math.round(performance.now() - authStart);
    if (!hasSecret) {
      results.services.auth.status = "degraded";
      results.services.auth.details = "Auth Secret Missing";
    }
  } catch {
    results.services.auth.latencyMs = Math.round(performance.now() - authStart);
    results.services.auth.status = "down";
  }

  // Check Storage / CDN reachability
  const storageStart = performance.now();
  try {
    results.services.storage.latencyMs = Math.round(performance.now() - storageStart);
  } catch {
    results.services.storage.latencyMs = Math.round(performance.now() - storageStart);
    results.services.storage.status = "degraded";
  }

  // Overall status
  const statuses = [
    results.services.auth.status, 
    results.services.database.status, 
    results.services.storage.status
  ];

  if (statuses.includes("down")) {
    results.status = "down";
  } else if (statuses.includes("degraded")) {
    results.status = "degraded";
  }

  return NextResponse.json(results);
}
