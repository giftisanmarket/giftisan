import { Resend } from 'resend';

import { SITE_URL } from './constants';

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = `${SITE_URL}/icon.png`;

// Receiver inbox for all incoming replies & customer inquiries
export const SUPPORT_INBOX = "support@giftisan.com";

// Sender addresses (Categorized for clean branding & deliverability)
export const SENDER_SUPPORT = "Giftisan Support <support@giftisan.com>";
export const SENDER_AUTH = "Giftisan Security <auth@giftisan.com>";
export const SENDER_ORDERS = "Giftisan Orders <orders@giftisan.com>";
export const SENDER_FINANCE = "Giftisan Finance <payouts@giftisan.com>";
export const SENDER_STUDIO = "Giftisan Studio <studio@giftisan.com>";

// Fallback aliases
const SENDER = SENDER_SUPPORT;
const AUTH_SENDER = SENDER_AUTH;

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

const getEmailHeader = () => `
  ${emailStyles}
  <div style="text-align: center; padding: 35px 20px 25px 20px; background-color: ${PRIMARY_COLOR}; border-radius: 24px 24px 0 0;">
    <img src="${LOGO_URL}" alt="Giftisan" width="52" height="52" align="center" style="display: block; margin: 0 auto 12px auto; border: 0; outline: none; border-radius: 6px;">
    <div class="heading" style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: -0.02em; text-align: center;">Giftisan</div>
    <div style="font-size: 10px; color: rgba(255,255,255,0.45); font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px; text-align: center;">Handcrafted Mastery</div>
  </div>
`;

const getEmailFooter = (lang: 'ar' | 'en' = 'en') => `
  <div style="text-align: center; padding: 35px 20px; border-top: 1px solid rgba(0,0,0,0.05);" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
    <p style="color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      ${lang === 'ar' ? 'فريق جيفتيزان • ننطلق من مصر لدعم الحرفيين المحليين' : 'Proudly Based in Egypt • Supporting Local Artisans'}
    </p>
    <p style="color: #1a2c2c; font-weight: bold; font-size: 13px; margin: 0 0 15px 0;">
      ${lang === 'ar' ? 'فريق عمل جيفتيزان' : 'The Giftisan Team'}
    </p>
    <div style="font-size: 11px; color: #d1d5db;">
      &copy; 2026 Giftisan. All rights reserved.
    </div>
  </div>
`;

const wrapEmail = (content: string, lang: 'ar' | 'en' = 'en') => `
  <div class="email-wrapper" style="background-color: ${CREAM_BG}; padding: 30px;" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
    <div class="email-card" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: ${lang === 'ar' ? "'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif" : "Helvetica, Arial, sans-serif"};">
      ${getEmailHeader()}
      <div class="email-body" style="padding: 35px 30px; text-align: ${lang === 'ar' ? 'right' : 'left'};">
        ${content}
      </div>
      ${getEmailFooter(lang)}
    </div>
  </div>
`;

