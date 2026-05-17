import { Resend } from 'resend';

import { SITE_URL } from './constants';

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = `${SITE_URL}/icon.png`;
const SENDER = "Giftisan <support@giftisan.com>";

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return SITE_URL;
};

const BASE_URL = getBaseUrl();

const PRIMARY_COLOR = "#1a2c2c";
const ACCENT_COLOR = "#da7b5a";
const CREAM_BG = "#fcf9f1";

const emailStyles = `
  <style>
    body { font-family: Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; width: 100% !important; }
    .heading { font-family: Helvetica, Arial, sans-serif; font-weight: bold; }
    .email-wrapper { width: 100%; background-color: #fcf9f1; padding: 30px; box-sizing: border-box; }
    .email-card { max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; }
    .email-body { padding: 40px; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 12px !important; }
      .email-card { border-radius: 16px !important; }
      .email-body { padding: 24px 20px !important; }
    }
  </style>
`;

const emailHeader = `
  ${emailStyles}
  <div style="text-align: center; padding: 40px 20px 30px 20px; background-color: ${PRIMARY_COLOR}; border-radius: 24px 24px 0 0;">
    <img src="${LOGO_URL}" alt="Giftisan" width="56" height="56" align="center" style="display: block; margin: 0 auto 14px auto; border: 0; outline: none; border-radius: 5px;">
    <div class="heading" style="font-size: 26px; font-weight: bold; color: #ffffff; letter-spacing: -0.02em; text-align: center;">Giftisan</div>
    <div style="font-size: 10px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 5px; text-align: center;">Handcrafted Mastery</div>
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
              <!-- English Section -->
              <div dir="ltr">
                <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 32px; margin-bottom: 20px; tracking: -0.02em;">Welcome to the Circle, ${name}!</h1>
                <p style="color: #4b5563; line-height: 1.8; font-size: 17px; margin-bottom: 30px;">We're honored to have you join our community of artisans and treasure hunters. Giftisan is a sanctum where craft meets soul.</p>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <!-- Arabic Section -->
              <div dir="rtl">
                <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 32px; margin-bottom: 20px; tracking: -0.02em;">مرحباً بك في الدائرة، ${name}!</h1>
                <p style="color: #4b5563; line-height: 2; font-size: 17px; margin-bottom: 30px;">نتشرف بانضمامك إلى مجتمعنا من الحرفيين ومقتني الكنوز. "جيفتيزان" هو الملاذ الذي تلتقي فيه الحرفة بالروح.</p>
              </div>

              <div style="margin: 40px 0;">
                <a href="${BASE_URL}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">Explore the Vault | اكتشف الخزائن</a>
              </div>
              <p style="color: #9ca3af; font-size: 14px; font-weight: 500; font-style: italic;">Happy discovery! | نتمنى لك اكتشافاً ممتعاً!</p>
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
      subject: 'New Sale: A treasure has been claimed! | مبيعة جديدة: تم اقتناء كنز من استوديو الخاص بك',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <!-- English Section -->
              <div dir="ltr">
                <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 32px; margin-bottom: 10px;">New Sale Alert!</h1>
                <p style="color: #4b5563; font-size: 17px; margin-bottom: 30px;">Hi ${artisanName}, a collector has just claimed a treasure from your studio.</p>
                
                <div style="background-color: #f9fafb; padding: 35px; border-radius: 20px; border: 1px solid #f3f4f6;">
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">Order Reference</p>
                  <p style="margin: 0 0 25px 0; color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</p>
                  
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">Your Earnings (0% Platform Fee)</p>
                  <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 32px; font-weight: bold;">EGP ${totalAmount.toLocaleString()}</p>
                </div>

                <p style="color: #4b5563; font-size: 16px; margin: 30px 0; line-height: 1.6;">Please log in to your **Studio Dashboard** to view shipping details and begin the fulfillment journey.</p>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <!-- Arabic Section -->
              <div dir="rtl">
                <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 32px; margin-bottom: 10px;">تنبيه مبيعة جديدة!</h1>
                <p style="color: #4b5563; font-size: 17px; margin-bottom: 30px;">أهلاً ${artisanName}، لقد قام مقتني كنوز باقتناء قطعة من الاستوديو الخاص بك الآن.</p>
                
                <div style="background-color: #f9fafb; padding: 35px; border-radius: 20px; border: 1px solid #f3f4f6;">
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">رقم الطلب</p>
                  <p style="margin: 0 0 25px 0; color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</p>
                  
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase; letter-spacing: 0.2em;">أرباحك (0% عمولة للمنصة)</p>
                  <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 32px; font-weight: bold;">${totalAmount.toLocaleString()} ج.م</p>
                </div>

                <p style="color: #4b5563; font-size: 16px; margin: 30px 0; line-height: 2;">يرجى تسجيل الدخول إلى **لوحة تحكم الاستوديو** لعرض تفاصيل الشحن والبدء في رحلة التنفيذ.</p>
              </div>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em;">Enter Studio | دخول الاستوديو</a>
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

export const sendOrderStatusUpdateEmail = async (
  email: string,
  name: string,
  orderId: string,
  status: string,
  productName: string,
  productSlug?: string,
  trackingNumber?: string,
  carrier?: string
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ORDER STATUS UPDATE ---\nTarget: ${email}\nOrder: ${orderId}\nStatus: ${status}\nCarrier: ${carrier || 'None'}\nTracking: ${trackingNumber || 'None'}\n----------------------------------\n`);
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

              ${status === 'SHIPPED' && trackingNumber ? `
                <div style="margin: 30px 0; padding: 25px; border-radius: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; text-align: left;">
                  <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 15px; font-weight: bold;">Shipment Information</h4>
                  <p style="margin: 0 0 5px 0; color: #14532d; font-size: 13px;"><strong>Carrier:</strong> ${carrier || 'Local Shipping Partner'}</p>
                  <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>Tracking ID:</strong> ${trackingNumber}</p>
                </div>
              ` : ''}

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

