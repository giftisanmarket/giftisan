"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, HelpCircle, Package, Truck, Wallet, Bug, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/constants";
import { toast } from "react-hot-toast";

interface ArtisanSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export function ArtisanSupportModal({
  isOpen,
  onClose,
  lang,
}: ArtisanSupportModalProps) {
  const isAr = lang === "ar";
  const [copied, setCopied] = useState(false);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(WHATSAPP_COMMUNITY_URL);
    setCopied(true);
    toast.success(isAr ? "تم نسخ رابط الجروب بنجاح!" : "Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const topics = [
    {
      icon: Package,
      title: isAr ? "رفع وتعديل المنتجات" : "Product Uploads & Edits",
      desc: isAr ? "استفسارات الصور، المقاسات، والخيارات" : "Photos, pricing, and variants help",
    },
    {
      icon: Truck,
      title: isAr ? "الشحن وتسليم الطلبات" : "Shipping & Fulfillment",
      desc: isAr ? "تنسيق استلام بوسطا وتجهيز الطرود" : "Courier pickup & parcel packaging",
    },
    {
      icon: Wallet,
      title: isAr ? "الأرباح وإنستاباي" : "Payouts & InstaPay",
      desc: isAr ? "مواعيد التحويل والحسابات البنكية" : "Payout schedules & wallet details",
    },
    {
      icon: Bug,
      title: isAr ? "الإبلاغ عن أخطاء الموقع" : "Bug & Glitch Reports",
      desc: isAr ? "واجهتك مشكلة؟ ابعت سكرين شوت وهنحلها فوراً" : "Spotted an error? Send a screenshot",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/50 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-cream rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden p-6 sm:p-8 md:p-9 border border-white/60 text-start"
          >
            {/* Close X Button */}
            <button
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-full bg-white/70 hover:bg-white text-primary/40 hover:text-primary transition-all shadow-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with WhatsApp Glow Badge */}
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#25D366]/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-16 h-16 md:w-18 md:h-18 rounded-2xl md:rounded-3xl bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/25">
                  <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#15803d] bg-[#25D366]/15 px-3 py-1 rounded-full border border-[#25D366]/30 inline-block">
                  {isAr ? "دعم ومساعدة الصُنّاع المباشر" : "Direct Artisan Support Line"}
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-primary">
                  {isAr ? "محتاج مساعدة أو استفسار؟" : "Need Help or Have a Question?"}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed max-w-md mx-auto">
                  {isAr
                    ? "فريق جيفتيزان معك خطوة بخطوة. انضم لجروب الواتساب المخصص للصناع للدردشة المباشرة معنا، الإبلاغ عن أي مشكلة، أو طلب المساعدة في أي وقت."
                    : "The Giftisan team is with you every step. Join our dedicated WhatsApp support group to chat directly with us, report any bug, or ask for guidance anytime."}
                </p>
              </div>
            </div>

            {/* What you can ask for (Topics Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {topics.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-primary/5 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight">{t.title}</h4>
                      <p className="text-[10px] text-charcoal/50 leading-snug mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/25 hover:shadow-[#25D366]/40 transition-all active:scale-[0.98]"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isAr ? "افتح جروب الواتساب وتواصل معنا" : "Open WhatsApp Group & Chat"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-3 px-4 bg-white border border-primary/10 hover:border-primary/20 text-primary font-bold rounded-2xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-primary/40" />}
                  <span>{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ رابط الجروب" : "Copy Invite Link")}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-6 bg-transparent hover:bg-primary/5 text-charcoal/50 hover:text-charcoal font-bold rounded-2xl transition-all text-xs"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