export const sendWelcomeEmail = async (email: string, name: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: WELCOME EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\n-----------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr ? 'مرحباً بك في دائرة جيفتيزان' : 'Welcome to the Circle | Giftisan';

  const arContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 26px; margin-bottom: 18px;">مرحباً بك في الدائرة، ${name}!</h1>
    <p style="color: #4b5563; line-height: 2; font-size: 16px; margin-bottom: 25px;">نتشرف بانضمامك إلى مجتمعنا من الحرفيين ومقتني الكنوز. "جيفتيزان" هو الملاذ الذي تلتقي فيه الحرفة الأصيلة بالروح والإبداع.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${BASE_URL}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">اكتشف الخزائن</a>
    </div>
    <p style="color: #9ca3af; font-size: 13px; font-style: italic; text-align: center;">نتمنى لك تجربة ممتعة بصحبة إبداعاتنا!</p>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 26px; margin-bottom: 18px;">Welcome to the Circle, ${name}!</h1>
    <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">We're honored to have you join our community of artisans and treasure hunters. Giftisan is a sanctum where authentic craft meets soul.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${BASE_URL}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">Explore the Vault</a>
    </div>
    <p style="color: #9ca3af; font-size: 13px; font-style: italic; text-align: center;">Happy discovery!</p>
  `;

  try {
    await resend.emails.send({
      from: SENDER_STUDIO,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

export const sendOrderNotification = async (artisanEmail: string, artisanName: string, orderId: string, totalAmount: number, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ORDER NOTIFICATION (${lang.toUpperCase()}) ---\nTarget: ${artisanEmail}\nOrder: ${orderId}\nAmount: EGP ${totalAmount}\n----------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr ? `تنبيه مبيعة جديدة: تم طلب قطعة من استوديو الخاص بك! (#${orderId.slice(0, 8)})` : `New Sale Alert: A treasure has been claimed! (#${orderId.slice(0, 8)})`;

  const arContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 26px; margin-bottom: 12px;">تنبيه مبيعة جديدة!</h1>
    <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px; line-height: 1.8;">أهلاً ${artisanName}، لقد قام أحد مقتني الكنوز بشراء قطعة من الاستوديو الخاص بك الآن.</p>
    
    <div style="background-color: #f9fafb; padding: 25px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="margin: 0 0 6px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">رقم الطلب</p>
      <p style="margin: 0 0 20px 0; color: ${PRIMARY_COLOR}; font-size: 18px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</p>
      
      <p style="margin: 0 0 6px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">أرباحك المحققة (0% عمولة للمنصة)</p>
      <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 28px; font-weight: bold;">${totalAmount.toLocaleString()} ج.م</p>
    </div>

    <p style="color: #4b5563; font-size: 15px; margin-bottom: 30px; line-height: 1.9;">يرجى تسجيل الدخول إلى **لوحة تحكم الاستوديو** لمعاينة بيانات الشحن والبدء في تجهيز الطلب.</p>
    
    <div style="text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">دخول الاستوديو</a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 26px; margin-bottom: 12px;">New Sale Alert!</h1>
    <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px; line-height: 1.7;">Hi ${artisanName}, a collector has just claimed a treasure from your studio.</p>
    
    <div style="background-color: #f9fafb; padding: 25px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="margin: 0 0 6px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">Order Reference</p>
      <p style="margin: 0 0 20px 0; color: ${PRIMARY_COLOR}; font-size: 18px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</p>
      
      <p style="margin: 0 0 6px 0; color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em;">Your Earnings (0% Platform Fee)</p>
      <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 28px; font-weight: bold;">EGP ${totalAmount.toLocaleString()}</p>
    </div>

    <p style="color: #4b5563; font-size: 15px; margin-bottom: 30px; line-height: 1.7;">Please log in to your **Studio Dashboard** to view shipment details and begin fulfillment.</p>
    
    <div style="text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">Enter Studio</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_ORDERS,
      replyTo: SUPPORT_INBOX,
      to: artisanEmail,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    return { success: false, error };
  }
};