export const sendArtisanApprovalEmail = async (email: string, name: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ARTISAN APPROVAL EMAIL ---\nTarget: ${email}\nName: ${name}\n--------------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Welcome to the Guild: Your Studio is Live! | مرحباً بك في الدائرة: استوديو جيفتيزان الخاص بك جاهز!',
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <!-- English Section -->
              <div dir="ltr">
                <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 28px; margin-bottom: 20px;">Your Studio is Approved!</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Hi ${name}, our curators have reviewed your portfolio and we're thrilled to welcome you officially to the Giftisan Guild. Your studio is now live and ready to be discovered by collectors worldwide.</p>
                
                <div style="background-color: #f0fdf4; padding: 25px; border-radius: 20px; border: 1px solid #bbf7d0; margin-bottom: 30px; text-align: left;">
                  <p style="margin: 0; color: #166534; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.1em;">✨ 2026 Founding Member Status</p>
                  <p style="margin: 10px 0 0 0; color: #14532d; font-size: 14px; line-height: 1.6;">As an early partner, you've been granted **Founding Artisan** status. Enjoy **0% platform fees** and keep 100% of your earnings throughout the entire 2026 season.</p>
                </div>

                <div style="background-color: #f9fafb; padding: 25px; border-radius: 20px; border: 1px solid #f3f4f6; margin-bottom: 30px; text-align: left;">
                  <p style="margin: 0; color: ${PRIMARY_COLOR}; font-weight: bold; font-size: 14px;">Next steps for your journey:</p>
                  <ul style="color: #4b5563; font-size: 13px; margin-top: 10px; line-height: 1.8;">
                    <li>Verify your inventory levels</li>
                    <li>Complete your brand story in Studio Settings</li>
                    <li>Share your link with your social community</li>
                  </ul>
                </div>

                <div style="margin: 30px 0;">
                  <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Enter Your Studio</a>
                </div>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <!-- Arabic Section -->
              <div dir="rtl">
                <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 28px; margin-bottom: 20px;">تمت الموافقة على الاستوديو الخاص بك!</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 30px;">أهلاً يا ${name}، لقد قام فريقنا بمراجعة أعمالك ويسعدنا جداً أن نرحب بك رسمياً في دائرة "جيفتيزان". الاستوديو الخاص بك الآن متاح للجمهور وجاهز لاستقبال مقتني الكنوز من كل مكان.</p>
                
                <div style="background-color: #f0fdf4; padding: 25px; border-radius: 20px; border: 1px solid #bbf7d0; margin-bottom: 30px; text-align: right;">
                  <p style="margin: 0; color: #166534; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.1em;">✨ شارة الحرفي المؤسس 2026</p>
                  <p style="margin: 10px 0 0 0; color: #14532d; font-size: 14px; line-height: 1.8;">كشريك مبكر، تم منحك صفة **حرفي مؤسس**. استمتع بـ **0% عمولة للمنصة** واحتفظ بـ 100% من أرباحك طوال موسم 2026 بالكامل.</p>
                </div>

                <div style="background-color: #f9fafb; padding: 25px; border-radius: 20px; border: 1px solid #f3f4f6; margin-bottom: 30px; text-align: right;">
                  <p style="margin: 0; color: ${PRIMARY_COLOR}; font-weight: bold; font-size: 14px;">الخطوات التالية في رحلتك:</p>
                  <ul style="color: #4b5563; font-size: 13px; margin-top: 10px; line-height: 2;">
                    <li>تأكد من تحديث كميات المخزون</li>
                    <li>أكمل قصة مشروعك في إعدادات الاستوديو</li>
                    <li>شارك رابط الاستوديو مع متابعيك على السوشيال ميديا</li>
                  </ul>
                </div>

                <div style="margin: 30px 0;">
                  <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">دخول الاستوديو</a>
                </div>
              </div>

              <p style="color: #9ca3af; font-size: 14px; font-weight: 500; font-style: italic; margin-top: 40px;">We can't wait to see what you create | نحن متشوقون لرؤية إبداعاتك.</p>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending artisan approval email:', error);
    return { success: false, error };
  }
};

