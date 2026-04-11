"use client";

import { MOCK_PRODUCTS } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Heart, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

export function CategoryClient({ slug }: { slug: string }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  // Filter products by category (case-insensitive)
  const products = MOCK_PRODUCTS.filter(
    p => p.category.toLowerCase() === slug.toLowerCase()
  );

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

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
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">{categoryName}</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Discover a curated collection of artisanal {slug} crafted with passion and heritage by local makers globally.
            </p>
          </motion.div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Toolbar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm font-medium text-charcoal/60">
            Showing <span className="text-primary font-bold">{products.length}</span> artisanal works
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-full text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
          </button>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 container mx-auto px-4">
        {products.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <h3 className="text-2xl font-heading font-bold text-primary">No treasures found in this category yet.</h3>
            <p className="text-charcoal/40">Our artisans are busy crafting new items. Check back soon!</p>
            <Link href="/" className="inline-block text-accent font-bold hover:underline">Return Home →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
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
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black text-accent uppercase tracking-[0.2em]">{product.artisan.name}</p>
                    <h3 className="text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-heading font-bold text-primary">${product.price}.00</p>
                      <span className="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded-md font-bold uppercase">Handmade</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* More Discovery */}
      <section className="py-24 border-t border-primary/5 mt-12 bg-cream text-center">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">
          <h2 className="text-3xl font-heading font-bold text-primary">Not what you're looking for?</h2>
          <p className="text-charcoal/60">Our artisans take custom commissions. Start a conversation to create something uniquely yours.</p>
          <button className="h-14 px-10 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20">
            Explore Custom Makers
          </button>
        </div>
      </section>
    </main>
  );
}
