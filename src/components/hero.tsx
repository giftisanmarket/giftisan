"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  artisanCount?: number;
  dict?: any;
}

export function Hero({ dict }: HeroProps) {
  const card1Title = dict?.home?.hero_card1_title || "Elevate Every Gift-Giving Moment";
  const card1Button = dict?.home?.hero_card1_button || "Shop Gifts";
  const card2Title = dict?.home?.hero_card2_title || "Discover the artisans we have our eye on";
  const card2Button = dict?.home?.hero_card2_button || "Meet the Makers";

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 md:px-8 py-3 md:py-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch"
      >
        {/* Left Card: Featured Handcrafted Gift Banner */}
        <div className="lg:col-span-7 xl:col-span-8 group relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#064E3B] to-[#043327] grid grid-cols-1 sm:grid-cols-2 min-h-[380px] lg:min-h-[430px] shadow-sm border border-primary/10">
          {/* Content Half */}
          <div className="flex flex-col justify-center items-center text-center p-8 sm:p-10 md:p-12 lg:p-10 xl:p-14 z-10 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-accent-light text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-accent-light" />
              <span>{dict?.common?.explore || "Curated Gifts"}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-medium text-cream leading-[1.18] tracking-tight">
              {card1Title}
            </h1>
            
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-cream text-primary font-bold text-sm sm:text-base hover:bg-white hover:text-accent transition-all duration-200 shadow-md active:scale-95 hover:shadow-lg shrink-0"
            >
              {card1Button}
            </Link>
          </div>

          {/* Image Half */}
          <div className="relative w-full h-[280px] sm:h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[430px] overflow-hidden">
            <Image
              src="/hero.webp"
              alt="Giftisan Handcrafted Collection"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
            />
          </div>
        </div>

        {/* Right Card: Artisan Spotlight (Desktop only, hidden on small screens) */}
        <Link
          href="/artisans"
          className="hidden lg:block lg:col-span-5 xl:col-span-4 group relative rounded-2xl md:rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] lg:min-h-[430px] shadow-sm border border-primary/10"
        >
          <Image
            src="/marketing/artisan-working.webp"
            alt="Artisan Craftsmanship"
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 1024px) 100vw, 35vw"
          />

          {/* Bottom Gradient Overlay styled with deep brand tone */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04281E]/95 via-[#04281E]/40 to-transparent pointer-events-none" />

          {/* Bottom Content */}
          <div className="absolute bottom-6 start-6 end-6 md:bottom-8 md:start-8 md:end-8 text-white space-y-2.5 z-10">
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-white leading-tight drop-shadow-sm">
              {card2Title}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-accent-light group-hover:text-white underline underline-offset-4 decoration-accent-light/70 group-hover:decoration-white transition-all">
              {card2Button}
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
