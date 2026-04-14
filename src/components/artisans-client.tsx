"use client";

import { Navbar } from "@/components/navbar";
import { BespokeImage } from "@/components/bespoke-image";
import Link from "next/link";
import { ArrowRight, MapPin, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ArtisansClientProps {
  artisans: any[];
}

export function ArtisansClient({ artisans }: ArtisansClientProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-4 h-4" /> The Master Registry
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary">
            Meet the <span className="serif italic font-normal text-accent">Masters</span>
          </h1>
          <p className="text-charcoal/40 max-w-2xl mx-auto text-lg">
            Discover the independent studios and skilled artisans behind the world's most unique handcrafted treasures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {artisans.map((artisan, idx) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                href={`/artisans/${artisan.slug || artisan.user.name.toLowerCase().replace(/ /g, "-")}`}
                className="group block h-full"
              >
                <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-2xl shadow-primary/5 transition-all hover:shadow-accent/10 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="relative w-28 h-28 mb-8">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <BespokeImage src={artisan.avatar} alt={artisan.studioName || artisan.user.name} fill className="object-cover" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                      {artisan.studioName || artisan.user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-[10px] mb-6">
                      <MapPin className="w-3 h-3" />
                      {artisan.location}
                    </div>
                    
                    <p className="text-charcoal/60 leading-relaxed mb-10 flex-1 italic line-clamp-3">
                      "{artisan.bio}"
                    </p>
                    
                    <div className="pt-8 border-t border-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Treasures</span>
                          <span className="text-sm font-bold text-primary flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3 text-accent" />
                            {artisan.products.length}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative background element */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
