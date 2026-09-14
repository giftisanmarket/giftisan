/**
 * Email Test Script
 * Run with: npx tsx src/scripts/test-emails.ts
 */

import "dotenv/config";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendOrderNotification,
  sendOrderStatusUpdateEmail,
  sendBuyerOrderReceiptEmail,
  sendArtisanApprovalEmail,
  sendMessageNotification,
  sendPayoutApprovedEmail,
} from "../lib/mail";

const TARGET = "hazemyasserprg@gmail.com";
const FAKE_TOKEN = "test-token-abc123xyz";
const FAKE_ORDER_ID = "ORD-20260914-TEST";

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log(`\n🚀 Sending test emails to: ${TARGET}\n${"─".repeat(55)}\n`);

  const tests = [
    { label: "📧 [1/12] Verification Email (EN)", fn: () => sendVerificationEmail(TARGET, FAKE_TOKEN, "en") },
    { label: "📧 [2/12] Verification Email (AR)", fn: () => sendVerificationEmail(TARGET, FAKE_TOKEN, "ar") },
    { label: "🔑 [3/12] Password Reset Email (EN)", fn: () => sendPasswordResetEmail(TARGET, FAKE_TOKEN, "en") },
    { label: "👋 [4/12] Welcome Email (EN)", fn: () => sendWelcomeEmail(TARGET, "Hazem", "en") },
    { label: "🛒 [5/12] New Order Notification (EN)", fn: () => sendOrderNotification(TARGET, "Hazem", FAKE_ORDER_ID, 850, "en") },
    { label: "📦 [6/12] Order Status: PROCESSING (EN)", fn: () => sendOrderStatusUpdateEmail(TARGET, "Hazem", FAKE_ORDER_ID, "PROCESSING", "Handwoven Linen Tote", undefined, undefined, undefined, "en") },
    { label: "🚚 [7/12] Order Status: SHIPPED (EN)", fn: () => sendOrderStatusUpdateEmail(TARGET, "Hazem", FAKE_ORDER_ID, "SHIPPED", "Handwoven Linen Tote", undefined, "EGY-2026-98765", "Bosta", "en") },
    { label: "✅ [8/12] Order Status: DELIVERED (EN)", fn: () => sendOrderStatusUpdateEmail(TARGET, "Hazem", FAKE_ORDER_ID, "DELIVERED", "Handwoven Linen Tote", "handwoven-linen-tote", undefined, undefined, "en") },
    { label: "🧾 [9/12] Buyer Order Receipt (EN)", fn: () => sendBuyerOrderReceiptEmail(TARGET, "Hazem", FAKE_ORDER_ID, 1250, [{ name: "Handwoven Linen Tote", quantity: 1, price: 850 }, { name: "Ceramic Pour-Over Set", quantity: 1, price: 400 }], "Cairo", "en") },
    { label: "🏆 [10/12] Artisan Studio Approved (EN)", fn: () => sendArtisanApprovalEmail(TARGET, "Hazem", "en") },
    { label: "💬 [11/12] New Message Notification (EN)", fn: () => sendMessageNotification(TARGET, "Hazem", "Sara (Collector)", "en") },
    { label: "💰 [12/12] Payout Approved (EN)", fn: () => sendPayoutApprovedEmail(TARGET, "Hazem", 1850, "INSTAPAY", "01012345678", "en") },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result.success) {
        console.log(`  ✅ ${test.label}`);
        passed++;
      } else {
        console.log(`  ❌ ${test.label}`);
        console.log(`     Error:`, (result as any).error);
        failed++;
      }
    } catch (e) {
      console.log(`  ❌ ${test.label} — threw:`, e);
      failed++;
    }
    await delay(600);
  }

  console.log(`\n${"─".repeat(55)}`);
  console.log(`📊 Results: ${passed} sent, ${failed} failed`);
  if (failed === 0) console.log("🎉 All emails sent! Check your inbox.\n");
  else console.log("⚠️  Some emails failed — check errors above.\n");
}

run().catch(console.error);
