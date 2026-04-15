"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Sparkles, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function PreLaunchBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Reset visibility when navigating if it was dismissed? 
  // No, let's keep it dismissed for the session if they close it.
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("prelaunch-banner-v3");
    if (isDismissed) setIsVisible(false);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("prelaunch-banner-v3", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[60] bg-primary text-white overflow-hidden shadow-2xl"
        >
          <div className="container mx-auto px-4 py-3 md:py-2.5 flex flex-col items-center justify-center text-center relative">
            <div className="flex items-center gap-2 text-accent-light mb-1">
              <Sparkles className="w-3 h-3 animate-pulse shrink-0" />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">Pre-Launch Protocol</span>
            </div>
            
            <p className="text-[10px] md:text-xs font-medium text-white/90 max-w-3xl leading-relaxed pr-8 md:pr-0">
              <span className="font-bold">Soft-Launch in Progress:</span> Complete your first order today! 
              <span className="text-accent-light/80 italic hidden md:inline"> We're currently enabling manual shipping and payments as we finalize our automated systems.</span>
            </p>

            <button 
              onClick={handleDismiss}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40" />
            </button>
          </div>

          {/* Decorative background light */}
          <div className="absolute top-0 right-1/4 w-32 h-full bg-accent/20 blur-[40px] -skew-x-12" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