export const sendArtisanOutreachEmail = async (email: string, name: string, product: string, subject: string, lang: 'ar' | 'en' = 'ar') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: OUTREACH EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\nProduct: ${product}\n------------------------------\n`);
    return { success: true };
  }

  const arHtml = `
    <div class="email-wrapper" style="background-color: ${CREAM_BG}; padding: 30px;" dir="rtl">
      <div class="email-card" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: 'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif;">
        ${emailHeader}
        <div class="email-body" style="padding: 40px; text-align: right;">
          <p style="color: ${PRIMARY_COLOR}; font-size: 22px; font-weight: bold; margin-bottom: 25px;">أهلاً يا ${name}،</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">
            شفت شغل الـ <strong style="color: ${ACCENT_COLOR};">${product}</strong> بتاعك النهاردة، وبجد حاجة تشرف ومستواها عالي جداً. ده بالظبط نوع الفن اللي نفسنا نعرضه ونكبره في "جيفتيزان".
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">
            إحنا بنأسس منصة حصرية قائمة على الدعوات الخاصة، معمول مخصوص عشان يريح "الحرفيين" والفنانين من دوشة المبيعات واللوجستيات. بمجرد انضمامك، بنوفرلك لوحة تحكم <strong>برو استوديو</strong> متكاملة تقدر من خلالها تعرض منتجاتك، تتابع أرباحك وتدير طلباتك بكل سهولة، بالإضافة لرسائل التواصل المباشر مع العملاء. والأهم إن النظام بيتولى إرسال كل إيميلات التأكيد أوتوماتيك، عشان تفضل "رايق" ومركز بس في فنك ومساحتك الإبداعية.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 25px;">
            والأهم من ده كله، إحنا شغالين دلوقتي على تفعيل أنظمة دفع وشحن مباشر متكاملة على الموقع، وبنعمل حملات تسويق مخصوص لكل استوديو عشان نضمن إن فنك ياخد "اللقطة" والتقدير اللي يستاهله بجد.
          </p>
          <div style="background-color: #f9fafb; padding: 25px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 30px;">
            <p style="color: ${PRIMARY_COLOR}; font-size: 16px; font-weight: bold; line-height: 1.8; margin: 0;">
              إحنا بنختار مجموعة صغيرة وشاطرة جداً من المبدعين عشان نبدأ بيهم، وعاوزينك بجد تكون واحد منهم. تحب تدردش ونشوف هنعمل إيه سوا؟
            </p>
          </div>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 10px;">مستني ردك،</p>
          <p style="color: ${PRIMARY_COLOR}; font-size: 18px; font-weight: bold; margin-bottom: 40px;">حازم — مؤسس جيفتيزان</p>
          <div style="text-align: center;">
            <a href="${BASE_URL}" style="text-decoration: none;">
              <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block;">
                لقطة سريعة من هنا
              </div>
            </a>
          </div>
        </div>
        ${emailFooter}
      </div>
    </div>
  `;

  const enHtml = `
    <div class="email-wrapper" style="background-color: ${CREAM_BG}; padding: 30px;">
      <div class="email-card" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: 'Inter', Helvetica, Arial, sans-serif;">
        ${emailHeader}
        <div class="email-body" style="padding: 40px; text-align: left;">
          <p style="color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; margin-bottom: 25px;">Hello ${name},</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.9; margin-bottom: 20px;">
            I came across your work on <strong style="color: ${ACCENT_COLOR};">${product}</strong> today, and I have to say — it's genuinely impressive. It's exactly the kind of craft we want to celebrate and showcase on <strong>Giftisan</strong>.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.9; margin-bottom: 20px;">
            We're building an invite-only platform designed specifically to free artisans and creators from the noise of selling, logistics, and marketing. Once you join, we give you a fully-equipped <strong>Pro Studio Dashboard</strong> where you can list your products, track your earnings, manage orders effortlessly, and message customers directly — while our system handles all confirmation emails automatically.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.9; margin-bottom: 25px;">
            We're also actively building integrated payment and shipping systems, and we run dedicated marketing campaigns for each studio to make sure your art gets the recognition it truly deserves.
          </p>
          <div style="background-color: #f9fafb; padding: 25px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 30px;">
            <p style="color: ${PRIMARY_COLOR}; font-size: 16px; font-weight: bold; line-height: 1.8; margin: 0;">
              We're curating a small, exceptional group of creators to launch with — and we'd genuinely love for you to be one of them. Would you be open to a quick chat about what we could build together?
            </p>
          </div>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 10px;">Looking forward to hearing from you,</p>
          <p style="color: ${PRIMARY_COLOR}; font-size: 18px; font-weight: bold; margin-bottom: 40px;">Hazem — Giftisan Founder</p>
          <div style="text-align: center;">
            <a href="${BASE_URL}" style="text-decoration: none;">
              <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block;">
                Take a Quick Look
              </div>
            </a>
          </div>
        </div>
        ${emailFooter}
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: subject,
      html: lang === 'en' ? enHtml : arHtml,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending outreach email:', error);
    return { success: false, error };
  }
};

