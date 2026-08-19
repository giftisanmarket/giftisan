import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

// Force live sending
process.env.FORCE_SEND_EMAIL = "true";

import {
  sendVerificationEmail,
  sendOrderNotification,
} from "../src/lib/mail";

async function main() {
  const recipient = process.argv[2] || "hazemyasserprg@gmail.com";
  console.log(`\n======================================================`);
  console.log(`🧪 TESTING HYBRID EMAIL ARCHITECTURE`);
  console.log(`📬 Target Recipient: ${recipient}`);
  console.log(`======================================================\n`);

  console.log(`⏳ 1. Testing Brevo SMTP (Operational/Order Email)...`);
  const brevoResult = await sendOrderNotification(
    recipient,
    "Hazem Studio",
    "test_order_12345",
    2500,
    "en"
  );
  if (brevoResult.success) {
    console.log(`✅ [Brevo SMTP] Order email dispatched successfully!`);
  } else {
    console.error(`❌ [Brevo SMTP] Failed:`, brevoResult.error);
  }

  console.log(`\n⏳ 2. Testing Resend API (Security/Auth Email)...`);
  const resendResult = await sendVerificationEmail(
    recipient,
    "test_auth_token_999",
    "en"
  );
  if (resendResult.success) {
    console.log(`✅ [Resend API] Verification email dispatched successfully!`);
  } else {
    console.error(`❌ [Resend API] Failed:`, resendResult.error);
  }

  console.log(`\n======================================================`);
  console.log(`✨ Done! Please check your inbox / spam folder for:`);
  console.log(`   1. Order Email (sent via Brevo SMTP)`);
  console.log(`   2. Verification Email (sent via Resend API)`);
  console.log(`======================================================\n`);
}

main();
