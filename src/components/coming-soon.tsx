"use client";

import { motion } from "framer-motion";
import { Hammer, Sparkles, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title?: string;
  description?: string;
  featureName?: string;
}

export function ComingSoon({ 
  title = "Something beautiful is blooming", 
  description = "Our artisans are currently handcrafting this feature. It'll be worth the wait.",
  featureName = "Coming Soon"
}: ComingSoonProps) {
  return (
    <div className="relative overflow-hidden bg-cream rounded-[3rem] border border-primary/5 p-8 md:p-20 text-center shadow-2xl shadow-primary/5 mb-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest border border-accent/20">
          <Sparkles className="w-4 h-4" />
          {featureName}
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary leading-tight">
            {title}
          </h2>
          <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="w-full sm:w-auto h-14 px-10 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center group"
          >
            Explore the Marketplace
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button 
            className="w-full sm:w-auto h-14 px-10 glass text-primary font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2 border border-primary/10"
          >
            <Mail className="w-5 h-5" />
            Notify Me
          </button>
        </div>

        <div className="pt-12 flex items-center justify-center gap-8 border-t border-primary/5 mt-12">
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-primary">85%</p>
            <p className="text-[10px] font-black text-charcoal/40 uppercase tracking-tighter">Handcrafted</p>
          </div>
          <div className="w-px h-10 bg-primary/10" />
          <div className="text-center">
            <p className="text-2xl font-heading font-bold text-primary">T-Minus</p>
            <p className="text-[10px] font-black text-charcoal/40 uppercase tracking-tighter">Launch Ready</p>
          </div>
        </div>
      </motion.div>

      {/* Floating Icons Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <Hammer className="absolute top-10 right-20 w-32 h-32 -rotate-12" />
        <Sparkles className="absolute bottom-20 left-10 w-24 h-24 rotate-45" />
      </div>
    </div>
  );
}
