"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Mail, X } from "lucide-react";
import { useState } from "react";
import { resendVerificationEmailAction } from "@/lib/actions";

export function VerificationBanner({ dict }: { dict?: any }) {
  const d = dict || {
    common: {
      account_unverified: "Account Unverified:",
      check_email_to_verify: "Please check {email} to verify and unlock features.",
      email_sent: "Email Sent!",
      sending: "Sending...",
      resend_link: "Resend Link"
    }
  };
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  // If session is loading, or not logged in, or already verified, don't show
  if (status === "loading" || !session?.user || (session.user as any).emailVerified || !isVisible) {
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
        <div className="container mx-auto px-4 py-3 md:py-2 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest leading-relaxed text-center md:text-start">
              {d.common.account_unverified} <span className="text-white/70 normal-case font-medium block md:inline">{d.common.check_email_to_verify.replace('{email}', session.user.email || '')}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all flex items-center gap-2 active:scale-95"
            >
              {resent ? d.common.email_sent : isResending ? d.common.sending : d.common.resend_link}
              {!resent && !isResending && <Mail className="w-3 h-3" />}
            </button>
            <button onClick={() => setIsVisible(false)} className="p-1 hover:text-white/60 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

