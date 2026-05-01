"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, SlidersHorizontal, ArrowUpDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

interface SearchClientProps {
  query: string;
  initialProducts: any[];
  dict: any;
}

export function SearchClient({ query, initialProducts, dict }: SearchClientProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const filteredProducts = initialProducts
    .filter(p => !showVerifiedOnly || p.artisan.isVerified)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const sortOptions = [
    { label: dict.home.newest_arrivals, value: "newest" },
    { label: dict.home.price_low_high, value: "price-low" },
    { label: dict.home.price_high_low, value: "price-high" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Search Result Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-12 px-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary flex flex-wrap items-center gap-x-3 gap-y-1">
            {query ? (
              <>{dict.home.search_results_for} <span className="text-accent italic serif brightness-90">"{query}"</span></>
            ) : (
              <>{(dict.home.explore_title_base || dict.home.explore_collection_title?.split(' ')[0])} <span className="text-accent italic serif brightness-90">{(dict.home.explore_title_accent || dict.home.explore_collection_title?.split(' ').slice(1).join(' '))}</span></>
            )}
          </h1>
          <p className="text-charcoal/40 text-xs md:text-base font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {dict.home.found_treasures.replace('{count}', filteredProducts.length.toString())}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 h-10 md:h-12 border rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-95",
              showVerifiedOnly 
                ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                : "bg-white border-primary/10 text-primary hover:bg-primary/5"
            )}
          >
            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> 
            <span className="hidden sm:inline">{dict.home.verified_only}</span>
            <span className="sm:hidden">{dict.home.verified}</span>
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-8 h-10 md:h-12 bg-white border border-primary/10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all active:scale-95"
            >
              <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4" /> 
              <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <span className="sm:hidden">{dict.home.sort}</span>
            </button>

            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute end-0 top-full mt-2 w-48 md:w-64 bg-white border border-primary/5 shadow-2xl rounded-2xl p-2 z-[100]"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as any);
                        setShowSortOptions(false);
                      }}
                      className={cn(
                        "w-full text-start px-4 py-3 rounded-xl text-[10px] md:text-sm font-bold transition-all",
                        sortBy === option.value ? "bg-primary/5 text-primary" : "text-charcoal/60 hover:bg-cream hover:text-primary"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {initialProducts.length === 0 ? (
        <div className="py-24 md:py-32 text-center max-w-md mx-auto space-y-6 md:space-y-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-primary/10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">{dict.home.no_treasures_found}</h2>
            <p className="text-charcoal/40 text-xs md:text-base leading-relaxed">{dict.home.no_treasures_desc}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {Object.values(dict.common.trending_tags).slice(0, 4).map((tag: any) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="px-5 md:px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary-light transition-all shadow-md active:scale-95"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/products/${p.slug || p.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden mb-3 md:mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(p);
                      }}
                      className={cn(
                        "absolute top-2 end-2 md:top-6 md:end-6 p-2 md:p-4 rounded-full transition-all active:scale-75 shadow-lg",
                        isFavorite(p.id)
                          ? "bg-red-50 text-red-500 opacity-100"
                          : "bg-white/90 backdrop-blur text-primary lg:opacity-0 lg:group-hover:opacity-100 opacity-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-4 h-4 md:w-6 md:h-6", isFavorite(p.id) && "fill-current")} />
                    </button>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[7px] md:text-[10px] font-black text-accent uppercase tracking-[0.2em] leading-none mb-1">
                        {p.artisan.user?.name || p.artisan.studioName}
                      </p>
                      {p.artisan.isVerified && <CheckCircle2 className="w-2 md:w-3.5 h-2 md:h-3.5 text-accent" />}
                    </div>
                    <h3 className="text-sm md:text-2xl font-heading font-bold text-primary leading-tight group-hover:text-accent transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs md:text-xl font-heading font-bold text-primary">{dict.product.currency} {p.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* More Discovery */}
      <section className="py-20 md:py-32 border-t border-primary/5 mt-20 md:mt-32 bg-cream text-center relative overflow-hidden -mx-4 md:-mx-12 px-6">
        <div className="container mx-auto max-w-2xl space-y-6 md:space-y-10 relative z-10">
          <h2 className="text-3xl md:text-6xl font-heading font-bold text-primary">{dict.home.not_found_title}</h2>
          <p className="text-charcoal/60 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            {dict.home.custom_commissions_desc}
          </p>
          <Link href="/artisans">
            <button className="h-14 md:h-16 px-8 md:px-16 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 group active:scale-95 duration-200">
              {dict.home.explore_custom_makers}
              <span className="inline-block ms-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>
    </div>
  );
}

