import "dotenv/config";
import { sendVerificationEmail, sendCustomEmail } from "../lib/mail";

const TO = "hazemyasserprg@gmail.com";

async function main() {
  const target = process.argv[2]?.toLowerCase();
  console.log(`Sending email test (filter: ${target || "all"})...\n`);

  // 1. Artisan — the actual verification email users receive
  if (!target || target === "artisan") {
    const r1 = await sendVerificationEmail(TO, "test-token-preview-123", "en");
    console.log("artisan (verification email):", r1.success ? "✅ Sent" : "❌ Failed");
  }

  // 2. Corporate — matching the meeting invitation template from the preview
  if (!target || target === "corporate") {
  const corporateBody = `
    <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 16px 0;">Dear Colleague,</p>
    <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 16px 0;">
      You are cordially invited to an executive alignment meeting to review ongoing objectives, strategic milestones, and operational priorities.
    </p>
    <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Meeting Details:</p>
    <ul style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 16px 0; padding-left: 24px;">
      <li style="margin-bottom: 6px;"><strong>Date & Time:</strong> Thursday, Oct 15 at 11:00 AM</li>
      <li style="margin-bottom: 6px;"><strong>Location / Link:</strong> Google Meet / Zoom Link or Conference Room</li>
      <li style="margin-bottom: 6px;"><strong>Duration:</strong> 45 minutes</li>
      <li style="margin-bottom: 6px;"><strong>Agenda:</strong> Sales performance review and operational action items</li>
    </ul>
    <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #334155; margin: 0;">Please confirm your attendance by replying to this email.</p>
  `;
  const r2 = await sendCustomEmail(TO, "Meeting Invitation: Strategic Alignment & Review | Giftisan Management", corporateBody, "ltr", {
    templateStyle: "corporate",
    senderName: "Giftisan Management",
    senderEmail: "management@giftisan.com",
  });
    console.log("corporate (meeting invitation):", r2.success ? "✅ Sent" : "❌ Failed");
  }

  // 3. Minimal — actual executive letter style
  if (!target || target === "minimal") {
    const minimalBody = `
      <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #374151; line-height: 1.8; margin: 0 0 18px 0;">Hazem,</p>
      <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #374151; line-height: 1.8; margin: 0 0 18px 0;">
        I wanted to personally reach out to say how excited we are to have you join the Giftisan founding circle. Your craft and vision are exactly what this platform was built around.
      </p>
      <p style="font-family: Helvetica, Arial, sans-serif; font-size: 15px; color: #374151; line-height: 1.8; margin: 0;">
        Looking forward to building something great together.
      </p>
    `;
    const r3 = await sendCustomEmail(TO, "A personal note from the Giftisan Founder", minimalBody, "ltr", {
      templateStyle: "minimal",
      senderName: "Hazem — Giftisan Founder",
      senderEmail: "management@giftisan.com",
    });
    console.log("minimal (founder letter):", r3.success ? "✅ Sent" : "❌ Failed");
  }

  console.log("\nDone!");
}

main().catch(console.error);
