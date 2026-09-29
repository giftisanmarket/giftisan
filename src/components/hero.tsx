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
  const card1Title = dict?.home?.hero_card1_title || "Fall feels more special with these picks";
  const card1Button = dict?.home?.hero_card1_button || "Take a look";
  const card2Title = dict?.home?.hero_card2_title || "For the grown-up Halloween fans";
  const card2Button = dict?.home?.hero_card2_button || "Shop now";

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 md:px-8 py-2 md:py-4">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 items-stretch"
      >
        {/* Left Card: Featured Fall & Halloween Picks (Etsy-Style Split Banner & Mobile Arched Layout) */}
        <div className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-[#0e4d4a] shadow-xs border border-primary/10">
          {/* Mobile Layout (< sm): Vertical Stack with Arched Pumpkin Cutout (Exact Etsy Mobile Design) */}
          <Link
            href="/products"
            className="sm:hidden flex flex-col w-full h-[300px] justify-between pt-6 px-4 pb-0 text-decoration-none group/mobile"
          >
            <div className="text-center px-2">
              <h1 className="font-serif text-[1.45rem] font-normal text-white leading-[1.18] tracking-tight">
                {card1Title}
              </h1>
            </div>

            {/* Dome / Arch shaped image container */}
            <div className="relative w-full h-[190px] overflow-hidden rounded-t-[140px]">
              <Image
                src="/marketing/hero-fall-picks.jpg"
                alt="Fall & Halloween Handcrafted Picks"
                fill
                priority
                className="object-cover object-[center_60%] group-hover/mobile:scale-104 transition-transform duration-700 ease-out"
                sizes="100vw"
              />
            </div>
          </Link>

          {/* Desktop / Tablet Layout (sm and up): Side-by-side Split Banner */}
          <div className="hidden sm:flex h-[260px] md:h-[275px] lg:h-[290px] w-full">
            {/* Content Half */}
            <div className="basis-[60%] flex flex-col justify-center items-center text-center p-6 md:p-8 lg:p-9 z-10 space-y-4">
              <h1 className="font-serif sm:text-3xl md:text-[2.1rem] lg:text-[2.25rem] font-normal text-white leading-[1.16] tracking-tight max-w-[340px]">
                {card1Title}
              </h1>
              
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#0e4d4a] font-bold text-xs sm:text-sm hover:bg-cream hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
              >
                {card1Button}
              </Link>
            </div>

            {/* Image Half */}
            <div className="relative basis-[40%] h-full overflow-hidden">
              <Image
                src="/marketing/hero-fall-picks.jpg"
                alt="Fall & Halloween Handcrafted Picks"
                fill
                priority
                className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 50vw, 35vw"
              />
            </div>
          </div>
        </div>

        {/* Right Card: Grown-up Halloween Fans (Etsy-Style Visual Feature) */}
        <Link
          href="/search?q=halloween"
          className="hidden lg:block lg:col-span-4 group relative rounded-2xl overflow-hidden h-[230px] sm:h-[260px] md:h-[275px] lg:h-[290px] shadow-xs border border-primary/10 cursor-pointer"
        >
          <Image
            src="/marketing/hero-halloween-fans.jpg"
            alt="For the grown-up Halloween fans"
            fill
            priority
            className="object-cover object-top group-hover:scale-104 transition-transform duration-700 ease-out"
            sizes="(max-width: 1024px) 100vw, 30vw"
          />

          {/* Bottom Gradient Overlay styled for dark atmospheric drama */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-45% to-transparent pointer-events-none" />

          {/* Bottom Content */}
          <div className="absolute bottom-4 start-4 end-4 md:bottom-5 md:start-5 md:end-5 text-white space-y-1 z-10">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight drop-shadow-sm">
              {card2Title}
            </h2>
            <div className="pt-0.5">
              <span className="inline-block text-xs sm:text-sm font-semibold text-white group-hover:underline underline-offset-4 decoration-white transition-all">
                {card2Button}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
