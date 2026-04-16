import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = "https://www.giftisan.com/icon.png";
const SENDER = "Giftisan <support@giftisan.com>";

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://www.giftisan.com";
};

const BASE_URL = getBaseUrl();

const PRIMARY_COLOR = "#1a2c2c";
const ACCENT_COLOR = "#da7b5a";
const CREAM_BG = "#fcf9f1";

const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Inter:wght@400;600&display=swap');
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .heading { font-family: 'Outfit', sans-serif; }
  </style>
`;

const emailHeader = `
  ${emailStyles}
  <div style="text-align: center; padding: 40px 0 30px 0; background-color: ${PRIMARY_COLOR}; border-radius: 24px 24px 0 0;">
    <img src="${LOGO_URL}" alt="Giftisan" style="width: 64px; height: 64px; margin-bottom: 15px;">
    <div class="heading" style="font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: -0.02em;">Giftisan</div>
    <div style="font-size: 10px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; tracking: 0.2em; margin-top: 5px;">Handcrafted Mastery</div>
  </div>
`;

const emailFooter = `
  <div style="text-align: center; padding: 40px 20px; border-top: 1px solid rgba(0,0,0,0.05);">
    <p style="color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Proudly Based in Egypt • Supporting Local Artisans</p>
    <p style="color: #1a2c2c; font-weight: bold; font-size: 14px;">The Giftisan Team</p>
    <div style="margin-top: 20px; font-size: 11px; color: #d1d5db;">
      &copy; 2026 Giftisan. All rights reserved.
    </div>
  </div>
