"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { 
  Sparkles, ArrowRight, Grid, Gift, Gem, Shapes, Hammer, 
  Scissors, Shirt, Wand2, Brush, History, PencilLine,
  Package, Utensils, Flame, Lightbulb, Briefcase, Heart, ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface CategoryData {
  name: string;
  count: number;
}

const descMap: Record<string, string> = {
  "Gift Boxes & Sets": "Curated collections and beautifully packaged gift boxes ready to surprise.",
  "Jewelry": "Bespoke adornments crafted from gold, silver, and precious stones.",
  "Ceramics": "Hand-thrown pottery, glazed mugs, and clay artisan products.",
  "Woodwork": "Natural mahogany and olive wood carved by master hands.",
  "Textiles": "Woven heritage rugs, embroidered cushions, and handcrafted fabrics.",
  "Fashion": "Artisan wearables, handmade leather bags, and unique accessories.",
  "Art & Collectibles": "Investment-worthy collectibles, fine paintings, and wall decor.",
  "Personalized": "One-of-a-kind products engraved and tailored just for you.",
  "Wedding": "Handmade wedding favors and personalized keepsakes for special days.",
  "Vintage": "Timeless finds and restored antiques with a unique story to tell.",
  "Stationery": "Fine papers, calligraphy sets, and hand-bound journals.",
  "Leatherwork": "Hand-stitched leather goods, bespoke bags, and accessories.",
  "Culinary Arts": "Artisan flavors, handmade preserves, and traditional delicacies.",
  "Beauty & Apothecary": "Natural skincare remedies and handcrafted bath essentials.",
  "Metalwork": "Traditional hand-hammered brass, copper, and decorative ironware.",
  "Glasswork": "Hand-blown glassware and traditional stained glass art.",
  "Basketry": "Palm frond weaving and natural fiber baskets."
};

const iconMap: Record<string, any> = {
  "Ceramics": Shapes,
  "Jewelry": Gem,
  "Gift Boxes & Sets": Package,
  "Stationery": PencilLine,
  "Vintage": History,
  "Textiles": Scissors,
  "Woodwork": Hammer,
  "Leatherwork": Briefcase,
  "Culinary Arts": Utensils,
  "Beauty & Apothecary": Sparkles,
  "Metalwork": Flame,
  "Glasswork": Lightbulb,
  "Basketry": Grid,
  "Fashion": Shirt,
  "Wedding": Heart,
  "Personalized": Wand2,
  "Art & Collectibles": Brush,
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
  "Stationery": "art",
  "Leatherwork": "wearables",
  "Culinary Arts": "gifting",
  "Beauty & Apothecary": "gifting",
  "Metalwork": "home",
  "Glasswork": "home",
  "Basketry": "home"
};

export function CategoriesClient({ categories, dict }: { categories: CategoryData[], dict: any }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Priority sort: non-zero categories first, then descending by product count
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      return b.count - a.count;
    });
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return sortedCategories;
    return sortedCategories.filter(cat => categoryGroupMap[cat.name] === activeFilter);
  }, [sortedCategories, activeFilter]);

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
              <span>{dict.common.curated_collections || "Curated Artisan Collections"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary mb-4 leading-tight">
              {(dict?.home?.browse_categories_base || dict?.home?.browse_categories?.split(' ')[0] || "Browse")}{' '}
              <span className="serif italic font-normal text-accent">
                {(dict?.home?.browse_categories_accent || (dict?.home?.browse_categories?.includes(' ') ? dict?.home?.browse_categories?.split(' ').slice(1).join(' ') : 'الفئات'))}
              </span>
            </h1>
            <p className="text-base md:text-xl text-charcoal/60 leading-relaxed font-medium">
              {dict.home.category_desc}
            </p>
          </motion.div>

          {/* Quick Category Group Filters */}
          <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-primary/5">
            {[
              { id: "all", label: dict.common.all_collections || "All Collections" },
              { id: "gifting", label: dict.common.filter_gifting || "Gift Sets & Personalized" },
              { id: "home", label: dict.common.filter_home || "Home & Craft Decor" },
              { id: "wearables", label: dict.common.filter_wearables || "Jewelry & Wearables" },
              { id: "art", label: dict.common.filter_art || "Fine Art & Collectibles" },
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

          {/* Clean Icon Card Grid (3 Columns on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {filteredCategories.map((cat, idx) => {
              const Icon = iconMap[cat.name] || ShoppingBag;
              const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
              const categoryTitle = dict.common.categories_list?.[slug] || cat.name;
              const desc = dict.common[`${slug.replace(/-/g, '_')}_desc`] || dict.common[`${slug}_desc`] || descMap[cat.name] || "Discover unique handcrafted items.";

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link 
                    href={`/category/${slug}`}
                    className="group relative block h-full"
                  >
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-primary/5 shadow-xl shadow-primary/5 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-primary mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                          <Icon className="w-7 h-7" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                          {categoryTitle}
                        </h3>

                        <p className="text-charcoal/60 text-sm md:text-base leading-relaxed font-medium mb-8">
                          {desc}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-primary/5 flex items-center justify-between mt-auto">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary/40">
                          {(dict.home.items_count || "{count} ITEMS").replace("{count}", cat.count.toString()).toUpperCase()}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-cream border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
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
