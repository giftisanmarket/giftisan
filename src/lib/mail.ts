import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = "https://www.giftisan.com/icon.png";
const SENDER = "Giftisan <support@giftisan.com>";

const emailHeader = `
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${LOGO_URL}" alt="Giftisan" style="width: 80px; height: 80px; margin-bottom: 10px;">
    <div style="font-size: 24px; font-weight: bold; color: #1a2c2c; font-family: 'Outfit', sans-serif;">Giftisan</div>
  </div>
`;

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Welcome to Giftisan!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px;">
          ${emailHeader}
          <h1 style="color: #da7b5a; text-align: center; font-size: 28px;">Welcome to the Circle, ${name}!</h1>
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px; text-align: center;">We're so excited to have you join our community of artisans and treasure hunters.</p>
          <p style="color: #4b5563; line-height: 1.6; font-size: 16px; text-align: center;">Giftisan is a place where craft meets soul. Whether you're here to sell your handmade creations or find that perfect unique gift, you're in the right place.</p>
          <div style="margin: 40px 0; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}" style="background-color: #1a2c2c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">Explore the Marketplace</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 40px; border-top: 1px solid #f3f4f6; pt-20">Happy hunting!</p>
          <p style="color: #1a2c2c; font-weight: bold; text-align: center;">The Giftisan Team</p>
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
  try {
    await resend.emails.send({
      from: SENDER,
      to: artisanEmail,
      subject: 'You have a new order on Giftisan!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px;">
          ${emailHeader}
          <h1 style="color: #da7b5a; text-align: center;">New Order Alert!</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi ${artisanName},</p>
          <p style="color: #4b5563; font-size: 16px;">Great news! Someone just purchased a treasure from your studio.</p>
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin: 30px 0; border: 1px solid #f3f4f6;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Order Reference</p>
            <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: bold;">${orderId}</p>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount</p>
            <p style="margin: 0; color: #da7b5a; font-size: 24px; font-weight: bold;">EGP ${totalAmount.toFixed(2)}</p>
          </div>
          <p style="color: #4b5563; font-size: 16px;">Please log in to your studio dashboard to view shipping details and start fulfillment.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/studio" style="background-color: #1a2c2c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">View Order in Studio</a>
          </div>
          <p style="color: #111827; font-weight: bold; text-align: center; margin-top: 40px;">The Giftisan Team</p>
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
  try {
    await resend.emails.send({
      from: SENDER,
      to: receiverEmail,
      subject: `New message from ${senderName} on Giftisan`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px;">
          ${emailHeader}
          <p style="color: #4b5563; font-size: 16px;">Hi ${receiverName},</p>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;"><strong>${senderName}</strong> sent you a new message regarding a treasure.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/profile/messages" style="background-color: #1a2c2c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Reply to Message</a>
          </div>
          <p style="color: #111827; font-weight: bold; text-align: center; margin-top: 40px;">The Giftisan Team</p>
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
  const confirmLink = `${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/api/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Verify your email for Giftisan',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 20px;">
          ${emailHeader}
          <h1 style="color: #da7b5a; text-align: center; font-size: 24px;">Confirm your email address</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">Thanks for signing up for Giftisan! We're excited to have you join our craftsmanship community. Please verify your email to get started.</p>
          <div style="margin: 40px 0; text-align: center;">
            <a href="${confirmLink}" style="background-color: #da7b5a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(218, 123, 90, 0.2);">Verify Email Address</a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">This link will expire in 24 hours.</p>
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
          <p style="color: #111827; font-weight: bold; text-align: center; margin-top: 40px;">The Giftisan Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

export const sendOrderStatusUpdateEmail = async (email: string, name: string, orderId: string, status: string, productName: string) => {
  const statusColors: Record<string, string> = {
    'PROCESSING': '#3b82f6',
    'SHIPPED': '#da7b5a',
    'DELIVERED': '#10b981',
    'CANCELLED': '#ef4444'
  };

  const statusText: Record<string, string> = {
    'PROCESSING': 'is being prepared',
    'SHIPPED': 'has been shipped',
    'DELIVERED': 'has been delivered',
    'CANCELLED': 'has been cancelled'
  };

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: `Order Update: Your item ${statusText[status] || 'has a new status'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px;">
          ${emailHeader}
          <h1 style="color: #da7b5a; text-align: center;">Order Update</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi ${name},</p>
          <p style="color: #4b5563; font-size: 16px;">We wanted to let you know that your order for <strong>${productName}</strong> has been updated.</p>
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; border: 1px solid #f3f4f6;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; font-weight: bold;">Current Status</p>
            <p style="margin: 10px 0 0; font-size: 28px; font-weight: bold; color: ${statusColors[status] || '#1a2c2c'};">${status}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;"><strong>Order ID:</strong> ${orderId}</p>
          <div style="margin: 40px 0; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/profile" style="background-color: #1a2c2c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">View Order Details</a>
          </div>
          <p style="color: #4b5563; font-size: 16px; text-align: center; margin-top: 40px;">Thank you for supporting independent artisans!</p>
          <p style="color: #111827; font-weight: bold; text-align: center;">The Giftisan Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, error };
  }
};
