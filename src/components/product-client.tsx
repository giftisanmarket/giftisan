"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Heart, Share2, Star, Truck, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { Product } from "@/lib/data";

export function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);
  const [personalization, setPersonalization] = useState("");

  return (
    <main className="min-h-screen bg-cream pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Refined Live Preview - Bottom Anchored */}
              {product.canPersonalize && personalization && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-6 right-6 pointer-events-none"
                >
                  <div className="bg-primary/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between gap-4">
                    <div className="shrink-0">
                      <p className="text-[9px] text-accent font-black uppercase tracking-widest">Live Preview</p>
                    </div>
                    <p className="serif italic text-lg text-white line-clamp-1 flex-1 text-right">
                      {personalization}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-charcoal/40 font-medium">(24 Reviews)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 border border-primary/10 rounded-full hover:bg-white transition-all text-primary">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-3xl font-heading font-bold text-primary mb-8">
              ${product.price}.00
            </p>

            <p className="text-lg text-charcoal/70 leading-relaxed mb-8 border-l-4 border-accent/20 pl-6 py-2">
              {product.description}
            </p>

            {/* Artisan Quick Bio */}
            <Link
              href={`/artisans/${product.artisan.name.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-4 p-6 bg-white rounded-3xl mb-8 border border-primary/5 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cream group-hover:scale-105 transition-transform">
                <Image src={product.artisan.avatar} alt={product.artisan.name} fill />
              </div>
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-tighter">Handcrafted by</p>
                <h3 className="text-xl font-heading font-bold text-primary group-hover:text-accent transition-colors">{product.artisan.name}</h3>
                <p className="text-sm text-charcoal/60">{product.artisan.location}</p>
              </div>
            </Link>

            {product.canPersonalize && (
              <div className="bg-white/50 border border-primary/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">✨</span>
                  <h3 className="font-heading font-bold text-primary">Personalize Your Treasure</h3>
                </div>
                <p className="text-xs text-charcoal/50 mb-4">Our artisans will hand-emboss your text onto this piece.</p>
                <textarea
                  placeholder="Enter engraving text (e.g. 'For Sarah, with love')"
                  className="w-full bg-white border border-primary/20 rounded-xl p-4 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent min-h-[100px] resize-none transition-all placeholder:text-primary/40 shadow-inner"
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product, personalization)}
                  className="flex-1 h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  Add to Cart — ${product.price}
                </button>
                <button
                  onClick={() => toggleFavorite(product)}
                  className={cn(
                    "w-16 h-16 border rounded-2xl transition-all flex items-center justify-center shrink-0",
                    isFavorite(product.id)
                      ? "border-red-100 bg-red-50 text-red-500 shadow-inner"
                      : "border-primary/10 text-primary hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isFavorite(product.id) && "fill-current")} />
                </button>
              </div>
              <button className="w-full h-16 bg-white border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all flex items-center justify-center gap-3">
                Buy It Now
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, text: "Fast Shipping" },
                { icon: ShieldCheck, text: "Carbon Neutral" },
                { icon: Clock, text: "Returns in 30d" },
                { icon: Star, text: "Gift Wrap Ready" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-charcoal/60">
                  <item.icon className="w-5 h-5 text-accent/60" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deep Detail Tabs */}
        <section className="mt-24">
          <div className="border-b border-primary/10 flex gap-8 mb-12">
            <button className="pb-4 border-b-2 border-primary font-bold text-primary">Details</button>
            <button className="pb-4 text-charcoal/40 font-medium hover:text-primary transition-colors">Artisan Story</button>
            <button className="pb-4 text-charcoal/40 font-medium hover:text-primary transition-colors">Reviews</button>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="prose prose-stone leading-relaxed text-charcoal/70">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">The Story Behind the Rose</h3>
              <p>
                Inspired by the morning fog over the Cotswolds, Elena Ross spent six months perfecting the "Rose Sand" glaze. Every vase is marked with her signature seal at the base, ensuring you own a genuine piece of artisanal history.
              </p>
              <ul className="mt-8 space-y-4 list-disc pl-5">
                <li>Material: Locally sourced stoneware clay</li>
                <li>Glaze: Semi-organic mineral pigments</li>
                <li>Dimensions: 20cm Height x 12cm Diameter</li>
                <li>Each item is one-of-a-kind</li>
              </ul>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-primary/5 flex items-center justify-center">
              <p className="text-primary italic font-serif text-xl border border-primary/20 p-8 rounded-full border-dashed">
                Crafting Video Placeholder
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
