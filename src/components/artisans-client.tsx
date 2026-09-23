"use client";

import { Navbar } from "@/components/navbar";
import { ArtisanCard } from "@/components/artisans/artisan-card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ArtisansClientProps {
  artisans: any[];
  dict: any;
}

export function ArtisansClient({ artisans, dict }: ArtisansClientProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="text-center mb-16 md:mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-4 h-4" /> {dict.home?.artisans_registry || "The Master Registry"}
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary">
            {dict.home?.artisans_meet_masters_prefix || "Meet the"}{" "}
            <span className="serif italic font-normal text-accent">
              {dict.home?.artisans_meet_masters_suffix || "Masters"}
            </span>
          </h1>
          <p className="text-charcoal/40 max-w-2xl mx-auto text-lg">
            {dict.home?.artisans_desc}
          </p>
        </div>

        {artisans.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-accent mx-auto" />
            <p className="text-charcoal/60 font-medium">
              {dict.home?.no_artisans_found || "No artisans listed at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artisans.map((artisan, idx) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.35 }}
              >
                <ArtisanCard artisan={artisan} dict={dict} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