export const sendMessageNotification = async (receiverEmail: string, receiverName: string, senderName: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: MESSAGE NOTIFICATION (${lang.toUpperCase()}) ---\nTarget: ${receiverEmail}\nSender: ${senderName}\n------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr ? `رسالة جديدة من ${senderName} | جيفتيزان` : `New Dialogue from ${senderName} | Giftisan`;

  const arContent = `
    <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">أهلاً ${receiverName}،</p>
    <h2 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 22px; margin-bottom: 25px; line-height: 1.6;">لديك رسالة تواصل جديدة من <strong>${senderName}</strong> بخصوص أحد المعروضات.</h2>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${BASE_URL}/profile/messages" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">الرد على الرسالة</a>
    </div>
  `;

  const enContent = `
    <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Hi ${receiverName},</p>
    <h2 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 22px; margin-bottom: 25px; line-height: 1.5;"><strong>${senderName}</strong> has initiated a dialogue regarding a treasure.</h2>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${BASE_URL}/profile/messages" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">Join Dialogue</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_STUDIO,
      replyTo: SUPPORT_INBOX,
      to: receiverEmail,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message notification email:', error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (email: string, token: string, lang: 'ar' | 'en' = 'en') => {
  const confirmLink = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n--- 📧 DEV: VERIFICATION EMAIL ---");
    console.log(`Target: ${email}`);
    console.log(`Link:   ${confirmLink}`);
    console.log("----------------------------------\n");
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr ? 'توثيق الحساب | جيفتيزان' : 'Verify your identity | Giftisan';

  const arContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">توثيق عنوان البريد الإلكتروني</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.9; margin-bottom: 25px;">قبل البدء في استكشاف الخزائن أو فتح الاستوديو الخاص بك، يرجى تأكيد بريدك الإلكتروني لضمان أمان حسابك وفتح كافة المميزات.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${confirmLink}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">تأكيد البريد الإلكتروني</a>
    </div>
    <p style="color: #9ca3af; font-size: 12px; font-style: italic; text-align: center;">صلاحية هذا الرابط تنتهي خلال 24 ساعة.</p>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">Verify your identity</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">Before you explore the vault or open your studio, please confirm your email address to secure your account and unlock all platform features.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${confirmLink}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 20px rgba(218, 123, 90, 0.2);">Confirm Connection</a>
    </div>
    <p style="color: #9ca3af; font-size: 12px; font-style: italic; text-align: center;">This link will expire in 24 hours.</p>
  `;

  try {
    await resend.emails.send({
      from: SENDER_AUTH,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
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
  carrier?: string,
  lang: 'ar' | 'en' = 'en'
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ORDER STATUS UPDATE (${lang.toUpperCase()}) ---\nTarget: ${email}\nOrder: ${orderId}\nStatus: ${status}\nCarrier: ${carrier || 'None'}\nTracking: ${trackingNumber || 'None'}\n----------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const isDelivered = status === 'DELIVERED';
  const statusColors: Record<string, string> = {
    'PROCESSING': '#3b82f6',
    'SHIPPED': ACCENT_COLOR,
    'DELIVERED': '#10b981',
    'CANCELLED': '#ef4444'
  };

  const statusTextAr: Record<string, string> = {
    'PROCESSING': 'قيد التجهيز الآن في الاستوديو',
    'SHIPPED': 'تم شحنها وهي في طريقها إليك',
    'DELIVERED': 'تم توصيلها بنجاح',
    'CANCELLED': 'تم إلغاؤها'
  };

  const statusTextEn: Record<string, string> = {
    'PROCESSING': 'is being prepared in the studio',
    'SHIPPED': 'has been shipped and is on its way',
    'DELIVERED': 'has been delivered successfully',
    'CANCELLED': 'has been cancelled'
  };

  const ctaLink = isDelivered && productSlug
    ? `${BASE_URL}/products/${productSlug}#reviews`
    : `${BASE_URL}/profile`;

  const subject = isAr
    ? isDelivered ? `وصلت قطعتك الفنية! شاركنا رأيك | جيفتيزان` : `تحديث لطلبك #${orderId.slice(0, 8)}: ${statusTextAr[status] || status}`
    : isDelivered ? `Share Your Story: Your treasure has arrived! | Giftisan` : `Journey Update: Your treasure ${statusTextEn[status] || status}`;

  const arContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 20px;">
      ${isDelivered ? 'وصلت قطعتك الفنية!' : 'تحديث مسار الطلب'}
    </h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">أهلاً ${name}، نود إعلامك بأن طلبك لـ <strong>${productName}</strong> ${statusTextAr[status] || 'يتحرك في مساره'}.</p>
    
    <div style="margin: 30px 0; background-color: #f9fafb; padding: 25px; border-radius: 18px; border: 1px solid #f3f4f6; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af;">الحالة الحالية</p>
      <p style="margin: 0; font-size: 26px; font-weight: bold; color: ${statusColors[status] || PRIMARY_COLOR};">
        ${status === 'PROCESSING' ? 'قيد التجهيز' : status === 'SHIPPED' ? 'تم الشحن' : status === 'DELIVERED' ? 'تم التوصيل' : 'ملغي'}
      </p>
      <p style="margin: 15px 0 0 0; font-size: 12px; font-weight: bold; color: #6b7280; font-family: monospace;">رقم الطلب: #${orderId.slice(0, 8)}</p>
    </div>

    ${status === 'SHIPPED' && trackingNumber ? `
      <div style="margin: 20px 0; padding: 20px; border-radius: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; text-align: right;">
        <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-weight: bold;">بيانات الشحنة والتتبع</h4>
        <p style="margin: 0 0 4px 0; color: #14532d; font-size: 13px;"><strong>شركة الشحن:</strong> ${carrier || 'الشحن المحلي السريع'}</p>
        <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>رقم التتبع:</strong> ${trackingNumber}</p>
      </div>
    ` : ''}

    ${isDelivered ? `
      <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">نتمنى أن تضفي هذه القطعة لمسة دافئة وجمالاً فريداً على مساحتك. تقييمك ودعمك للحرفي يعني الكثير — هل تود مشاركة رأيك في جودة الصنعة؟</p>
    ` : ''}
    
    <div style="margin-top: 35px; text-align: center;">
      <a href="${ctaLink}" style="background-color: ${isDelivered ? ACCENT_COLOR : PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">
        ${isDelivered ? 'شارك تقييمك' : 'متابعة الطلب'}
      </a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 20px;">
      ${isDelivered ? 'Your Treasure has Arrived' : 'Journey Update'}
    </h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.7;">Hi ${name}, your order for <strong>${productName}</strong> ${statusTextEn[status] || 'is moving forward'}.</p>
    
    <div style="margin: 30px 0; background-color: #f9fafb; padding: 25px; border-radius: 18px; border: 1px solid #f3f4f6; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af;">Current Milestone</p>
      <p style="margin: 0; font-size: 26px; font-weight: bold; color: ${statusColors[status] || PRIMARY_COLOR};">${status}</p>
      <p style="margin: 15px 0 0 0; font-size: 12px; font-weight: bold; color: #6b7280; font-family: monospace;">Ref: #${orderId.slice(0, 8)}</p>
    </div>

    ${status === 'SHIPPED' && trackingNumber ? `
      <div style="margin: 20px 0; padding: 20px; border-radius: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; text-align: left;">
        <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-weight: bold;">Shipment Information</h4>
        <p style="margin: 0 0 4px 0; color: #14532d; font-size: 13px;"><strong>Carrier:</strong> ${carrier || 'Local Shipping Partner'}</p>
        <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>Tracking ID:</strong> ${trackingNumber}</p>
      </div>
    ` : ''}

    ${isDelivered ? `
      <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">We hope this piece brings soul and beauty to your space. Artisans thrive on your feedback — would you take a moment to share your review?</p>
    ` : ''}
    
    <div style="margin-top: 35px; text-align: center;">
      <a href="${ctaLink}" style="background-color: ${isDelivered ? ACCENT_COLOR : PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">
        ${isDelivered ? 'Share Your Review' : 'Track Order'}
      </a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_ORDERS,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string, lang: 'ar' | 'en' = 'en') => {
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  if (process.env.NODE_ENV === "development") {
    console.log("\n--- 📧 DEV: PASSWORD RESET EMAIL ---");
    console.log(`Target: ${email}`);
    console.log(`Link:   ${resetLink}`);
    console.log("------------------------------------\n");
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr ? 'استعادة الوصول إلى الحساب | جيفتيزان' : 'Security: Access Recovery | Giftisan';

  const arContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">استعادة كلمة المرور</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.9; margin-bottom: 25px;">تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في جيفتيزان. اضغط على الزر أدناه لاختيار كلمة مرور جديدة وتأمين حسابك.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetLink}" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">تعيين كلمة مرور جديدة</a>
    </div>
    <p style="color: #9ca3af; font-size: 12px; font-style: italic; text-align: center;">صلاحية هذا الرابط تنتهي خلال 60 دقيقة.</p>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">Access Recovery</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">We received a request to reclaim access to your Giftisan account. Click below to choose a new password and secure your enclave.</p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetLink}" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">Secure My Account</a>
    </div>
    <p style="color: #9ca3af; font-size: 12px; font-style: italic; text-align: center;">This recovery link will expire in 60 minutes.</p>
  `;

  try {
    await resend.emails.send({
      from: SENDER_AUTH,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
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

  const content = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 22px; margin-bottom: 20px; text-align: center;">New Customer Inquiry</h1>
    
    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; margin-bottom: 25px; border: 1px solid #f3f4f6;">
      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.7;"><strong>Message:</strong><br />${message}</p>
    </div>

    <div style="text-align: center;">
      <a href="mailto:${email}" style="background-color: ${ACCENT_COLOR}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">Reply to Customer</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_SUPPORT,
      to: SUPPORT_INBOX,
      replyTo: email,
      subject: `New Inquiry from ${name} | Giftisan Support`,
      html: wrapEmail(content, 'en'),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending inquiry notification:', error);
    return { success: false, error };
  }
};

export const sendArtisanApprovalEmail = async (email: string, name: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: ARTISAN APPROVAL EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\n--------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr 
    ? 'مبروك! تم اعتماد الاستوديو الخاص بك في جيفتيزان وأصبح متاحاً الآن'
    : 'Welcome to the Guild: Your Studio is Officially Live! | Giftisan';

  const arContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 26px; margin-bottom: 18px;">مبروك! تم اعتماد الاستوديو الخاص بك</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 25px;">أهلاً يا ${name}، لقد قام فريق التقييم بمراجعة الاستوديو الخاص بك والتأكد من استيفاء كافة بياناتك ومنتجاتك. يسعدنا جداً أن نرحب بك رسمياً في دائرة "جيفتيزان"! استوديو إبداعاتك ومنتجاتك الآن متاحة للجمهور وجاهزة لاستقبال الطلبات من مقتني الكنوز.</p>
    
    <div style="background-color: #f0fdf4; padding: 22px; border-radius: 18px; border: 1px solid #bbf7d0; margin-bottom: 25px;">
      <p style="margin: 0; color: #166534; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;">✨ شارة الحرفي المؤسس 2026</p>
      <p style="margin: 8px 0 0 0; color: #14532d; font-size: 14px; line-height: 1.8;">كشريك مبكر، تم منحك صفة **حرفي مؤسس**. استمتع بـ **0% عمولة للمنصة** واحتفظ بـ 100% من أرباحك طوال موسم 2026 بالكامل.</p>
    </div>

    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="margin: 0; color: ${PRIMARY_COLOR}; font-weight: bold; font-size: 14px;">خطواتك التالية:</p>
      <ul style="color: #4b5563; font-size: 13px; margin-top: 10px; line-height: 2; padding-right: 20px;">
        <li><strong>شارك رابط الاستوديو</strong> على حساباتك في السوشيال ميديا للبدء في استقبال عملائك</li>
        <li><strong>أضف المزيد من القطع الفنية</strong> في أي وقت لتوسيع معروضاتك</li>
        <li><strong>أدر طلباتك وتابع أرباحك</strong> بسهولة مباشرة من لوحة تحكم الاستوديو</li>
      </ul>
    </div>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">دخول لوحة تحكم الاستوديو</a>
    </div>

    <p style="color: #9ca3af; font-size: 13px; font-style: italic; text-align: center; margin-top: 25px;">نحن متشوقون لرؤية إبداعاتك ونموك معنا في مجتمع جيفتيزان!</p>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 26px; margin-bottom: 18px;">Congratulations! Your Studio is Approved</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">Hi ${name}, our curators have reviewed your studio and verified all your onboarding requirements. We're thrilled to officially welcome you to the Giftisan Guild! Your studio and handcrafted treasures are now live and visible to collectors across the marketplace.</p>
    
    <div style="background-color: #f0fdf4; padding: 22px; border-radius: 18px; border: 1px solid #bbf7d0; margin-bottom: 25px;">
      <p style="margin: 0; color: #166534; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;">✨ 2026 Founding Member Status</p>
      <p style="margin: 8px 0 0 0; color: #14532d; font-size: 14px; line-height: 1.6;">As an early partner, you've been granted **Founding Artisan** status. Enjoy **0% platform fees** and keep 100% of your earnings throughout the entire 2026 season.</p>
    </div>

    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="margin: 0; color: ${PRIMARY_COLOR}; font-weight: bold; font-size: 14px;">What's next for your studio:</p>
      <ul style="color: #4b5563; font-size: 13px; margin-top: 10px; line-height: 1.8; padding-left: 20px;">
        <li><strong>Share your studio link</strong> on your social channels to welcome collectors</li>
        <li><strong>Add new creations</strong> anytime to grow your storefront catalog</li>
        <li><strong>Manage orders & earnings</strong> seamlessly in your Pro Studio Dashboard</li>
      </ul>
    </div>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">Enter Studio Dashboard</a>
    </div>

    <p style="color: #9ca3af; font-size: 13px; font-style: italic; text-align: center; margin-top: 25px;">We can't wait to see what you create and grow with us!</p>
  `;

  try {
    await resend.emails.send({
      from: SENDER_STUDIO,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending artisan approval email:', error);
    return { success: false, error };
  }
};

export const sendArtisanOutreachEmail = async (email: string, name: string, product: string, subject: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: OUTREACH EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\nProduct: ${product}\n------------------------------\n`);
    return { success: true };
  }

  const arContent = `
    <p style="color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; margin-bottom: 20px;">أهلاً يا ${name}،</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 18px;">
      شفت شغل الـ <strong style="color: ${ACCENT_COLOR};">${product}</strong> بتاعك النهاردة، وبجد حاجة تشرف ومستواها عالي جداً. ده بالظبط نوع الفن اللي نفسنا نعرضه ونكبره في "جيفتيزان".
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 18px;">
      إحنا بنأسس منصة حصرية قائمة على الدعوات الخاصة، معمول مخصوص عشان يريح "الحرفيين" والفنانين من دوشة المبيعات واللوجستيات. بمجرد انضمامك، بنوفرلك لوحة تحكم <strong>برو استوديو</strong> متكاملة تقدر من خلالها تعرض منتجاتك، تتابع أرباحك وتدير طلباتك بكل سهولة، بالإضافة لرسائل التواصل المباشر مع العملاء. والأهم إن النظام بيتولى إرسال كل إيميلات التأكيد أوتوماتيك، عشان تفضل "رايق" ومركز بس في فنك ومساحتك الإبداعية.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 22px;">
      والأهم من ده كله، إحنا شغالين دلوقتي على تفعيل أنظمة دفع وشحن مباشر متكاملة على الموقع، وبنعمل حملات تسويق مخصوص لكل استوديو عشان نضمن إن فنك ياخد "اللقطة" والتقدير اللي يستاهله بجد.
    </p>
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="color: ${PRIMARY_COLOR}; font-size: 15px; font-weight: bold; line-height: 1.8; margin: 0;">
        إحنا بنختار مجموعة صغيرة وشاطرة جداً من المبدعين عشان نبدأ بيهم، وعاوزينك بجد تكون واحد منهم. تحب تدردش ونشوف هنعمل إيه سوا؟
      </p>
    </div>
    <p style="color: #4b5563; font-size: 15px; margin-bottom: 8px;">مستني ردك،</p>
    <p style="color: ${PRIMARY_COLOR}; font-size: 17px; font-weight: bold; margin-bottom: 30px;">حازم — مؤسس جيفتيزان</p>
    <div style="text-align: center;">
      <a href="${BASE_URL}" style="text-decoration: none;">
        <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 16px 36px; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">
          لقطة سريعة من هنا
        </div>
      </a>
    </div>
  `;

  const enContent = `
    <p style="color: ${PRIMARY_COLOR}; font-size: 19px; font-weight: bold; margin-bottom: 20px;">Hello ${name},</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 18px;">
      I came across your work on <strong style="color: ${ACCENT_COLOR};">${product}</strong> today, and I have to say — it's genuinely impressive. It's exactly the kind of craft we want to celebrate and showcase on <strong>Giftisan</strong>.
    </p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 18px;">
      We're building an invite-only platform designed specifically to free artisans and creators from the noise of selling, logistics, and marketing. Once you join, we give you a fully-equipped <strong>Pro Studio Dashboard</strong> where you can list your products, track your earnings, manage orders effortlessly, and message customers directly — while our system handles all confirmation emails automatically.
    </p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 22px;">
      We're also actively building integrated payment and shipping systems, and we run dedicated marketing campaigns for each studio to make sure your art gets the recognition it truly deserves.
    </p>
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <p style="color: ${PRIMARY_COLOR}; font-size: 15px; font-weight: bold; line-height: 1.7; margin: 0;">
        We're curating a small, exceptional group of creators to launch with — and we'd genuinely love for you to be one of them. Would you be open to a quick chat about what we could build together?
      </p>
    </div>
    <p style="color: #4b5563; font-size: 15px; margin-bottom: 8px;">Looking forward to hearing from you,</p>
    <p style="color: ${PRIMARY_COLOR}; font-size: 17px; font-weight: bold; margin-bottom: 30px;">Hazem — Giftisan Founder</p>
    <div style="text-align: center;">
      <a href="${BASE_URL}" style="text-decoration: none;">
        <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 16px 36px; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block;">
          Take a Quick Look
        </div>
      </a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_SUPPORT,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(lang === 'en' ? enContent : arContent, lang),
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

  const content = `
    <div style="color: #4b5563; font-size: 15px; line-height: 1.8;">
      ${body}
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_SUPPORT,
      replyTo: SUPPORT_INBOX,
      to,
      subject,
      html: wrapEmail(content, dir === 'rtl' ? 'ar' : 'en'),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { success: false, error };
  }
};

export const sendProductStatusUpdateEmail = async (
  email: string,
  name: string,
  productName: string,
  status: "APPROVED" | "REJECTED" | "PENDING",
  reason?: string,
  lang: 'ar' | 'en' = 'en'
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PRODUCT STATUS UPDATE (${lang.toUpperCase()}) ---\nTarget: ${email}\nProduct: ${productName}\nStatus: ${status}\nReason: ${reason || 'N/A'}\n-------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const isApproved = status === "APPROVED";
  const subject = isAr
    ? isApproved ? `مبروك! تم اعتماد منتجك "${productName}" وهو الآن متاح للجميع` : `تحديث تقييم لمنتجك "${productName}"`
    : isApproved ? `Treasure Unveiled: ${productName} is now live! | Giftisan` : `Curator Update: Status changed for ${productName}`;

  const arContent = `
    <h1 class="heading" style="color: ${isApproved ? ACCENT_COLOR : PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">
      ${isApproved ? 'تمت الموافقة على منتجك!' : 'تحديث حالة المنتج'}
    </h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 25px;">
      أهلاً يا ${name}، 
      ${isApproved
        ? `خبر رائع! لقد وافق فريق التقييم على <strong>${productName}</strong>. منتجك الآن معروض في السوق ومتاح لجميع مقتني الكنوز.`
        : status === "REJECTED"
          ? `لقد راجع فريق التقييم <strong>${productName}</strong> وتقرر عدم عرضه في الوقت الحالي.${reason ? `<br/><br/><strong>ملاحظات المنسقين:</strong><br/>${reason}` : ' يرجى مراجعة معايير الجودة أو التواصل مع الدعم لمزيد من التفاصيل.'}`
          : `تمت إعادة <strong>${productName}</strong> إلى قائمة المراجعة. سنقوم بإخطارك فور تحديث الحالة.`
      }
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">
        ${isApproved ? 'معاينة في الاستوديو' : 'دخول الاستوديو'}
      </a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${isApproved ? ACCENT_COLOR : PRIMARY_COLOR}; font-size: 24px; margin-bottom: 18px;">
      ${isApproved ? 'Treasure Approved!' : 'Product Status Update'}
    </h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">
      Hi ${name}, 
      ${isApproved
        ? `Great news! Our curators have approved <strong>${productName}</strong>. It is now visible to all collectors and ready to be claimed.`
        : status === "REJECTED"
          ? `Our curators have reviewed <strong>${productName}</strong> and decided not to list it at this time.${reason ? `<br/><br/><strong>Feedback from Curators:</strong><br/>${reason}` : ' Please review our quality guidelines or contact support for more details.'}`
          : `<strong>${productName}</strong> has been moved back to the review queue. We will notify you once the status changes.`
      }
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">
        ${isApproved ? 'View in Studio' : 'Go to Studio'}
      </a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_STUDIO,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
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

  const content = `
    <h1 class="heading" style="color: ${PRIMARY_COLOR}; font-size: 22px; margin-bottom: 20px; text-align: center;">New Withdrawal Request</h1>
    
    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; margin-bottom: 25px; border: 1px solid #f3f4f6;">
      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;"><strong>Artisan:</strong> ${artisanName}</p>
      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;"><strong>Amount Requested:</strong> <strong style="color: ${ACCENT_COLOR}; font-size: 18px;">${amount.toFixed(2)} EGP</strong></p>
      <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;"><strong>Method:</strong> ${method}</p>
      <p style="margin: 0; color: #4b5563; font-size: 14px; font-family: monospace;"><strong>Address/Account:</strong> ${address}</p>
    </div>

    <div style="text-align: center;">
      <a href="${BASE_URL}/admin/payouts" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 16px 36px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">Review in Payouts Manager</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_FINANCE,
      to: SUPPORT_INBOX,
      replyTo: SUPPORT_INBOX,
      subject: `Withdrawal Requested: ${artisanName} (${amount} EGP) | Giftisan Admin`,
      html: wrapEmail(content, 'en'),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout request notification:', error);
    return { success: false, error };
  }
};

export const sendPayoutApprovedEmail = async (email: string, name: string, amount: number, method: string, address: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PAYOUT APPROVED EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\nAmount: ${amount} EGP\n--------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr 
    ? `تم تحويل مستحقاتك المالية بنجاح بقيمة ${amount.toFixed(2)} ج.م!`
    : `Payout Transferred: ${amount.toFixed(2)} EGP has been successfully sent! | Giftisan`;

  const arContent = `
    <h1 class="heading" style="color: #10b981; font-size: 24px; margin-bottom: 18px;">تم تحويل مستحقاتك بنجاح!</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 25px;">أهلاً يا ${name}، لقد قام فريق الحسابات لدينا بمعالجة طلب السحب الخاص بك وتحويل المستحقات المالية بنجاح.</p>
    
    <div style="background-color: #f0fdf4; padding: 22px; border-radius: 18px; border: 1px solid #bbf7d0; text-align: right; margin-bottom: 25px;">
      <p style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: bold;">ملخص عملية التحويل:</p>
      <p style="margin: 0 0 6px 0; color: #14532d; font-size: 13px;"><strong>المبلغ المحول:</strong> <strong style="color: #166534; font-size: 16px;">${amount.toFixed(2)} جنيه مصري</strong></p>
      <p style="margin: 0 0 6px 0; color: #14532d; font-size: 13px;"><strong>وسيلة التحويل:</strong> ${method === 'INSTAPAY' ? 'إنستا باي (InstaPay)' : method === 'VODAFONE_CASH' ? 'فودافون كاش' : 'تحويل بنكي IBAN'}</p>
      <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>إلى حساب:</strong> ${address}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">لوحة تحكم الاستوديو</a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: #10b981; font-size: 24px; margin-bottom: 18px;">Payout Transferred Successfully!</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 25px;">Hi ${name}, our accounting team has processed your withdrawal request and successfully transferred your funds.</p>
    
    <div style="background-color: #f0fdf4; padding: 22px; border-radius: 18px; border: 1px solid #bbf7d0; text-align: left; margin-bottom: 25px;">
      <p style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: bold;">Payout Summary:</p>
      <p style="margin: 0 0 6px 0; color: #14532d; font-size: 13px;"><strong>Amount:</strong> <strong style="color: #166534; font-size: 16px;">${amount.toFixed(2)} EGP</strong></p>
      <p style="margin: 0 0 6px 0; color: #14532d; font-size: 13px;"><strong>Channel:</strong> ${method}</p>
      <p style="margin: 0; color: #14532d; font-size: 13px; font-family: monospace;"><strong>To Account:</strong> ${address}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">Open Studio Dashboard</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_FINANCE,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout approved email:', error);
    return { success: false, error };
  }
};

export const sendPayoutDeclinedEmail = async (email: string, name: string, amount: number, reason: string, lang: 'ar' | 'en' = 'en') => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: PAYOUT DECLINED EMAIL (${lang.toUpperCase()}) ---\nTarget: ${email}\nName: ${name}\nAmount: ${amount} EGP\nReason: ${reason}\n--------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr 
    ? `تحديث سحب المستحقات: تم إلغاء طلب السحب وإرجاع المبلغ للرصيد`
    : `Fulfillment Update: Withdrawal Request declined | Giftisan`;

  const arContent = `
    <h1 class="heading" style="color: #ef4444; font-size: 24px; margin-bottom: 18px;">تم إلغاء طلب سحب المستحقات</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">أهلاً يا ${name}، تم إلغاء طلب السحب الخاص بك بقيمة <strong>${amount.toFixed(2)} جنيه مصري</strong> وإعادة كامل المبلغ فوراً لرصيدك القابل للسحب في لوحة التحكم.</p>
    
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 18px; border: 1px solid #fecaca; text-align: right; margin-bottom: 25px;">
      <p style="margin: 0; color: #991b1b; font-size: 13px;"><strong>سبب الإلغاء والإرجاع:</strong><br/>${reason}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">تحديث بيانات السحب في الاستوديو</a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: #ef4444; font-size: 24px; margin-bottom: 18px;">Withdrawal Request Declined</h1>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">Hi ${name}, your payout request for <strong>${amount.toFixed(2)} EGP</strong> was declined and the funds have been fully refunded back to your Withdrawable balance.</p>
    
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 18px; border: 1px solid #fecaca; text-align: left; margin-bottom: 25px;">
      <p style="margin: 0; color: #991b1b; font-size: 13px;"><strong>Reason for Cancellation:</strong><br/>${reason}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/studio" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">Update Payout Details</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_FINANCE,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payout declined email:', error);
    return { success: false, error };
  }
};

export const sendBuyerOrderReceiptEmail = async (
  email: string,
  customerName: string,
  orderId: string,
  totalAmount: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  shippingCity?: string,
  lang: 'ar' | 'en' = 'en'
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n--- 📧 DEV: BUYER ORDER RECEIPT (${lang.toUpperCase()}) ---\nTarget: ${email}\nOrder: ${orderId}\nTotal: ${totalAmount} EGP\n--------------------------------------\n`);
    return { success: true };
  }

  const isAr = lang === 'ar';
  const subject = isAr
    ? `تم تأكيد طلبك بنجاح (#${orderId.slice(0, 8)}) | شكراً لدعمك الحرفيين`
    : `Order Confirmed: #${orderId.slice(0, 8)} | Thank you for supporting authentic craft`;

  const itemsHtmlAr = items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">
      <span style="color: #1a2c2c; font-weight: bold;">${item.name} <span style="color: #9ca3af; font-weight: normal;">(×${item.quantity})</span></span>
      <span style="color: #1a2c2c; font-weight: bold;">${(item.price * item.quantity).toLocaleString()} ج.م</span>
    </div>
  `).join('');

  const itemsHtmlEn = items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">
      <span style="color: #1a2c2c; font-weight: bold;">${item.name} <span style="color: #9ca3af; font-weight: normal;">(×${item.quantity})</span></span>
      <span style="color: #1a2c2c; font-weight: bold;">EGP ${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  const arContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 24px; margin-bottom: 12px;">تم تأكيد طلبك بنجاح!</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">أهلاً ${customerName}، يسعدنا إعلامك بأنه تم تأكيد واستلام طلبك بنجاح. الحرفيون يستعدون لتجهيز قطعك الفنية بكل حب وإتقان.</p>
    
    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">رقم الطلب</span>
        <span style="color: #1a2c2c; font-size: 13px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</span>
      </div>
      ${shippingCity ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #9ca3af; font-size: 11px; font-weight: bold;">مدينة التوصيل</span>
          <span style="color: #1a2c2c; font-size: 13px; font-weight: bold;">${shippingCity}</span>
        </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
      <div style="margin-bottom: 12px;">
        ${itemsHtmlAr}
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
        <span style="color: #1a2c2c; font-size: 15px; font-weight: bold;">الإجمالي المدفوع</span>
        <span style="color: ${ACCENT_COLOR}; font-size: 18px; font-weight: bold;">${totalAmount.toLocaleString()} ج.م</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/profile" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">متابعة حالة الطلب</a>
    </div>
  `;

  const enContent = `
    <h1 class="heading" style="color: ${ACCENT_COLOR}; font-size: 24px; margin-bottom: 12px;">Order Confirmed!</h1>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">Hi ${customerName}, your order has been received and confirmed. Our artisans are now preparing your handcrafted treasures with care and mastery.</p>
    
    <div style="background-color: #f9fafb; padding: 22px; border-radius: 18px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #9ca3af; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</span>
        <span style="color: #1a2c2c; font-size: 13px; font-weight: bold; font-family: monospace;">#${orderId.slice(0, 8)}</span>
      </div>
      ${shippingCity ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #9ca3af; font-size: 11px; font-weight: bold;">Delivery City</span>
          <span style="color: #1a2c2c; font-size: 13px; font-weight: bold;">${shippingCity}</span>
        </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
      <div style="margin-bottom: 12px;">
        ${itemsHtmlEn}
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
        <span style="color: #1a2c2c; font-size: 15px; font-weight: bold;">Total Amount</span>
        <span style="color: ${ACCENT_COLOR}; font-size: 18px; font-weight: bold;">EGP ${totalAmount.toLocaleString()}</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/profile" style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block;">View Order Journey</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: SENDER_ORDERS,
      replyTo: SUPPORT_INBOX,
      to: email,
      subject,
      html: wrapEmail(isAr ? arContent : enContent, lang),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending buyer receipt email:', error);
    return { success: false, error };
  }
};