export const sendCustomEmail = async (to: string, subject: string, body: string, dir: 'ltr' | 'rtl' = 'ltr') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: CUSTOM EMAIL (${dir.toUpperCase()}) ---\nTarget: ${to}\nSubject: ${subject}\n------------------------------\n`);
    return { success: true };
  }

  const html = `
    <div class="email-wrapper" style="background-color: ${CREAM_BG}; padding: 30px;" dir="${dir}">
      <div class="email-card" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: ${dir === 'rtl' ? "'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif" : "Helvetica, Arial, sans-serif"};">
        ${emailHeader}
        <div class="email-body" style="padding: 40px; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
          <div style="color: #4b5563; font-size: 16px; line-height: 1.8;">
            ${body}
          </div>
        </div>
        ${emailFooter}
      </div>
    </div>
  `;


  try {
    await resend.emails.send({
      from: SENDER,
      to: to,
      subject: subject,
      html: html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { success: false, error };
  }
};


export const sendProductStatusUpdateEmail = async (email: string, name: string, productName: string, status: "APPROVED" | "REJECTED" | "PENDING", reason?: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PRODUCT STATUS UPDATE ---\nTarget: ${email}\nProduct: ${productName}\nStatus: ${status}\nReason: ${reason || 'N/A'}\n-------------------------------------\n`);
    return { success: true };
  }

  const isApproved = status === "APPROVED";
  const subject = isApproved
    ? `Treasure Unveiled: ${productName} is now live! | كنز جديد: منتجك الآن متاح للجميع!`
    : `Curator Update: Status changed for ${productName} | تحديث من فريق التقييم: تم تغيير حالة منتجك`;

  const enMessage = isApproved
    ? `Great news! Our curators have approved <strong>${productName}</strong>. It is now visible to all collectors and ready to be claimed.`
    : status === "REJECTED"
      ? `Our curators have reviewed <strong>${productName}</strong> and decided not to list it at this time.${reason ? `<br/><br/><strong>Feedback from Curators:</strong><br/>${reason}` : ' Please review our quality guidelines or contact support for more details.'}`
      : `<strong>${productName}</strong> has been moved back to the review queue. We will notify you once the status changes.`;

  const arMessage = isApproved
    ? `خبر رائع! لقد وافق فريق التقييم على <strong>${productName}</strong>. منتجك الآن متاح لجميع مقتني الكنوز وجاهز للشراء.`
    : status === "REJECTED"
      ? `لقد راجع فريق التقييم <strong>${productName}</strong> وتقرر عدم عرضه في الوقت الحالي.${reason ? `<br/><br/><strong>ملاحظات المنسقين:</strong><br/>${reason}` : ' يرجى مراجعة معايير الجودة الخاصة بنا أو التواصل مع الدعم لمزيد من التفاصيل.'}`
      : `تمت إعادة <strong>${productName}</strong> إلى قائمة المراجعة. سنقوم بإخطارك فور تغيير الحالة.`;

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
              <div dir="ltr">
                <h1 class="heading" style="color: ${isApproved ? ACCENT_COLOR : PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">
                  ${isApproved ? 'Treasure Approved!' : 'Product Status Update'}
                </h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Hi ${name}, ${enMessage}</p>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <div dir="rtl">
                <h1 class="heading" style="color: ${isApproved ? ACCENT_COLOR : PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">
                  ${isApproved ? 'تمت الموافقة على منتجك!' : 'تحديث حالة المنتج'}
                </h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 30px;">أهلاً يا ${name}، ${arMessage}</p>
              </div>

              <div style="margin: 40px 0;">
                <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                  ${isApproved ? 'View in Studio' : 'Go to Studio'}
                </a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending product status email:', error);
    return { success: false, error };
  }
};

