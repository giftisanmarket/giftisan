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

      <div className="container mx-auto px-4 pt-40 pb-20 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-2xl px-4"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
            Your Request is in Good Hands!
          </h1>
          <p className="text-charcoal/60 text-lg leading-relaxed mb-12">
            Thank you for supporting our artisan community. Your manual order request has been sent directly to the artisan's studio dashboard. They will review your treasures and contact you shortly to coordinate payment and delivery.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
            <div className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Artisan Preparation</h3>
                <p className="text-sm text-charcoal/50">Your items are being hand-curated and packed in sustainable luxury wrap.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Artisan Connection</h3>
                <p className="text-sm text-charcoal/50">Expect a message or call from the artisan soon to finalize the manual billing and shipping details.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="h-14 px-10 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group w-full md:w-auto"
            >
              Continue Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/favorites" 
              className="h-14 px-10 bg-white border border-primary/10 text-primary font-bold rounded-full hover:bg-primary/5 transition-all w-full md:w-auto flex items-center justify-center"
            >
              View Your Favorites
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
