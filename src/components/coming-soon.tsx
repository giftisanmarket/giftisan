"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Star, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { subscribeToNewsletter } from "@/lib/actions";

export default function ComingSoon() {
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
      setMessage("You're in! We'll notify you soon.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Brand Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl w-full"
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            className="relative w-20 h-20 mb-6 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform" />
            <div className="absolute inset-0 bg-accent/20 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-transform" />
            <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border border-primary/5">
              <Image
                src="/icon.png"
                alt="Giftisan Logo"
                fill
                className="object-cover scale-110"
                sizes="80px"
              />
            </div>
          </motion.div>
          <h2 className="text-4xl font-heading font-black text-primary tracking-tighter uppercase mb-1">
            Giftisan
          </h2>
          <div className="h-1 w-12 bg-accent rounded-full" />
        </div>

        <motion.h1 
          className="text-5xl md:text-8xl font-heading font-black mb-8 leading-[0.9] tracking-tighter text-primary"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          MAKING <br />
          <span className="serif italic text-accent font-normal">Magic</span> <br />
          HANDMADE.
        </motion.h1>

        <motion.p 
          className="text-primary/70 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          We're curating a world-class marketplace for unique, artisanal treasures. Our workshop is buzzing as we prepare for launch.
        </motion.p>

        {/* Email Signup Form */}
        <motion.form 
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6 p-2 bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl shadow-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="relative flex-1 group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-accent transition-colors" />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Join the Inner Circle" 
              disabled={status === "loading" || status === "success"}
              className="w-full bg-transparent pl-12 pr-4 h-14 text-base outline-none text-primary font-bold placeholder:text-primary/30 disabled:opacity-50"
            />
          </div>
          <button 
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-14 px-10 bg-primary text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              "Notify Me"
            )}
          </button>
        </motion.form>

        {/* Feedback Message */}
        <div className="h-6 mb-14">
          <AnimatePresence mode="wait">
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`text-sm font-bold tracking-wide ${status === "error" ? "text-red-500" : "text-primary"}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Status */}
        <motion.div 
          className="flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-[11px] font-bold text-primary/50 uppercase tracking-[0.2em]">Bespoke Craftsmanship</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary/50 uppercase tracking-[0.2em]">Launching 2026</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b08_1px,transparent_1px),linear-gradient(to_bottom,#064e3b08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
    </div>
  );
}
