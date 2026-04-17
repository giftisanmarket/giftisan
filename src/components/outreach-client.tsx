"use client";

import { useState } from "react";
import { Send, CheckCircle2, User, Mail, Tag, MessageSquare } from "lucide-react";
import { sendOutreachAction } from "@/lib/actions";
import { toast } from "react-hot-toast";

export function OutreachClient({ dict }: { dict: any }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [subject, setSubject] = useState("دعوة خاصة لعرض فنك على منصة جيفتيزان");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isAr = lang === 'ar';

  // Switch subject default when lang changes
  const handleLangSwitch = (newLang: 'ar' | 'en') => {
    setLang(newLang);
    setSubject(newLang === 'ar'
      ? "دعوة خاصة لعرض فنك على منصة جيفتيزان"
      : "A Special Invitation to Showcase Your Craft on Giftisan"
    );
    // Reset fields
    setName("");
    setProduct("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await sendOutreachAction({ email, name, product, subject, lang });
      if (res.success) {
        setStatus("success");
        toast.success(isAr ? "تم إرسال الدعوة بنجاح!" : "Invite sent successfully!");
        setTimeout(() => {
          setEmail("");
          setName("");
          setProduct("");
          setStatus("idle");
        }, 3000);
      } else {
        setStatus("error");
        toast.error(res.error || "Failed to send email");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("An unexpected error occurred");
    }
  };

  const getButtonText = () => {
    if (status === "loading") return isAr ? "جاري الإرسال..." : "Sending...";
    if (status === "success") return isAr ? "تم الإرسال بنجاح!" : "Sent Successfully!";
    return isAr ? "إرسال الدعوة الرسمية" : "Send Official Invite";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 relative overflow-hidden">

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-lg shadow-primary/5">
              <Send className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-3">Artisan Outreach</h2>
            <p className="text-charcoal/50 text-sm font-medium">Send personalized invitations directly to artisans via Resend.</p>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-1 p-1 bg-cream rounded-2xl border border-primary/5">
              <button
                type="button"
                onClick={() => handleLangSwitch('ar')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isAr
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-primary/40 hover:text-primary"
                }`}
              >
                🇪🇬 عربي
              </button>
              <button
                type="button"
                onClick={() => handleLangSwitch('en')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  !isAr
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-primary/40 hover:text-primary"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir={isAr ? "rtl" : "ltr"}>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                {isAr ? "موضوع الإيميل" : "Email Subject"}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                dir={isAr ? "rtl" : "ltr"}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {isAr ? "اسم الحرفي" : "Artisan Name"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                  placeholder={isAr ? "مثال: نور" : "e.g. Sarah"}
                  dir={isAr ? "rtl" : "ltr"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                  placeholder="artisan@studio.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                <Tag className="w-3 h-3" />
                {isAr ? "حرفة / منتج الفنان" : "Artisan's Craft / Product"}
              </label>
              <input
                type="text"
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                placeholder={isAr ? "مثال: السيراميك والمج اليدوي" : "e.g. Handmade Ceramics & Pottery"}
                dir={isAr ? "rtl" : "ltr"}
              />
            </div>

            <div className="pt-6 border-t border-primary/5">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl text-sm uppercase tracking-widest active:scale-[0.98] ${
                  status === "success"
                    ? "bg-green-500 text-white shadow-green-500/20"
                    : "bg-primary text-white hover:bg-primary-light shadow-primary/20"
                } disabled:opacity-80`}
              >
                {status === "loading" ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {getButtonText()}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