`;

export const sendWelcomeEmail = async (email: string, name: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: WELCOME EMAIL ---\nTarget: ${email}\nName: ${name}\n-----------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Welcome to the Circle | Giftisan',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 32px; margin-bottom: 20px; tracking: -0.02em;">Welcome to the Circle, ${name}!</h1>
              <p style="color: #4b5563; line-height: 1.8; font-size: 17px; margin-bottom: 30px;">We're honored to have you join our community of artisans and treasure hunters. Giftisan is a sanctum where craft meets soul.</p>
              <div style="margin: 40px 0;">
                <a href="${BASE_URL}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">Explore the Vault</a>
              </div>
              <p style="color: #9ca3af; font-size: 14px; font-weight: 500; font-style: italic;">Happy discovery!</p>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

export const sendOrderNotification = async (artisanEmail: string, artisanName: string, orderId: string, totalAmount: number) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ORDER NOTIFICATION ---\nTarget: ${artisanEmail}\nOrder: ${orderId}\nAmount: EGP ${totalAmount}\n----------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: artisanEmail,
      subject: 'New Commission: A treasure has been claimed!',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              <h1 class="heading" style="color: ${ACCENT_COLOR}; text-align: center; font-size: 32px; margin-bottom: 10px;">New Commission Alert!</h1>
              <p style="color: #4b5563; font-size: 17px; text-align: center; margin-bottom: 30px;">Hi ${artisanName}, a collector has just claimed a treasure from your studio.</p>
              
              <div style="background-color: #f9fafb; padding: 35px; border-radius: 20px; border: 1px solid #f3f4f6; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">Order Reference</p>
                <p style="margin: 0 0 25px 0; color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</p>
                
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">Total Commission</p>
                <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 32px; font-weight: bold;">EGP ${totalAmount.toLocaleString()}</p>
              </div>

              <p style="color: #4b5563; font-size: 16px; margin: 30px 0; text-align: center; line-height: 1.6;">Please log in to your **Studio Dashboard** to view shipping details and begin the fulfillment journey.</p>
              
              <div style="text-align: center;">
                <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em;">Enter Studio</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    return { success: false, error };
  }
};

export const sendMessageNotification = async (receiverEmail: string, receiverName: string, senderName: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: MESSAGE NOTIFICATION ---\nTarget: ${receiverEmail}\nSender: ${senderName}\n------------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: receiverEmail,
      subject: `New Dialogue from ${senderName} | Giftisan`,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <p style="color: #4b5563; font-size: 17px; margin-bottom: 20px;">Hi ${receiverName},</p>
              <h2 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 30px;"><strong>${senderName}</strong> has initiated a dialogue regarding a treasure.</h2>
              <div style="margin: 40px 0;">
                <a href="${BASE_URL}/profile/messages" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em;">Join Dialogue</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message notification email:', error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n--- 📧 DEV: VERIFICATION EMAIL ---");
    console.log(`Target: ${email}`);
    console.log(`Link:   ${confirmLink}`);
    console.log("----------------------------------\n");
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Verify your identity | Giftisan',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">Verify your identity</h1>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Before you explore the vault or open your studio, we need to verify your connection to the Inner Circle. Please confirm your email address below.</p>
              <div style="margin: 40px 0;">
                <a href="${confirmLink}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">Confirm Connection</a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; font-style: italic;">This link will expire in 24 hours.</p>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

export const sendOrderStatusUpdateEmail = async (email: string, name: string, orderId: string, status: string, productName: string, productSlug?: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ORDER STATUS UPDATE ---\nTarget: ${email}\nOrder: ${orderId}\nStatus: ${status}\n----------------------------------\n`);
    return { success: true };
  }
  const statusColors: Record<string, string> = {
    'PROCESSING': '#3b82f6',
    'SHIPPED': ACCENT_COLOR,
    'DELIVERED': '#10b981',
    'CANCELLED': '#ef4444'
  };

  const statusText: Record<string, string> = {
    'PROCESSING': 'is being prepared',
    'SHIPPED': 'has been shipped',
    'DELIVERED': 'has been delivered',
    'CANCELLED': 'has been cancelled'
  };

  const isDelivered = status === 'DELIVERED';
  const ctaLink = isDelivered && productSlug 
    ? `${BASE_URL}/products/${productSlug}#reviews` 
    : `${BASE_URL}/profile`;
  
  const subject = isDelivered 
    ? `Share Your Story: Your treasure has arrived! | Giftisan`
    : `Journey Update: Your treasure ${statusText[status] || 'is evolving'}`;

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: subject,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 30px;">${isDelivered ? 'Your Treasure has Arrived' : 'Journey Update'}</h1>
              <p style="color: #4b5563; font-size: 17px; line-height: 1.6;">Hi ${name}, your order for <strong>${productName}</strong> ${statusText[status] || 'is moving forward'}.</p>
              
              <div style="margin: 40px 0; background-color: #f9fafb; padding: 40px; border-radius: 24px; border: 1px solid #f3f4f6;">
                <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em; color: #9ca3af;">Current Milestone</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${statusColors[status] || PRIMARY_COLOR};">${status}</p>
                <p style="margin: 20px 0 0 0; font-size: 13px; font-weight: bold; color: #6b7280; font-family: monospace;">Ref: #${orderId.slice(0, 8)}</p>
              </div>

              ${isDelivered ? `
                <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">We hope this piece brings soul and beauty to your space. Artisans thrive on your feedback—would you take a moment to share your story or rate the craftsmanship?</p>
              ` : ''}
              
              <div style="margin-top: 40px;">
                <a href="${ctaLink}" style="background-color: ${isDelivered ? ACCENT_COLOR : PRIMARY_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px ${isDelivered ? 'rgba(218, 123, 90, 0.2)' : 'rgba(0,0,0,0.1)'};">${isDelivered ? 'Share Your Story' : 'Track Journey'}</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n--- 📧 DEV: PASSWORD RESET EMAIL ---");
    console.log(`Target: ${email}`);
    console.log(`Link:   ${resetLink}`);
    console.log("------------------------------------\n");
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Security: Access Recovery | Giftisan',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">Access Recovery</h1>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">We received a request to reclaim the connection to your Giftisan account. Click below to secure your enclave with a new password.</p>
              <div style="margin: 40px 0;">
                <a href="${resetLink}" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">Secure My Account</a>
              </div>
              <p style="color: #9ca3af; font-size: 12px; font-style: italic;">This recovery link will expire in 60 minutes.</p>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
};

export const sendInquiryNotification = async (name: string, email: string, message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log("\n--- 📧 DEV: NEW INQUIRY NOTIFICATION ---\nFrom:", name, "<", email, ">\nMessage:", message, "\n--------------------------------------\n");
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: "support@giftisan.com",
      subject: `New Inquiry: ${name} is reaching out | Giftisan`,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 20px; text-align: center;">New Inquiry Received</h1>
              
              <div style="background-color: #f9fafb; padding: 25px; border-radius: 20px; margin-bottom: 25px;">
                <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 15px;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 15px;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;"><strong>Message:</strong><br />${message}</p>
              </div>

              <div style="text-align: center;">
                <a href="mailto:${email}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em;">Reply to Customer</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending inquiry notification:', error);
    return { success: false, error };
  }
};
