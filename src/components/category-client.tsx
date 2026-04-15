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
}

export function CategoryClient({ slug, initialProducts }: CategoryClientProps) {
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
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" }
  ];

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Category Header */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Collections
            </Link>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">{categoryName}</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Discover a curated collection of artisanal {categoryName.toLowerCase()} crafted with passion and heritage by local makers globally.
            </p>
          </motion.div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Toolbar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-sm font-medium text-charcoal/60">
            Showing <span className="text-primary font-bold">{filteredProducts.length}</span> artisanal works
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 border rounded-full text-xs font-black uppercase tracking-widest transition-all",
                showVerifiedOnly 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-white border-primary/10 text-primary hover:bg-primary/5"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> 
                {sortOptions.find(o => o.value === sortBy)?.label}
              </button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-primary/5 shadow-2xl rounded-2xl p-2 z-[100]"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as any);
                          setShowSortOptions(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
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
      <section className="py-12 container mx-auto px-4">
        {initialProducts.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
              <SlidersHorizontal className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-heading font-bold text-primary">No {categoryName} treasures yet</h2>
              <p className="text-charcoal/60 max-w-md mx-auto font-medium leading-relaxed">
                Our master makers are currently busy in their workshops crafting new pieces for the {categoryName} collection. 
                Please check back soon for fresh arrivals.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="group block"
                  >
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                    <BespokeImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={cn(
                        "absolute top-6 right-6 p-4 rounded-full transition-all shadow-lg",
                        isFavorite(product.id)
                          ? "bg-red-50 text-red-500 opacity-100 scale-100"
                          : "bg-white/90 backdrop-blur text-primary opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-6 h-6", isFavorite(product.id) && "fill-current")} />
                    </button>
                    {product.badge && (
                      <div className="absolute bottom-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-2">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none">
                      {product.artisan.user?.name || product.artisan.studioName}
                    </p>
                    <h3 className="text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors leading-tight break-words line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-heading font-bold text-primary">EGP {product.price}.00</p>
                      <div className="h-4 w-px bg-primary/10" />
                      <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{product.category}</span>
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
      <section className="py-32 border-t border-primary/5 mt-12 bg-cream text-center relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-2xl space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">Not what you're looking for?</h2>
          <p className="text-charcoal/60 text-lg leading-relaxed">
            Our artisans thrive on custom commissions. Start a conversation with a master maker to create a piece that tells your unique story.
          </p>
          <Link href="/artisans">
            <button className="h-16 px-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 group">
              Explore Custom Makers
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>
    </main>
  );
}
