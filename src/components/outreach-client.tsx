"use client";

import { useState } from "react";
import { Send, User, MessageSquare, Mail, Check, AlertCircle, Eye, X } from "lucide-react";
import { sendCustomEmailAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { motion, AnimatePresence } from "framer-motion";

export function OutreachClient({ dict }: { dict: any }) {
  const isAr = dict.profile?.delivered === "تم التوصيل" || dict.profile?.delivered === "تم الاستلام";

  const [gmailTo, setGmailTo] = useState("");
  const [gmailSubject, setGmailSubject] = useState("");
  const [gmailBody, setGmailBody] = useState("");
  const [gmailDir, setGmailDir] = useState<'rtl' | 'ltr'>(isAr ? 'rtl' : 'ltr');
  const [gmailStatus, setGmailStatus] = useState<"idle" | "sending">("idle");
  const [sendLogs, setSendLogs] = useState<{ email: string; status: "pending" | "success" | "error"; error?: string }[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isEmpty = (html: string) => {
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  };

  const getBrandedHtml = (bodyHtml: string, dir: 'ltr' | 'rtl') => {
    const primaryColor = "#064e3b";
    const accentColor = "#da7b5a";
    const creamBg = "#fcf9f1";
    
    const emailStyles = `
      <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; width: 100% !important; background-color: ${creamBg}; }
        .heading { font-family: system-ui, sans-serif; font-weight: bold; }
        .email-wrapper { width: 100%; background-color: ${creamBg}; padding: 30px; box-sizing: border-box; }
        .email-card { max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); overflow: hidden; }
        .email-body { padding: 40px; text-align: ${dir === 'rtl' ? 'right' : 'left'}; color: #4b5563; font-size: 16px; line-height: 1.8; }
        
        /* TipTap rich text styles mapping */
        .email-body ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .email-body ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .email-body li { margin: 0.25em 0; }
        .email-body strong { font-weight: 700; }
        .email-body em { font-style: italic; }
        .email-body u { text-decoration: underline; }
        .email-body s { text-decoration: line-through; }
        .email-body p { margin: 0 0 0.75em 0; }
        
        @media only screen and (max-width: 600px) {
          .email-wrapper { padding: 12px !important; }
          .email-card { border-radius: 16px !important; }
          .email-body { padding: 24px 20px !important; }
        }
      </style>
    `;

    return `
      <!DOCTYPE html>
      <html dir="${dir}">
        <head>
          <meta charset="utf-8">
          ${emailStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-card">
              <!-- Header -->
              <div style="text-align: center; padding: 40px 20px 30px 20px; background-color: ${primaryColor}; border-radius: 24px 24px 0 0;">
                <img src="/icon.png" alt="Giftisan" width="56" height="56" align="center" style="display: block; margin: 0 auto 14px auto; border-radius: 12px; border: 0; outline: none;">
                <div class="heading" style="font-size: 26px; font-weight: bold; color: #ffffff; letter-spacing: -0.02em; text-align: center;">Giftisan</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.4); font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 5px; text-align: center;">Handcrafted Mastery</div>
              </div>
              <!-- Body -->
              <div class="email-body">
                ${bodyHtml}
              </div>
              <!-- Footer -->
              <div style="text-align: center; padding: 40px 20px; border-top: 1px solid rgba(0,0,0,0.05); background-color: #ffffff; border-radius: 0 0 24px 24px;">
                <p style="color: #9ca3af; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; margin-top: 0;">Proudly Based in Egypt • Supporting Local Artisans</p>
                <p style="color: ${primaryColor}; font-weight: bold; font-size: 14px; margin: 0;">The Giftisan Team</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gmailTo.trim() || !gmailSubject.trim() || isEmpty(gmailBody)) {
      toast.error(isAr ? "برجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    const emailsList = gmailTo
      .split(/[,;]/)
      .map(e => e.trim())
      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emailsList.length === 0) {
      toast.error(isAr ? "برجاء إدخال عناوين بريد إلكتروني صالحة" : "Please enter valid email addresses");
      return;
    }

    setGmailStatus("sending");
    setSendLogs(emailsList.map(email => ({ email, status: "pending" as const })));

    let successCount = 0;

    for (let i = 0; i < emailsList.length; i++) {
      try {
        const res = await sendCustomEmailAction({
          to: emailsList[i],
          subject: gmailSubject,
          body: gmailBody,
          dir: gmailDir,
        });

        if (res.success) {
          successCount++;
          setSendLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: "success" as const } : log));
        } else {
          setSendLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: "error" as const, error: res.error } : log));
        }
      } catch {
        setSendLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: "error" as const, error: "Network Error" } : log));
      }
    }

    setGmailStatus("idle");

    if (successCount === emailsList.length) {
      toast.success(isAr ? `تم إرسال جميع الرسائل (${successCount}) بنجاح!` : `All ${successCount} emails sent successfully!`);
      
      // Auto open preview modal on successful test send
      setIsPreviewOpen(true);
    } else {
      toast.error(isAr ? `تم إرسال ${successCount} من أصل ${emailsList.length} رسائل` : `Sent ${successCount} of ${emailsList.length} emails`);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">

          {/* Header */}
          <div className="bg-primary/95 text-white px-6 py-4 flex items-center gap-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm tracking-tight">
                {isAr ? "إنشاء رسالة جديدة" : "New Message"}
              </h3>
              <p className="text-[10px] text-white/50 font-bold tracking-wider uppercase">
                {isAr ? "عبر خدمة Resend — يمكنك إرسال لأكثر من عنوان" : "Powered by Resend — supports multiple recipients"}
              </p>
            </div>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">

            {/* To */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  {isAr ? "إلى" : "To"}
                </label>
                <span className="text-[10px] font-bold text-accent/60">
                  {isAr ? "افصل بين الإيميلات بفاصلة (,)" : "Separate multiple addresses with , or ;"}
                </span>
              </div>
              <textarea
                required
                rows={2}
                value={gmailTo}
                onChange={(e) => setGmailTo(e.target.value)}
                className="w-full px-6 py-4 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all font-bold text-primary text-sm resize-none"
                placeholder="artisan1@gmail.com, artisan2@gmail.com"
                dir="ltr"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                {isAr ? "الموضوع" : "Subject"}
              </label>
              <input
                type="text"
                required
                value={gmailSubject}
                onChange={(e) => setGmailSubject(e.target.value)}
                className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all font-bold text-primary text-sm"
                placeholder={isAr ? "عنوان الرسالة..." : "Email subject..."}
                dir={gmailDir}
              />
            </div>

            {/* Rich Text Body */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                {isAr ? "نص الرسالة" : "Message Body"}
              </label>
              <RichTextEditor
                value={gmailBody}
                onChange={setGmailBody}
                onDirChange={setGmailDir}
                dir={gmailDir}
                isAr={isAr}
                placeholder={
                  isAr
                    ? "اكتب رسالتك هنا...\nسيتم إرسالها مغلفة في قالب جيفتيزان الفاخر."
                    : "Write your message here...\nIt will be delivered wrapped in the premium Giftisan email template."
                }
              />
            </div>

            {/* Batch Send Logs */}
            {sendLogs.length > 0 && (
              <div className="p-5 bg-cream/50 rounded-2xl border border-primary/5 space-y-3">
                <h4 className="text-xs font-black text-primary/50 uppercase tracking-wider">
                  {isAr ? "حالة الإرسال" : "Send Status"}
                </h4>
                <div className="grid gap-2 max-h-[160px] overflow-y-auto">
                  {sendLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-primary/5 last:border-0 gap-4">
                      <span className="font-mono text-primary/70 truncate">{log.email}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {log.status === "pending" && (
                          <>
                            <span className="w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                            <span className="text-accent font-bold">{isAr ? "جاري..." : "Sending..."}</span>
                          </>
                        )}
                        {log.status === "success" && (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600 font-bold">{isAr ? "تم" : "Sent"}</span>
                          </>
                        )}
                        {log.status === "error" && (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-500 font-bold">{log.error || (isAr ? "فشل" : "Failed")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-primary/5 flex items-center gap-3">
              <button
                type="submit"
                disabled={gmailStatus === "sending"}
                className="px-8 h-14 bg-primary hover:bg-primary-light text-white font-heading font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all"
              >
                {gmailStatus === "sending" ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{gmailStatus === "sending" ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال" : "Send Message")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                disabled={gmailStatus === "sending" || isEmpty(gmailBody)}
                className="px-6 h-14 border border-primary/10 hover:border-primary/20 hover:bg-primary/5 text-primary/70 hover:text-primary font-heading font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-[0.98] cursor-pointer"
                title={isAr ? "معاينة الرسالة المنسقة" : "Preview formatted email"}
              >
                <Eye className="w-4 h-4 text-accent" />
                <span>{isAr ? "معاينة" : "Preview"}</span>
              </button>

              <button
                type="button"
                disabled={gmailStatus === "sending"}
                onClick={() => {
                  setGmailTo("");
                  setGmailSubject("");
                  setGmailBody("<p></p>");
                  setSendLogs([]);
                }}
                className="px-6 h-14 border border-primary/10 hover:border-primary/20 text-primary/50 hover:text-primary font-heading font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 ml-auto"
              >
                {isAr ? "مسح" : "Clear"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modern Glassmorphic Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" dir={isAr ? "rtl" : "ltr"}>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-primary/5 z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-primary/5 bg-cream/40 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-primary text-base">
                    {isAr ? "معاينة البريد الإلكتروني" : "Email Sandbox Preview"}
                  </h3>
                  <p className="text-[10px] text-primary/50 font-bold uppercase tracking-wider mt-0.5">
                    {isAr ? "شكل الرسالة النهائي كما سيصل في صندوق الوارد" : "Real-time client view of the branded newsletter template"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/45 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subject Info bar */}
              <div className="px-8 py-3 bg-cream/10 border-b border-primary/5 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-primary/60 font-bold">
                <div>
                  <span className="text-primary/40 mr-1.5">{isAr ? "الموضوع:" : "Subject:"}</span>
                  <span className="text-primary">{gmailSubject || (isAr ? "(بدون عنوان)" : "(No Subject)")}</span>
                </div>
                <div className="md:ml-auto font-mono text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {gmailDir === "rtl" ? "RTL (Arabic)" : "LTR (English)"}
                </div>
              </div>

              {/* Sandbox Render Area */}
              <div className="flex-1 p-6 md:p-8 bg-cream/20 overflow-hidden">
                <iframe
                  srcDoc={getBrandedHtml(gmailBody, gmailDir)}
                  className="w-full h-full border border-primary/5 rounded-3xl bg-cream/40 shadow-inner"
                  title="Branded Email Preview"
                />
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-primary/5 bg-cream/20 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-6 h-12 bg-primary hover:bg-primary-light text-white font-heading font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center transition-all cursor-pointer"
                >
                  {isAr ? "رائع، إغلاق" : "Looks Good!"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
