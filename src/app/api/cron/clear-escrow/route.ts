import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * AUTOMATED ESCROW CLEARANCE CRON ENDPOINT
 * 
 * This API endpoint is meant to be called daily by a Serverless Cron scheduler (e.g. Vercel Cron, GitHub Actions).
 * It automatically moves cleared funds from PENDING escrow to WITHDRAWABLE balances.
 * 
 * Path: GET /api/cron/clear-escrow
 * Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authorization Guard
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
      if (!cronSecret) {
        console.error("❌ CRON_SECRET is not configured in production environment variables!");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
      }
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      // In development, allow triggering without bearer token for local testing convenience
      console.log("ℹ️ [Cron Dev Mode] Skipping Authorization check for local development simulation.");
    }

    // 2. Configurable holding window (7 days is standard ecommerce escrow)
    const HOLDING_DAYS = 7;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - HOLDING_DAYS);

    console.log(`⏳ [Cron Escrow] Scanning for SALE transactions created before: ${thresholdDate.toISOString()}`);

    // 3. Find pending sale transactions older than the threshold
    const pendingSales = await prisma.artisanTransaction.findMany({
      where: {
        type: "SALE",
        status: "PENDING",
        createdAt: {
          lt: thresholdDate
        }
      }
    });

    if (pendingSales.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending escrow balances matched the clearance criteria today."
      });
    }

    let clearedCount = 0;
    const clearedTransactionsLog: Array<{ txId: string; artisanId: string; amount: number }> = [];

    // 4. Process each transaction atomically
    for (const tx of pendingSales) {
      try {
        await prisma.$transaction(async (prismaTx) => {
          // A. Mark transaction as CLEARED
          await prismaTx.artisanTransaction.update({
            where: { id: tx.id },
            data: { status: "CLEARED" }
          });

          // B. Transfer funds from pending to withdrawable
          await prismaTx.artisanBalance.update({
            where: { artisanId: tx.artisanId },
            data: {
              pending: { decrement: tx.amount },
              withdrawable: { increment: tx.amount }
            }
          });
        });

        clearedTransactionsLog.push({ txId: tx.id, artisanId: tx.artisanId, amount: tx.amount });
        clearedCount++;
      } catch (err: any) {
        console.error(`❌ [Cron Escrow] Failed to clear transaction ${tx.id} for artisan ${tx.artisanId}:`, err);
      }
    }

    console.log(`🎉 [Cron Escrow] Process completed. Successfully cleared ${clearedCount} transaction(s).`);

    return NextResponse.json({
      success: true,
      clearedCount,
      clearedTransactions: clearedTransactionsLog
    });

  } catch (error: any) {
    console.error("❌ [Cron Escrow] Unexpected error during execution:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error.message || "An unexpected error occurred." 
    }, { status: 500 });
  }
}
