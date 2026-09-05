"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const { data: session, update } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Sync session ONLY when switching back to the tab (e.g. after verifying email in another tab)
  useEffect(() => {
    const handleFocus = () => {
      if (session?.user && !(session.user as any).emailVerified && !(session.user as any).isOAuth) {
        update();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [session?.user, update]);

  // Only show if user is logged in, unverified, not OAuth, and not dismissed
  const isUnverified = Boolean(
    session?.user && 
    !(session.user as any).emailVerified && 
    !(session.user as any).isOAuth
  );

  if (!isUnverified || !isVisible) {
    return null;
  }

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setIsResending(true);
    await resendVerificationEmailAction(session.user.email);
    setIsResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  const accountUnverifiedText = d?.common?.account_unverified || "Account Unverified:";
  const checkEmailText = (d?.common?.check_email_to_verify || "Please check {email} to verify and unlock features.")
    .replace('{email}', session?.user?.email || '');
  const emailSentText = d?.common?.email_sent || "Email Sent!";
  const sendingText = d?.common?.sending || "Sending...";
  const resendLinkText = d?.common?.resend_link || "Resend Link";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full bg-[#D97706] text-white border-b border-amber-600/30 relative z-[45] shadow-sm"
        style={{ backgroundColor: "#D97706" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-3 md:py-2 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest leading-relaxed text-center md:text-start">
              {accountUnverifiedText} <span className="text-white/80 normal-case font-medium block md:inline">{checkEmailText}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-5 py-2 bg-white/15 hover:bg-white/25 rounded-full transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              {resent ? emailSentText : isResending ? sendingText : resendLinkText}
              {!resent && !isResending && <Mail className="w-3 h-3" />}
            </button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="p-1 hover:text-white/60 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

