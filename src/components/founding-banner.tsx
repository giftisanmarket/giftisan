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
    const isDismissed = localStorage.getItem("giftisan-founding-banner-dismissed");
    if (isDismissed) setIsVisible(false);
  }, []);

  // Hide banner if user is already an artisan or on the become-artisan page
  if (session?.user?.role === "ARTISAN" || pathname.includes("/become-artisan")) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("giftisan-founding-banner-dismissed", "true");
  };

  const isArabic = lang === "ar";

  const message = isArabic 
    ? "هل أنت صانع أو حرفي مصري؟ انضم لجيفتيزان بعمولة 0% خلال 2026"
    : "Are you an Egyptian artisan? Join Giftisan with 0% platform fees in 2026";
  const ctaText = isArabic ? "قدّم متجرك" : "Apply Now";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[61] overflow-hidden bg-[#064E3B] text-white/90 border-b border-white/10"
        >
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-1.5 flex items-center justify-center gap-2 md:gap-4 text-center text-xs">
            <span className="font-medium text-white/90">{message}</span>
            <button
              onClick={() => router.push(`/${lang}/become-artisan`)}
              className="inline-flex items-center gap-1 font-bold text-[#FBBF24] hover:text-[#FDE68A] hover:underline underline-offset-2 transition-colors cursor-pointer shrink-0"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </button>

            <button 
              onClick={handleDismiss}
              className="absolute end-2 md:end-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5 text-white/60 hover:text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