export const sendPayoutRequestEmail = async (artisanName: string, amount: number, method: string, address: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PAYOUT REQUEST SUBMITTED ---\nArtisan: ${artisanName}\nAmount: ${amount} EGP\nMethod: ${method}\nAddress: ${address}\n---------------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: "support@giftisan.com",
      subject: `Withdrawal Requested: ${artisanName} is requesting ${amount} EGP | Giftisan Admin`,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 20px; text-align: center;">New Withdrawal Request</h1>
              
              <div style="background-color: #f9fafb; padding: 25px; border-radius: 20px; margin-bottom: 25px; border: 1px solid #f3f4f6;">
                <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 15px;"><strong>Artisan:</strong> ${artisanName}</p>
                <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 15px;"><strong>Amount Requested:</strong> <strong style="color: ${ACCENT_COLOR};">${amount.toFixed(2)} EGP</strong></p>
                <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 15px;"><strong>Method:</strong> ${method}</p>
                <p style="margin: 0; color: #4b5563; font-size: 15px; font-family: monospace;"><strong>Address:</strong> ${address}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${BASE_URL}/admin/payouts" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Review Payouts Manager</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout request notification:', error);
    return { success: false, error };
  }
};

export const sendPayoutApprovedEmail = async (email: string, name: string, amount: number, method: string, address: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PAYOUT APPROVED EMAIL ---\nTarget: ${email}\nName: ${name}\nAmount: ${amount} EGP\n--------------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: `Your payout of ${amount} EGP has been successfully sent! | تم إيداع مستحقاتك المالية بقيمة ${amount} ج.م!`,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <!-- English Section -->
              <div dir="ltr" style="margin-bottom: 40px;">
                <h1 class="heading" style="color: #10b981; font-size: 28px; margin-bottom: 20px;">Payout Transferred Successfully!</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Hi ${name}, our accounting team has processed your withdrawal request and successfully transferred your funds.</p>
                
                <div style="background-color: #f0fdf4; padding: 25px; border-radius: 20px; border: 1px solid #bbf7d0; text-align: left; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #166534; font-size: 15px; font-weight: bold;">Payout Summary:</p>
                  <p style="margin: 0 0 5px 0; color: #14532d; font-size: 13px;"><strong>Amount:</strong> <strong style="color: #166534;">${amount.toFixed(2)} EGP</strong></p>
                  <p style="margin: 0 0 5px 0; color: #14532d; font-size: 13px;"><strong>Channel:</strong> ${method}</p>
                  <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>To Account:</strong> ${address}</p>
                </div>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <!-- Arabic Section -->
              <div dir="rtl">
                <h1 class="heading" style="color: #10b981; font-size: 28px; margin-bottom: 20px;">تم تحويل مستحقاتك بنجاح!</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 30px;">أهلاً يا ${name}، لقد قام فريق الحسابات لدينا بمعالجة طلب السحب الخاص بك وتحويل الأموال بنجاح.</p>
                
                <div style="background-color: #f0fdf4; padding: 25px; border-radius: 20px; border: 1px solid #bbf7d0; text-align: right;">
                  <p style="margin: 0 0 10px 0; color: #166534; font-size: 15px; font-weight: bold;">ملخص عملية التحويل:</p>
                  <p style="margin: 0 0 5px 0; color: #14532d; font-size: 13px;"><strong>المبلغ الإجمالي:</strong> <strong style="color: #166534;">${amount.toFixed(2)} جنيه مصري</strong></p>
                  <p style="margin: 0 0 5px 0; color: #14532d; font-size: 13px;"><strong>وسيلة الدفع:</strong> ${method === 'INSTAPAY' ? 'إنستا باي (InstaPay)' : method === 'VODAFONE_CASH' ? 'فودافون كاش' : 'تحويل بنكي IBAN'}</p>
                  <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>إلى حساب:</strong> ${address}</p>
                </div>
              </div>

              <div style="margin-top: 45px;">
                <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Open Studio Dashboard</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout approved email:', error);
    return { success: false, error };
  }
};

