"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Hammer, Mail, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa6";
import Image from "next/image";
import { subscribeToNewsletter } from "@/lib/actions";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus("success");
      setMessage("Note recorded. We'll alert you first.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Connection error.");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans selection:bg-primary/20 overflow-hidden relative flex flex-col items-center justify-center p-6">
      {/* Texture Layer */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-0" />
      
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#064e3b08_1px,transparent_1px),linear-gradient(to_bottom,#064e3b08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <div className="max-w-4xl w-full z-10 text-center space-y-12 py-20">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl shadow-2xl shadow-primary/5 p-4 border border-primary/5">
            <Image src="/icon.png" alt="Giftisan" fill className="object-contain p-3 rounded-xl" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter uppercase">Giftisan</h1>
            <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-accent/10 text-accent rounded-full border border-accent/20"
          >
            <Hammer className="w-4 h-4 animate-bounce" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Platform Refinement in Progress</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-heading font-black text-primary leading-[0.9] tracking-tighter"
          >
            RESTORING <br />
            <span className="serif italic text-accent font-normal underline decoration-accent/10 underline-offset-[12px] md:underline-offset-[20px]">Native</span> <br />
            CRAFT.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-primary/60 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We&apos;re currently performing essential maintenance to ensure our premier destination for artisanal excellence remains perfect. We&apos;ll be back online shortly.
          </motion.p>
        </div>

        {/* Newsletter Section (Logic Context) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xl mx-auto space-y-6 pt-4"
        >
          <div className="bg-white p-2 rounded-3xl border border-primary/5 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Waitlist for return..." 
                  className="w-full h-16 md:h-20 pl-16 pr-6 bg-transparent outline-none font-bold text-primary placeholder:text-primary/20 text-lg md:text-xl"
                />
              </div>
              <button 
                onClick={handleSubscribe}
                disabled={status === "loading" || status === "success"}
                className="h-16 md:h-20 px-10 md:px-14 bg-primary text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[1.5rem] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : status === "success" ? <CheckCircle2 className="w-6 h-6" /> : "Notify Me"}
              </button>
          </div>
          <AnimatePresence>
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm font-black uppercase tracking-widest ${status === "error" ? "text-red-500" : "text-primary"}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Links Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-12 border-t border-primary/5 space-y-10"
        >
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30">Follow the Journey</p>
            <div className="flex justify-center gap-6 md:gap-8">
              {[
                { icon: FaInstagram, href: "https://www.instagram.com/giftisan.eg/" },
                { icon: FaFacebook, href: "https://www.facebook.com/giftisan.eg" },
                { icon: FaTiktok, href: "https://www.tiktok.com/@giftisan.eg" },
                { icon: FaPinterest, href: "https://www.pinterest.com/giftisaneg" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-primary/5 flex items-center justify-center text-primary/40 hover:bg-primary hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-primary/5 group"
                >
                  <social.icon className="w-6 h-6 md:w-7 md:h-7" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 text-primary/40 font-bold text-sm">
              <Mail className="w-4 h-4 text-accent" />
              <span>Support: <a href="mailto:support@giftisan.com" className="text-primary hover:text-accent border-b border-primary/10 transition-colors">support@giftisan.com</a></span>
            </div>
            <div className="flex items-center gap-3 text-primary/40 font-bold text-sm">
              <Globe className="w-4 h-4 text-accent" />
              <span>Studio: <span className="text-primary italic">Giftisan Native Platform</span></span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[10px] md:text-xs font-black text-primary/20 uppercase tracking-[0.4em] pt-12 md:pt-20"
        >
          © 2026 Giftisan. Handcrafted with Heart.
        </motion.p>
      </div>

      {/* Decorative Assets */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none -z-10 flex justify-between px-10 opacity-5 md:opacity-20">
         <div className="relative w-40 h-56 md:w-64 md:h-96 rounded-3xl overflow-hidden rotate-[-6deg] shadow-2xl border border-primary/10">
           <Image src="/marketing/artisan-working.png" alt="" fill className="object-cover" />
         </div>
         <div className="relative w-40 h-56 md:w-64 md:h-96 rounded-3xl overflow-hidden rotate-[6deg] shadow-2xl border border-primary/10">
           <Image src="/marketing/gift-box.png" alt="" fill className="object-cover" />
         </div>
      </div>
    </div>
  );
}
