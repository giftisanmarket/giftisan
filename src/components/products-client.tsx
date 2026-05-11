"use client";

import { Navbar } from "@/components/navbar";
import { BespokeImage } from "./bespoke-image";
import Link from "next/link";
import { Heart, SlidersHorizontal, ArrowLeft, ArrowUpDown, CheckCircle2, Search, X, Grid, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { useState, useMemo, useRef, useEffect } from "react";

interface ProductsClientProps {
  initialProducts: any[];
  dict: any;
  lang: string;
}

export function ProductsClient({ initialProducts, dict, lang }: ProductsClientProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "popular">("newest");
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);

  // Advanced scroll fade state and tracking for the horizontal categories container
  const [showLeftScrollFade, setShowLeftScrollFade] = useState<boolean>(false);
  const [showRightScrollFade, setShowRightScrollFade] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollFades = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 5) {
      setShowLeftScrollFade(false);
      setShowRightScrollFade(false);
      return;
    }

    const isRtl = lang === "ar";
    if (isRtl) {
      const absScrollLeft = Math.abs(scrollLeft);
      setShowRightScrollFade(absScrollLeft > 5);
      setShowLeftScrollFade(absScrollLeft < maxScroll - 5);
    } else {
      setShowLeftScrollFade(scrollLeft > 5);
      setShowRightScrollFade(scrollLeft < maxScroll - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Run initial check
    updateScrollFades();

    // Set up a ResizeObserver to adapt immediately on layout shift or orientation change
    const resizeObserver = new ResizeObserver(() => {
      updateScrollFades();
    });
    resizeObserver.observe(container);

    container.addEventListener("scroll", updateScrollFades, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("scroll", updateScrollFades);
    };
  }, [initialProducts]);

  // Extract categories dynamically from products to ensure exact alignment with DB and dictionaries
  const dynamicCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.category) {
        categoriesSet.add(p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"));
      }
    });
    return Array.from(categoriesSet);
  }, [initialProducts]);

  // Combine manual or dictionary-defined listings
  const categoriesList = useMemo(() => {
    const rawList = dict.common?.categories_list || {};
    return [
      { id: "all", label: lang === "ar" ? "كل الكنوز" : "All Treasures" },
      ...dynamicCategories.map((catId) => {
        // Fallback to capitalizing the id if not found in translation file
        const label = rawList[catId] || catId.charAt(0).toUpperCase() + catId.slice(1).replace(/-/g, " ");
        return { id: catId, label };
      }),
    ];
  }, [dynamicCategories, dict.common?.categories_list, lang]);

  // High fidelity filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category Filter
        if (selectedCategory !== "all") {
          const productCatId = p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
          if (productCatId !== selectedCategory) return false;
        }

        // Verified Artisan Filter
        if (showVerifiedOnly && !p.artisan?.isVerified) return false;

        // Search Query Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const nameMatch = p.name.toLowerCase().includes(query);
          const descMatch = p.description?.toLowerCase().includes(query);
          const studioMatch = p.artisan?.studioName?.toLowerCase().includes(query);
          const artistNameMatch = p.artisan?.user?.name?.toLowerCase().includes(query);
          if (!nameMatch && !descMatch && !studioMatch && !artistNameMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "popular") {
          // Sort by highest average reviews or review count
          const aReviews = a.reviews?.length || 0;
          const bReviews = b.reviews?.length || 0;
          return bReviews - aReviews;
        }
        // Default: Newest arrivals
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [initialProducts, selectedCategory, showVerifiedOnly, searchQuery, sortBy]);

  const sortOptions = [
    { label: dict.home?.newest_arrivals || "Newest Arrivals", value: "newest" },
    { label: dict.home?.price_low_high || "Price: Low to High", value: "price-low" },
    { label: dict.home?.price_high_low || "Price: High to Low", value: "price-high" },
    { label: lang === "ar" ? "الأكثر تميزاً" : "Most Desired / Popular", value: "popular" },
  ];

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setShowVerifiedOnly(false);
    setSortBy("newest");
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      {/* Hero Header */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              {dict.home?.back_to_collections || "Back to Home"}
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-accent">
                {lang === "ar" ? "السوق المركزي الكامل" : "Central Artisan Marketplace"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4">
              {dict.common?.explore || "Explore Treasures"}
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
              {lang === "ar"
                ? "تصفح واقتنِ تحفاً يدوية فريدة مصممة بشغف وروح من قبل أمهر المصممين والحرفيين المستقلين في مصر."
                : "Browse and collect beautiful, high-fidelity handcrafted treasures, made with soul and historical heritage by Egypt's finest independent creators."}
            </p>
          </motion.div>
        </div>
        {/* Decorative Background Circles */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Toolbar & Filters Bar */}
      <div className="sticky top-[72px] md:top-[124px] z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "البحث داخل المعرض..." : "Filter inside the gallery..."}
                className="w-full h-11 ps-11 pe-10 bg-cream/30 border border-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-primary font-medium text-xs md:text-sm placeholder:text-primary/40 transition-all"
              />
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Actions (Sort, Verified toggle) */}
            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
              {/* Artisan badge filter toggle */}
              <button
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={cn(
                  "flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 h-11 border rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-90",
                  showVerifiedOnly
                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                    : "bg-white border-primary/10 text-primary hover:bg-primary/5"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{dict.home?.artisans_tab || "Verified Studios"}</span>
              </button>

              {/* Sorting Filter */}
              <div className="relative flex-1 lg:flex-initial">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 h-11 bg-white border border-primary/10 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-90"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-primary/60" />
                  <span>{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                </button>

                <AnimatePresence>
                  {showSortOptions && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSortOptions(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute end-0 top-full mt-2 w-56 bg-white border border-primary/5 shadow-2xl rounded-2xl p-2 z-50 overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as any);
                              setShowSortOptions(false);
                            }}
                            className={cn(
                              "w-full text-start px-4 py-3 rounded-xl text-xs font-bold transition-all",
                              sortBy === option.value
                                ? "bg-primary/5 text-primary"
                                : "text-charcoal/60 hover:bg-cream hover:text-primary"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Dynamic Horizontally-Scrollable Categories Bar */}
          <div className="border-t border-primary/5 pt-3">
            <div 
              className="scroll-fade-mask md:mask-none"
              style={{
                "--mask-left": showLeftScrollFade ? "transparent" : "black",
                "--mask-right": showRightScrollFade ? "transparent" : "black",
              } as React.CSSProperties}
            >
              <div 
                ref={scrollContainerRef}
                onScroll={updateScrollFades}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 -mx-4 px-8 md:mx-0 md:px-0"
              >
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all shrink-0 active:scale-95",
                      selectedCategory === cat.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-cream text-primary/70 hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treasures Grid */}
      <section className="py-12 container mx-auto px-4 md:px-6">
        
        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center px-1">
          <p className="text-[10px] md:text-sm font-medium text-charcoal/60 uppercase tracking-widest">
            {lang === "ar" ? "الكنوز المتوفرة: " : "Treasures available: "}
            <span className="text-primary font-bold">{filteredProducts.length}</span>
          </p>
          {(selectedCategory !== "all" || searchQuery || showVerifiedOnly) && (
            <button
              onClick={resetFilters}
              className="text-[10px] md:text-xs font-black text-accent uppercase tracking-widest hover:underline active:scale-95"
            >
              {lang === "ar" ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
              <SlidersHorizontal className="w-10 h-10" />
            </div>
            <div className="space-y-3 px-4">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                {lang === "ar" ? "لم نجد ما تبحث عنه..." : "No treasures match your criteria..."}
              </h2>
              <p className="text-charcoal/60 max-w-md mx-auto text-xs md:text-base leading-relaxed">
                {lang === "ar"
                  ? "جرب إزالة أو تعديل عوامل التصفية لعرض مجموعة الكنوز الكاملة المصنوعة يدوياً."
                  : "Try adjusting your filters, modifying keywords, or searching for other authentic crafts."}
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 h-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
              >
                {lang === "ar" ? "عرض جميع المجموعات" : "View All Collections"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
                >
                  <Link href={`/products/${product.slug || product.id}`} className="group block">
                    <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-4 shadow-xl border border-primary/5 bg-white">
                      <BespokeImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      
                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        className={cn(
                          "absolute top-3 end-3 md:top-5 md:end-5 p-2 md:p-3.5 rounded-full transition-all shadow-md active:scale-75",
                          isFavorite(product.id)
                            ? "bg-red-50 text-red-500 opacity-100"
                            : "bg-white/90 backdrop-blur text-primary xl:opacity-0 xl:group-hover:opacity-100 opacity-100 hover:bg-white"
                        )}
                      >
                        <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isFavorite(product.id) && "fill-current")} />
                      </button>

                      {/* Eco-label Badge */}
                      {product.badge && (
                        <div className="absolute bottom-3 start-3 md:bottom-5 md:start-5 px-3 py-1 bg-white/95 backdrop-blur text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 px-1">
                      <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-[0.2em] leading-none mb-1 truncate">
                        {product.artisan?.studioName || "Artisan Made"}
                      </p>
                      <h3 className="text-xs md:text-xl font-heading font-bold text-primary group-hover:text-accent transition-colors leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs md:text-lg font-heading font-black text-primary">
                          {dict.product?.currency || "EGP"} {product.price}
                        </p>
                        <div className="h-3 w-px bg-primary/10" />
                        <span className="text-[8px] md:text-[10px] font-bold text-charcoal/40 uppercase tracking-widest truncate">
                          {dict.common?.categories_list?.[product.category?.toLowerCase()?.replace(/ & /g, "-")?.replace(/ /g, "-")] || product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Discovery Bottom Callout */}
      <section className="py-20 md:py-32 border-t border-primary/5 mt-16 bg-cream text-center relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-2xl space-y-6 md:space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">
            {dict.home?.not_found_title || "Not what you are looking for?"}
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg leading-relaxed">
            {dict.home?.custom_commissions_desc || "Our master makers thrive on custom orders. Pitch your dream and customize a unique treasure today."}
          </p>
          <Link href="/artisans">
            <button className="h-14 md:h-16 px-8 md:px-12 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 group text-sm md:text-base active:scale-95 duration-200">
              {dict.home?.explore_custom_makers || "Explore Makers"}
              <span className="inline-block ms-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>
    </main>
  );
}
