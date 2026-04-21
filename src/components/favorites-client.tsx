"use client";

import { useFavorites } from "@/context/favorites-context";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FavoritesClient({ dict }: { dict: any }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-heading font-bold text-primary mb-4 text-center md:text-start">
               {dict.home.favorites_title || "Your Favorites"}
            </h1>
            <p className="text-charcoal/60 text-lg leading-relaxed text-center md:text-start">
              {dict.home.favorites_desc || "A curated collection of your favorite artisanal treasures. Save them for later or add them to your collection today."}
            </p>
          </header>

          {favorites.length === 0 ? (
            <div className="py-24 bg-white rounded-[3rem] border border-primary/5 text-center shadow-2xl shadow-primary/5 px-8">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary/20" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-primary">{dict.home.favorites_empty || "Your list is currently empty"}</h2>
              <p className="text-charcoal/60 mt-2 mb-8">{dict.home.favorites_empty_desc || "Start exploring the collection to find treasures you love."}</p>
              <Link 
                href="/" 
                className="h-14 px-10 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center w-fit mx-auto group"
              >
                {dict.common.start_shopping || "Explore Treasures"}
                <span className="ms-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {favorites.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-8 border border-primary/5 shadow-xl shadow-primary/5 hover:border-accent/30 transition-all"
                  >
                    {/* Image */}
                    <div className="relative w-full md:w-48 aspect-square rounded-[2rem] overflow-hidden shrink-0 shadow-lg">
                      {product.images?.[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-center md:text-start space-y-2">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest">{(product.artisan as any)?.studioName || product.artisan?.name}</p>
                      <h3 className="text-2xl font-heading font-bold text-primary">{product.name}</h3>
                      <p className="text-sm text-charcoal/60 line-clamp-2">{product.description}</p>
                      <p className="text-2xl font-heading font-bold text-primary pt-2">{dict.product.currency || "EGP"} {product.price}.00</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={(product.stock || 0) <= 0}
                        className={cn(
                          "flex-1 md:w-48 h-14 bg-primary text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group",
                          (product.stock || 0) > 0 
                            ? "hover:bg-primary-light shadow-primary/20" 
                            : "opacity-40 grayscale !cursor-not-allowed pointer-events-auto"
                        )}
                      >
                        {(product.stock || 0) > 0 ? (
                          <>
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {dict.product.add_to_cart || "Move to Cart"}
                          </>
                        ) : (
                          dict.product.sold_out || "Sold Out"
                        )}
                      </button>
                      <button 
                        onClick={() => toggleFavorite(product)}
                        title="Remove from favorites"
                        className="w-14 h-14 shrink-0 border border-primary/10 rounded-2xl text-primary/40 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

