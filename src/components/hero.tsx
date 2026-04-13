"use client";

import { BespokeImage } from "./bespoke-image";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-black uppercase tracking-[0.2em] text-[10px]">
            <Sparkles className="w-3 h-3" /> Handpicked for the discerning eye
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary leading-[1.1]">
            Elevate Every <br />
            <span className="serif italic font-normal text-accent">Gift-Giving</span> <br />
            Moment
          </h1>
          
          <p className="text-lg text-charcoal/70 max-w-lg leading-relaxed">
            Discover a curated universe of handcrafted treasures, vintage finds, and personalized keepsakes from the world's most talented artisans.
          </p>
          
          <form 
            action="/search"
            className="flex flex-col sm:flex-row gap-4 pt-4 max-w-xl"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
              <input 
                name="q"
                type="text"
                placeholder="Search for treasures (e.g. 'vase', 'ring')"
                className="w-full h-16 pl-14 pr-6 bg-white border border-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-xl shadow-primary/5 font-medium text-primary placeholder:text-primary/30"
              />
            </div>
            <button 
              type="submit"
              className="h-16 px-10 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 shrink-0"
            >
              Search
            </button>
          </form>
          
          <div className="flex flex-wrap gap-6 pt-2">
            <Link href="/artisans" className="text-xs font-bold text-charcoal/40 hover:text-accent transition-all flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Join 1,200+ Master Artisans
            </Link>
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
