"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, ArrowRight, Grid, Gift, Gem, Shapes, Hammer, 
  Scissors, Shirt, Wand2, Brush, History, PencilLine
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const categoryImageMap: Record<string, string> = {
  "Gift Boxes & Sets": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
  "Jewelry": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  "Ceramics": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
  "Woodwork": "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=800&auto=format&fit=crop",
  "Textiles": "https://images.unsplash.com/photo-1606744888344-49423b812d02?q=80&w=800&auto=format&fit=crop",
  "Fashion": "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
  "Art & Collectibles": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
  "Personalized": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
  "Wedding": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  "Vintage": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  "Stationery": "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop",
};

const descMap: Record<string, string> = {
  "Gift Boxes & Sets": "Curated collections and beautifully packaged gift boxes ready to surprise.",
  "Jewelry": "Bespoke adornments crafted from gold, silver, and precious stones.",
  "Ceramics": "Hand-thrown pottery, glazed mugs, and clay artisan treasures.",
  "Woodwork": "Natural mahogany and olive wood carved by master hands.",
  "Textiles": "Woven heritage rugs, embroidered cushions, and handcrafted fabrics.",
  "Fashion": "Artisan wearables, handmade leather bags, and unique accessories.",
  "Art & Collectibles": "Investment-worthy collectibles, fine paintings, and wall decor.",
  "Personalized": "One-of-a-kind treasures engraved and tailored just for you.",
  "Wedding": "Handmade wedding favors and personalized keepsakes for special days.",
  "Vintage": "Timeless finds and restored antiques with a unique story to tell.",
  "Stationery": "Fine papers, calligraphy sets, and hand-bound journals."
};

const categoryGroupMap: Record<string, string> = {
  "Gift Boxes & Sets": "gifting",
  "Personalized": "gifting",
  "Wedding": "gifting",
  "Jewelry": "wearables",
  "Fashion": "wearables",
  "Ceramics": "home",
  "Woodwork": "home",
  "Textiles": "home",
  "Art & Collectibles": "art",
  "Vintage": "art",
  "Stationery": "art"
};

interface CategoryData {
  name: string;
  count: number;
}

export function CategoriesClient({ categories, dict }: { categories: CategoryData[], dict: any }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Priority order for sorting categories smartly
  const priorityOrder = [
    "Gift Boxes & Sets",
    "Jewelry",
    "Ceramics",
    "Woodwork",
    "Fashion",
    "Textiles",
    "Art & Collectibles",
    "Personalized",
    "Wedding",
    "Vintage",
    "Stationery"
  ];

  // Smart sorted category list
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const idxA = priorityOrder.indexOf(a.name);
      const idxB = priorityOrder.indexOf(b.name);

      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count;
    });
  }, [categories]);

  // Filtered categories based on selected tab
  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return sortedCategories;
    return sortedCategories.filter(cat => categoryGroupMap[cat.name] === activeFilter);
  }, [sortedCategories, activeFilter]);

  const spotlightCategories = useMemo(() => {
    return sortedCategories.slice(0, 2);
  }, [sortedCategories]);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      
      <section className="pt-24 md:pt-36 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Artisan Collections</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary mb-4 leading-tight">
              {dict.home.browse_categories.split(' ')[0]} <span className="serif italic font-normal text-accent">{dict.home.browse_categories.split(' ')[1]}</span>
            </h1>
            <p className="text-base md:text-xl text-charcoal/60 leading-relaxed font-medium">
              {dict.home.category_desc}
            </p>
          </motion.div>

          {/* Quick Category Group Filters */}
          <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-primary/5">
            {[
              { id: "all", label: "All Collections" },
              { id: "gifting", label: "Gift Sets & Personalized" },
              { id: "home", label: "Home & Craft Decor" },
              { id: "wearables", label: "Jewelry & Wearables" },
              { id: "art", label: "Fine Art & Collectibles" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold transition-all border",
                  activeFilter === tab.id
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                    : "bg-white text-primary/70 border-primary/10 hover:border-accent/40 hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spotlight Hero Cards (Top 2 Categories) */}
          {activeFilter === "all" && spotlightCategories.length >= 2 && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {spotlightCategories.map((cat, idx) => {
                const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                const imageUrl = categoryImageMap[cat.name] || categoryImageMap["Gift Boxes & Sets"];
                const desc = descMap[cat.name] || "Discover unique handcrafted items.";

                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={`/category/${slug}`}
                      className="group relative block h-80 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10"
                    >
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                      <div className="absolute top-6 start-6 z-10 px-3.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-sm">
                        {cat.count} {cat.count === 1 ? "Treasure" : "Treasures"}
                      </div>

                      <div className="absolute bottom-8 inset-x-8 z-10 text-white space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white group-hover:text-accent-light transition-colors">
                            {dict.common.categories_list?.[slug] || cat.name}
                          </h3>
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-accent group-hover:scale-110 transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                        <p className="text-white/80 text-xs md:text-sm line-clamp-2 font-medium">
                          {dict.common[`${slug.replace(/-/g, '_')}_desc`] || desc}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Full Visual Photography Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCategories.map((cat, idx) => {
              const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
              const imageUrl = categoryImageMap[cat.name] || categoryImageMap["Gift Boxes & Sets"];
              const desc = descMap[cat.name] || "Discover unique handcrafted items.";

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/category/${slug}`}
                    className="group relative block h-full bg-white rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 flex flex-col"
                  >
                    {/* Visual Cover Photo */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                      
                      <div className="absolute top-4 start-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                        {cat.count} {cat.count === 1 ? "Item" : "Items"}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                          {dict.common.categories_list?.[slug] || cat.name}
                        </h3>
                        <p className="text-charcoal/60 text-xs md:text-sm leading-relaxed font-medium mb-6 line-clamp-2">
                          {dict.common[`${slug.replace(/-/g, '_')}_desc`] || desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <div className="w-9 h-9 rounded-full bg-cream border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ArrowRight className="w-4 h-4" />
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
            {dict.home.rights_reserved}
          </p>
        </div>
      </footer>
    </main>
  );
}
