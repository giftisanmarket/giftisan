"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Heart, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <main className="min-h-screen bg-cream overflow-hidden">
      <Navbar />
      
      {/* Celebration Confetti (Subtle) */}
      {windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
          recycle={false}
          colors={["#064E3B", "#D97706", "#FDFCF0", "#0D9488"]}
          opacity={0.6}
        />
      )}

      <div className="container mx-auto px-6 pt-24 md:pt-40 pb-20 flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20"
        >
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-2xl px-2"
        >
          <h1 className="text-4xl md:text-7xl font-heading font-bold text-primary mb-6 tracking-tight leading-tight">
            Your Request is in Good Hands!
          </h1>
          <p className="text-charcoal/60 text-base md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
            Thank you for supporting our artisan community. Your manual order request has been sent directly to the artisan's studio. They will review your treasures and contact you shortly.
          </p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 text-left">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
                <Package className="w-7 h-7 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Artisan Prep</h3>
                <p className="text-xs md:text-sm text-charcoal/50 leading-relaxed mt-1">Your items are being hand-curated and packed in sustainable luxury wrap.</p>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Direct Dialogue</h3>
                <p className="text-xs md:text-sm text-charcoal/50 leading-relaxed mt-1">The artisan will contact you soon to finalize billing and the shipping journey.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="h-16 px-12 bg-primary text-white font-bold rounded-full hover:bg-brand transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group w-full sm:w-auto active:scale-95"
            >
              Continue Discovery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/favorites" 
              className="h-16 px-12 bg-white border border-primary/10 text-primary font-bold rounded-full hover:bg-primary/5 transition-all w-full sm:w-auto flex items-center justify-center active:scale-95"
            >
              View Favorites
            </Link>
          </div>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
      </div>
    </main>
  );
}