export const sendPayoutDeclinedEmail = async (email: string, name: string, amount: number, reason: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PAYOUT DECLINED EMAIL ---\nTarget: ${email}\nName: ${name}\nAmount: ${amount} EGP\nReason: ${reason}\n--------------------------------------\n`);
    return { success: true };
  }
  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: `Fulfillment Update: Withdrawal Request declined | تحديث حسابات: تم إلغاء طلب سحب المستحقات`,
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <!-- English Section -->
              <div dir="ltr" style="margin-bottom: 40px;">
                <h1 class="heading" style="color: #ef4444; font-size: 28px; margin-bottom: 20px;">Withdrawal Request Declined</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">Hi ${name}, your payout request for <strong>${amount.toFixed(2)} EGP</strong> was declined and the funds have been fully refunded back to your Withdrawable balance.</p>
                <div style="background-color: #fef2f2; padding: 25px; border-radius: 20px; border: 1px solid #fecaca; text-align: left;">
                  <p style="margin: 0; color: #991b1b; font-size: 13px;"><strong>Reason for Cancellation:</strong><br/>${reason}</p>
                </div>
              </div>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #f3f4f6;" />

              <!-- Arabic Section -->
              <div dir="rtl">
                <h1 class="heading" style="color: #ef4444; font-size: 28px; margin-bottom: 20px;">تم إلغاء طلب سحب المستحقات</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">أهلاً يا ${name}، تم رفض طلب السحب الخاص بك بقيمة <strong>${amount.toFixed(2)} جنيه مصري</strong> وإعادة كامل المبلغ فوراً لرصيدك القابل للسحب في لوحة التحكم.</p>
                <div style="background-color: #fef2f2; padding: 25px; border-radius: 20px; border: 1px solid #fecaca; text-align: right;">
                  <p style="margin: 0; color: #991b1b; font-size: 13px;"><strong>سبب الرفض والإرجاع:</strong><br/>${reason}</p>
                </div>
              </div>

              <div style="margin-top: 45px;">
                <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">Update Payout Details</a>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout declined email:', error);
    return { success: false, error };
  }
};
