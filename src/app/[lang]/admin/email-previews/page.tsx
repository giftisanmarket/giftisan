import { Navbar } from "@/components/navbar";
import { SITE_URL } from "@/lib/constants";
import { Link } from "lucide-react";

import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.email_previews_title || "Email Previews"} | ${dict.admin?.marketplace || "Marketplace"}`,
  };
}

export default async function EmailPreviewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const PRIMARY_COLOR = "#1a2c2c";
  const ACCENT_COLOR = "#da7b5a";
  const CREAM_BG = "#fcf9f1";
  const LOGO_URL = "/icon.png";

  const emailHeader = `
    <div style="text-align: center; padding: 40px 0 30px 0; background-color: ${PRIMARY_COLOR}; border-radius: 24px 24px 0 0;">
      <img src="${SITE_URL}/icon.png" alt="Giftisan" style="width: 64px; height: 64px; display: block; margin: 0 auto 15px auto;">
      <div style="font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: -0.02em; font-family: sans-serif;">Giftisan</div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; tracking: 0.2em; margin-top: 5px; font-family: sans-serif;">${dict.admin.handcrafted_mastery}</div>
    </div>
  `;

  const emailFooter = `
    <div style="text-align: center; padding: 40px 20px; border-top: 1px solid rgba(0,0,0,0.05);">
      <p style="color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; font-family: sans-serif;">${dict.admin.proudly_based_egypt}</p>
      <p style="color: #1a2c2c; font-weight: bold; font-size: 14px; font-family: sans-serif;">${dict.admin.giftisan_team}</p>
    </div>
  `;

  const templates = [
    {
      name: "Welcome Email",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: ${PRIMARY_COLOR}; font-size: 32px; margin-bottom: 20px;">Welcome to the Circle, Nour!</h1>
              <p style="color: #4b5563; line-height: 1.8; font-size: 17px; margin-bottom: 30px;">We're honored to have you join our community of artisans and treasure hunters. Giftisan is a sanctum where craft meets soul.</p>
              <div style="margin: 40px 0;">
                <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block; text-transform: uppercase;">Explore the Vault</div>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Order Notification",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px;">
              <h1 style="color: ${ACCENT_COLOR}; text-align: center; font-size: 32px; margin-bottom: 10px;">New Commission!</h1>
              <p style="color: #4b5563; font-size: 17px; text-align: center; margin-bottom: 30px;">Hi Hazem, a collector has just claimed a treasure from your studio.</p>
              <div style="background-color: #f9fafb; padding: 35px; border-radius: 20px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase;">Order Reference</p>
                <p style="margin: 0 0 25px 0; color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold;">#GT-48291</p>
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px; font-weight: black; text-transform: uppercase;">Total Commission</p>
                <p style="margin: 0; color: ${ACCENT_COLOR}; font-size: 32px; font-weight: bold;">EGP 2,450.00</p>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Verification Email",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">Verify your identity</h1>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Confirm your connection to the Inner Circle to unlock the full Giftisan experience.</p>
              <div style="margin: 40px 0;">
                <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase;">Confirm Connection</div>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Dialogue Notification",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <p style="color: #4b5563; font-size: 17px; margin-bottom: 20px;">Hi Nour,</p>
              <h2 style="color: ${PRIMARY_COLOR}; font-size: 24px; margin-bottom: 30px; font-weight: bold;"><strong>Mazen Studio</strong> has initiated a dialogue regarding a treasure.</h2>
              <div style="margin: 40px 0;">
                <div style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase;">Join Dialogue</div>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Journey Update (Shipping)",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 30px;">Journey Update</h1>
              <p style="color: #4b5563; font-size: 17px; line-height: 1.6;">Hi Sherif, your order for <strong>Handmade Ceramics Set</strong> has reached a new milestone.</p>
              <div style="margin: 40px 0; background-color: #f9fafb; padding: 40px; border-radius: 24px; border: 1px solid #f3f4f6;">
                <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: black; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.2em;">Current Milestone</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: ${ACCENT_COLOR};">SHIPPED</p>
                <p style="margin: 20px 0 0 0; font-size: 13px; font-weight: bold; color: #6b7280;">Ref: #GT-94821</p>
              </div>
              <div style="margin-top: 40px;">
                <div style="background-color: ${PRIMARY_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase;">Track Journey</div>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Journey Update (Delivered / Reviews)",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 30px;">Your Treasure has Arrived</h1>
              <p style="color: #4b5563; font-size: 17px; line-height: 1.6;">Hi Sherif, your order for <strong>Handmade Ceramics Set</strong> has been delivered.</p>
              
              <div style="margin: 40px 0; background-color: #f9fafb; padding: 40px; border-radius: 24px; border: 1px solid #f3f4f6;">
                <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: black; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.2em;">Current Milestone</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #10b981;">DELIVERED</p>
                <p style="margin: 20px 0 0 0; font-size: 13px; font-weight: bold; color: #6b7280;">Ref: #GT-94821</p>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">Artisans thrive on your feedback—would you take a moment to share your story or rate the craftsmanship?</p>
              
              <div style="margin-top: 40px;">
                <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 20px 45px; border-radius: 16px; font-weight: 800; font-size: 14px; display: inline-block; text-transform: uppercase;">Share Your Story</div>
              </div>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Security Recovery",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="color: ${PRIMARY_COLOR}; font-size: 28px; margin-bottom: 20px;">Access Recovery</h1>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">We received a request to reclaim your account enclave. Click below to secure your connection with a new password.</p>
              <div style="margin: 40px 0;">
                <div style="background-color: ${PRIMARY_COLOR}; color: white; padding: 20px 45px; border-radius: 16px; font-weight: 800; font-size: 15px; display: inline-block; text-transform: uppercase;">Secure My Account</div>
              </div>
              <p style="color: #9ca3af; font-size: 12px; font-style: italic;">Recovery link expires in 60 minutes.</p>
            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Artisan Outreach (Arabic)",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;" dir="rtl">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: 'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 40px; text-align: right;">
              <p style="color: ${PRIMARY_COLOR}; font-size: 22px; font-weight: bold; margin-bottom: 25px;">أهلاً يا [الاسم]،</p>

              <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">
                شفت شغل الـ <strong style="color: ${ACCENT_COLOR};">[Product]</strong> بتاعك النهاردة، وبجد حاجة تشرف ومستواها عالي جداً. ده بالظبط نوع الفن اللي نفسنا نعرضه ونكبره في "جيفتيزان".
              </p>

              <p style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 20px;">
                إحنا بنأسس منصة حصرية قائمة على الدعوات الخاصة، معمول مخصوص عشان يريح "الحرفيين" والفنانين من دوشة المبيعات واللوجستيات. بمجرد انضمامك، بنوفرلك لوحة تحكم <strong>برو استوديو</strong> متكاملة تقدر من خلالها تعرض منتجاتك، تتابع أرباحك وتدير طلباتك بكل سهولة، بالإضافة لرسائل التواصل المباشر مع العملاء. والأهم إن النظام بيتولى إرسال كل إيميلات التأكيد والشحن أوتوماتيك، عشان تفضل "رايق" ومركز بس في فنك ومساحتك الإبداعية.
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
                <a href="${SITE_URL}" style="text-decoration: none;">
                  <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block;">
                    لقطة سريعة من هنا
                  </div>
                </a>
              </div>

            </div>
            ${emailFooter}
          </div>
        </div>
      `
    },
    {
      name: "Artisan Outreach (English)",
      html: `
        <div style="background-color: ${CREAM_BG}; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; font-family: 'Inter', Helvetica, Arial, sans-serif;">
            ${emailHeader}
            <div style="padding: 40px 40px; text-align: left;">
              <p style="color: ${PRIMARY_COLOR}; font-size: 20px; font-weight: bold; margin-bottom: 25px;">Hello [Name],</p>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.9; margin-bottom: 20px;">
                I came across your work on <strong style="color: ${ACCENT_COLOR};">[Product]</strong> today, and I have to say — it's genuinely impressive. It's exactly the kind of craft we want to celebrate and showcase on <strong>Giftisan</strong>.
              </p>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.9; margin-bottom: 20px;">
                We're building an invite-only platform designed specifically to free artisans and creators from the noise of selling, logistics, and marketing. Once you join, we give you a fully-equipped <strong>Pro Studio Dashboard</strong> where you can list your products, track your earnings, manage orders effortlessly, and message customers directly — while our system handles all confirmation and shipping emails automatically.
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
                <a href="${SITE_URL}" style="text-decoration: none;">
                  <div style="background-color: ${ACCENT_COLOR}; color: white; padding: 18px 40px; border-radius: 16px; font-weight: 800; font-size: 16px; display: inline-block;">
                    Take a Quick Look
                  </div>
                </a>
              </div>

            </div>
            ${emailFooter}
          </div>
        </div>
      `
    }
  ];

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">{dict.admin.email_previews_title} <span className="serif italic font-normal text-accent">{dict.admin.previews_accent}</span></h1>
          <p className="text-charcoal/40 font-medium">{dict.admin.email_previews_desc}</p>
        </div>

        <div className="space-y-20">
          {templates.map((template, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-accent font-black">{i + 1}</div>
                 <h2 className="text-2xl font-heading font-bold text-primary">{template.name}</h2>
              </div>
              <div className="border border-primary/5 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white scale-[0.8] md:scale-100 origin-top-left lg:origin-center">
                <div dangerouslySetInnerHTML={{ __html: template.html }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
