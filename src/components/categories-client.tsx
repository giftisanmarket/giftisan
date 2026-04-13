"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { 
  Shapes, Gem, PencilLine, 
  Radio, Scissors, Hammer, 
  Heart, Sparkles, ShoppingBag,
  IconNode
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  "Ceramics": Shapes,
  "Jewelry": Gem,
  "Stationery": PencilLine,
  "Vintage": Radio,
  "Textiles": Scissors,
  "Woodwork": Hammer,
  "Wedding": Heart,
  "Personalized": Sparkles,
  "Art & Collectibles": ShoppingBag
};

const colorMap: Record<string, string> = {
  "Ceramics": "bg-blue-50",
  "Jewelry": "bg-amber-50",
  "Stationery": "bg-emerald-50",
  "Vintage": "bg-rose-50",
  "Textiles": "bg-indigo-50",
  "Woodwork": "bg-orange-50",
  "Wedding": "bg-pink-50",
  "Personalized": "bg-purple-50",
  "Art & Collectibles": "bg-stone-50"
};

const descMap: Record<string, string> = {
  "Ceramics": "Hand-thrown pottery and clay treasures.",
  "Jewelry": "Bespoke adornments crafted from gold and gems.",
  "Stationery": "Fine papers and elegant writing instruments.",
  "Vintage": "Timeless finds with a story to tell.",
  "Textiles": "Woven heritage and handcrafted fabrics.",
  "Woodwork": "Natural beauty carved by master hands.",
  "Wedding": "Personalized gifts for your most special day.",
  "Personalized": "One-of-a-kind treasures made just for you.",
  "Art & Collectibles": "Investment-worthy collectibles and fine art."
};

interface CategoryData {
  name: string;
  count: number;
}

export function CategoriesClient({ categories }: { categories: CategoryData[] }) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
              Browse by <span className="serif italic font-normal text-accent">Collection</span>
            </h1>
            <p className="text-xl text-charcoal/60 leading-relaxed font-medium">
              Explore our curated universe of handcrafted treasures. Every category is a doorway to a world of global craftsmanship and unique stories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => {
              const Icon = iconMap[cat.name] || ShoppingBag;
              const color = colorMap[cat.name] || "bg-cream";
              const desc = descMap[cat.name] || "Discover unique handcrafted items.";
              const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={`/category/${slug}`}
                    className="group relative block h-full"
                  >
                    <div className="bg-white rounded-[3rem] p-10 border border-primary/5 shadow-xl shadow-primary/5 transition-all hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 h-full flex flex-col">
                      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-3xl font-heading font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                        {cat.name}
                      </h3>
                      
                      <p className="text-charcoal/60 text-lg leading-relaxed mb-8 flex-1">
                        {desc}
                      </p>
                      
                      <div className="pt-8 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/30">
                          {cat.count} {cat.count === 1 ? 'Treasure' : 'Treasures'}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-cream border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="text-xl">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-cream/30 border-t border-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
            © 2026 Giftisan • Supporting Independent Makers Globally
          </p>
        </div>
      </footer>
    </main>
  );
}
