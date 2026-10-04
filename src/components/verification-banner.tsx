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
        className="w-full bg-[#D97706] text-white border-b border-amber-600/30 relative z-[45] shadow-sm overflow-hidden"
        style={{ backgroundColor: "#D97706" }}
      >
        <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-2 relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 pe-7 sm:pe-0">
            {/* Message & Alert Icon */}
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider leading-snug sm:leading-relaxed text-start">
                <span className="text-white">{accountUnverifiedText}</span>{" "}
                <span className="text-white/90 normal-case font-medium block sm:inline break-all sm:break-normal">
                  {checkEmailText}
                </span>
              </p>
            </div>
            
            {/* Actions: Resend & Dismiss */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end sm:justify-start">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resent}
                className="w-full sm:w-auto text-[10px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap px-4 py-1.5 sm:py-2 bg-white/15 hover:bg-white/25 active:bg-white/30 rounded-full transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                <span>{resent ? emailSentText : isResending ? sendingText : resendLinkText}</span>
                {!resent && !isResending && <Mail className="w-3.5 h-3.5 shrink-0" />}
              </button>
              
              {/* Dismiss button visible on sm+ screens inline */}
              <button 
                type="button"
                onClick={() => setIsVisible(false)} 
                className="hidden sm:flex p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-all shrink-0 cursor-pointer active:scale-90"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dismiss button positioned in top-end corner on mobile */}
          <button 
            type="button"
            onClick={() => setIsVisible(false)} 
            className="sm:hidden absolute top-2 end-2 p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer active:scale-90"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

