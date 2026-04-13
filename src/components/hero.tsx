"use client";

import { BespokeImage } from "./bespoke-image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-cream py-16 md:py-24">
      <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm">
            <span>✨</span> Handpicked for the discerning eye
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary leading-[1.1]">
            Elevate Every <br />
            <span className="serif italic font-normal text-accent">Gift-Giving</span> <br />
            Moment
          </h1>
          
          <p className="text-lg text-charcoal/70 max-w-lg leading-relaxed">
            Discover a curated universe of handcrafted treasures, vintage finds, and personalized keepsakes from the world's most talented artisans.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="h-14 px-8 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20">
              Explore Collection
            </button>
            <button className="h-14 px-8 bg-white border border-primary/10 text-primary font-bold rounded-full hover:bg-primary/5 transition-all">
              Meet Our Artisans
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <BespokeImage
              src="/hero.png"
              alt="Artisanal Gifts"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl shadow-xl max-w-[200px] border border-white/50">
            <p className="text-sm font-medium text-charcoal/80">
              "The quality of the handcrafted journal is better than anything I've found in high-end boutiques."
            </p>
            <p className="text-xs font-bold text-accent mt-2">— Sarah J., London</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
