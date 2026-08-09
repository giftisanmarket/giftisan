"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function FoundingBanner({ dict }: { dict: any }) {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string || "en";

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("giftisan-founding-banner-dismissed");
    if (isDismissed) setIsVisible(false);
  }, []);

  // Hide banner if user is already an artisan or on the become-artisan page
  if (session?.user?.role === "ARTISAN" || pathname.includes("/become-artisan")) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem("giftisan-founding-banner-dismissed", "true");
  };

  const bannerData = dict?.common?.founding_banner || {
    title: "2026 Founding Artisan Program",
    desc: "Enjoy 0% platform fees throughout the 2026 season.",
    cta: "Apply Now"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[61] overflow-hidden shadow-2xl cursor-pointer group border-b border-white/5"
          style={{ backgroundColor: '#064E3B' }}
          onClick={() => router.push(`/${lang}/become-artisan`)}
        >
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-2.5 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-center relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#D97706] rounded-full flex items-center justify-center shadow-lg">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-[#FDFCF0]">{bannerData.title}</span>
            </div>
            
            <p className="text-[11px] md:text-sm font-black text-white leading-relaxed flex items-center gap-3">
              {bannerData.desc}
              <span className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-[#D97706] hover:bg-[#B45309] rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                {bannerData.cta} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </p>

            <button 
              onClick={handleDismiss}
              className="absolute end-2 md:end-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60 hover:text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
