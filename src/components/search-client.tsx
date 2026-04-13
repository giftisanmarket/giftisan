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
}

export function SearchClient({ query, initialProducts }: SearchClientProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredProducts = showVerifiedOnly 
    ? initialProducts.filter(p => p.artisan.isVerified) 
    : initialProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Result Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary flex items-center gap-3">
            Results for <span className="text-accent italic serif brightness-90">"{query}"</span>
          </h1>
          <p className="text-charcoal/60 text-sm font-medium mt-1">Found {filteredProducts.length} treasures match your criteria</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 border rounded-full text-sm font-bold transition-all",
              showVerifiedOnly 
                ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                : "bg-white border-primary/10 text-primary hover:bg-primary/5"
            )}
          >
            <CheckCircle2 className="w-4 h-4" /> Verified Only
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-primary/10 rounded-full text-sm font-bold text-primary hover:bg-primary/5 transition-all">
            <ArrowUpDown className="w-4 h-4" /> Sort
          </button>
        </div>
      </div>

      {initialProducts.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-primary/20" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary">No treasures found...</h2>
          <p className="text-charcoal/60">We couldn't find anything matching your search. Try adjusting your keywords or browse our top categories.</p>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {["Vase", "Jewelry", "Handmade"].map(tag => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="px-4 py-2 bg-primary/5 rounded-full text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/products/${p.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(p);
                      }}
                      className={cn(
                        "absolute top-4 right-4 p-3 rounded-full transition-all",
                        isFavorite(p.id)
                          ? "bg-red-50 text-red-500 opacity-100 scale-100"
                          : "bg-white/80 backdrop-blur text-primary opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isFavorite(p.id) && "fill-current")} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">
                        {p.artisan.user?.name || p.artisan.studioName}
                      </p>
                      {p.artisan.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-accent" />}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary leading-tight group-hover:text-accent transition-colors">{p.name}</h3>
                    <p className="text-lg font-bold text-primary">${p.price}.00</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
