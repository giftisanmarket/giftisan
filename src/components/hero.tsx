"use client";

import { BespokeImage } from "./bespoke-image";
import { motion } from "framer-motion";
import { Search, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Hero({ artisanCount = 0, dict }: { artisanCount?: number; dict: any }) {
  return (
    <section className="relative w-full overflow-hidden bg-cream pt-24 md:pt-32 pb-16 md:pb-24 lg:pb-32">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6 md:space-y-10 flex flex-col items-center lg:items-start text-center lg:text-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] w-fit">
            <Sparkles className="w-3 h-3" /> {dict.common.explore}
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-primary leading-[1.1] tracking-tight">
            {dict.home.hero_elevate}
          </h1>
          
          <p className="text-base md:text-xl text-charcoal/60 max-w-lg leading-relaxed font-medium">
            {dict.home.hero_discover}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <form 
              action="/search"
              className="flex-1 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 group">
                <Search className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
                <input 
                  name="q"
                  type="text"
                  placeholder={dict.home.hero_search_placeholder}
                  className="w-full h-14 md:h-16 ps-14 pe-6 bg-white border border-primary/10 rounded-xl md:rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-xl shadow-primary/5 font-medium text-primary placeholder:text-primary/30 text-sm md:text-base"
                />
              </div>
              <button 
                type="submit"
                className="h-14 md:h-16 px-8 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 shrink-0 text-sm md:text-base active:scale-95 duration-200"
              >
                {dict.home.hero_search_button}
              </button>
            </form>
            
            <Link
              href="/become-artisan"
              className="h-14 md:h-16 px-8 bg-white text-primary border border-primary/10 font-bold rounded-xl md:rounded-full hover:bg-cream transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base shrink-0"
            >
              {dict.common.open_studio} <Store className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-6 pt-2">
            <Link href="/artisans" className="text-[10px] md:text-xs font-bold text-charcoal/40 hover:text-accent transition-all flex items-center gap-2 group active:scale-95">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              {dict.home.hero_join_artisans.replace('{count}', artisanCount > 0 ? `${artisanCount}+` : "")}
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mt-8 lg:mt-0"
        >
          <div className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
            <BespokeImage
              src="/hero.webp"
              alt={dict.seo.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -start-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-10 -end-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="absolute bottom-6 end-6 lg:-bottom-12 lg:-end-12 glass p-6 md:p-8 rounded-3xl shadow-2xl max-w-[180px] md:max-w-[240px] border border-white/50 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-1000 delay-500">
            <p className="text-xs md:text-base font-medium text-charcoal/80 leading-relaxed italic">
              "{dict.home.testimonial_quote}"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-px bg-accent/30" />
              <p className="text-[10px] md:text-xs font-black text-accent uppercase tracking-widest">{dict.home.testimonial_author}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

