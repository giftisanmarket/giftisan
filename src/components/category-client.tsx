"use client";

import { Navbar } from "@/components/navbar";
import { BespokeImage } from "./bespoke-image";
import Link from "next/link";
import { Heart, SlidersHorizontal, ArrowLeft, ArrowUpDown, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface CategoryClientProps {
  slug: string;
  initialProducts: any[];
  dict: any;
}

export function CategoryClient({ slug, initialProducts, dict }: CategoryClientProps) {
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

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      {/* Category Header */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
              {dict.home.back_to_collections}
            </Link>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">{dict.common.categories_list?.[slug] || categoryName}</h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              {dict.home.category_desc_prefix} {dict.common.categories_list?.[slug]?.toLowerCase() || categoryName.toLowerCase()} {dict.home.category_desc_suffix}
            </p>
          </motion.div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Toolbar */}
      <div className="sticky top-[72px] md:top-[124px] z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-3 md:py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-row justify-between items-center gap-3">
          <p className="text-[9px] md:text-sm font-medium text-charcoal/60 uppercase tracking-widest">
            <span className="text-primary font-bold">{filteredProducts.length}</span>
            <span className="ms-1 opacity-50">{dict.home.found_treasures.split(' ')[2]}</span>
          </p>
          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className={cn(
                "flex items-center gap-1 px-3 md:px-6 py-1.5 md:py-2 border rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-90",
                showVerifiedOnly 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-white border-primary/10 text-primary hover:bg-primary/5"
              )}
            >
              <CheckCircle2 className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> 
              <span>{dict.home.artisans_tab}</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-1.5 px-3 md:px-6 py-1.5 md:py-2 bg-white border border-primary/10 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-90"
              >
                <ArrowUpDown className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> 
                <span className="md:inline hidden">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <span className="md:hidden inline">{dict.home.sort}</span>
              </button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute end-0 top-full mt-2 w-48 md:w-56 bg-white border border-primary/5 shadow-2xl rounded-2xl p-2 z-[100]"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as any);
                          setShowSortOptions(false);
                        }}
                        className={cn(
                          "w-full text-start px-4 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all",
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
      </div>

      {/* Grid */}
      <section className="py-6 md:py-12 container mx-auto px-4 md:px-6">
        {initialProducts.length === 0 ? (
          <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
              <SlidersHorizontal className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="space-y-3 px-4">
              <h2 className="text-xl md:text-3xl font-heading font-bold text-primary">{dict.home.no_category_treasures.replace('{name}', dict.common.categories_list?.[slug] || categoryName)}</h2>
              <p className="text-charcoal/60 max-w-md mx-auto text-xs md:text-lg font-medium leading-relaxed">
                {dict.home.no_category_desc}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="group block"
                  >
                  <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden mb-3 md:mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                    <BespokeImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={cn(
                        "absolute top-2 end-2 md:top-6 md:end-6 p-2 md:p-4 rounded-full transition-all shadow-lg scale-90 md:scale-100 active:scale-75",
                        isFavorite(product.id)
                          ? "bg-red-50 text-red-500 opacity-100"
                          : "bg-white/90 backdrop-blur text-primary opacity-0 group-hover:opacity-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-4 h-4 md:w-6 md:h-6", isFavorite(product.id) && "fill-current")} />
                    </button>
                    {product.badge && (
                      <div className="absolute bottom-2 start-2 md:bottom-6 md:start-6 px-2 md:px-4 py-0.5 md:py-1.5 bg-white/90 backdrop-blur text-primary text-[7px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 md:space-y-2 px-1">
                    <p className="text-[7px] md:text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mb-1">
                      {product.artisan.studioName || "Artisan Made"}
                    </p>
                    <h3 className="text-sm md:text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3">
                      <p className="text-xs md:text-xl font-heading font-bold text-primary">{dict.product.currency} {product.price}</p>
                      <div className="h-3 w-px bg-primary/10" />
                      <span className="text-[7px] md:text-[10px] font-bold text-charcoal/40 uppercase tracking-widest whitespace-nowrap">{dict.common.categories_list?.[product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")] || product.category}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* More Discovery */}
      <section className="py-20 md:py-32 border-t border-primary/5 mt-12 bg-cream text-center relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-2xl space-y-6 md:space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">{dict.home.not_found_title}</h2>
          <p className="text-charcoal/60 text-base md:text-lg leading-relaxed">
            {dict.home.custom_commissions_desc}
          </p>
          <Link href="/artisans">
            <button className="h-14 md:h-16 px-8 md:px-12 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 group text-sm md:text-base active:scale-95 duration-200">
              {dict.home.explore_custom_makers}
              <span className="inline-block ms-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>
    </main>
  );
}

