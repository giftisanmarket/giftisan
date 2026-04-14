import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: 'Giftisan <support@giftisan.com>',
      to: email,
      subject: 'Welcome to Giftisan!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #da7b5a;">Welcome to Giftisan, ${name}!</h1>
          <p>We're so excited to have you join our community of artisans and treasure hunters.</p>
          <p>Giftisan is a place where craft meets soul. Whether you're here to sell your handmade creations or find that perfect unique gift, you're in the right place.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}" style="background-color: #1a2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore the Marketplace</a>
          </div>
          <p>Happy hunting!</p>
          <p>The Giftisan Team</p>
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
      from: 'Giftisan Status <support@giftisan.com>',
      to: artisanEmail,
      subject: 'You have a new order on Giftisan!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #da7b5a;">New Order Alert!</h1>
          <p>Hi ${artisanName},</p>
          <p>Great news! Someone just purchased a treasure from your studio.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          </div>
          <p>Please log in to your studio dashboard to view the order details and start fulfillment.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/studio" style="background-color: #1a2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order in Studio</a>
          </div>
          <p>Keep up the amazing work!</p>
          <p>The Giftisan Team</p>
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
      from: 'Giftisan Inbox <support@giftisan.com>',
      to: receiverEmail,
      subject: `New message from ${senderName} on Giftisan`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <p>Hi ${receiverName},</p>
          <p><strong>${senderName}</strong> sent you a new message on Giftisan.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://www.giftisan.com'}/profile/messages" style="background-color: #1a2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Message</a>
          </div>
          <p>The Giftisan Team</p>
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
      from: 'Giftisan Account <support@giftisan.com>',
      to: email,
      subject: 'Verify your email for Giftisan',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #da7b5a;">Confirm your email address</h1>
          <p>Thanks for signing up for Giftisan! Please click the button below to verify your email and activate your account.</p>
          <div style="margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #1a2c2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>The Giftisan Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};
