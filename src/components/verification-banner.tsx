"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Mail, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resendVerificationEmailAction } from "@/lib/actions";

export function VerificationBanner() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  // If not logged in or already verified, don't show
  if (!session?.user || (session.user as any).emailVerified || !isVisible) {
    return null;
  }

  const handleResend = async () => {
    if (!session.user?.email) return;
    setIsResending(true);
    await resendVerificationEmailAction(session.user.email);
    setIsResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-accent text-white border-b border-accent-light/20 relative z-[45]"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">
              Account Unverified: <span className="text-white/70 normal-case font-medium">Please check your inbox ({session.user.email}) to verify. </span>
              <Link href="/profile/settings" className="underline hover:text-white/60 transition-colors ml-1">Typo? Fix it here.</Link>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center gap-2"
            >
              {resent ? "Email Sent!" : isResending ? "Sending..." : "Resend Link"}
              {!resent && !isResending && <Mail className="w-3 h-3" />}
            </button>
            <button onClick={() => setIsVisible(false)} className="hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
