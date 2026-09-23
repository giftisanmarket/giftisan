"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  X, 
  Filter, 
  ChevronDown, 
  RotateCcw,
  Check,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface SearchClientProps {
  query: string;
  initialProducts: any[];
  dict: any;
}

export function SearchClient({ query, initialProducts, dict }: SearchClientProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const isAr = lang === "ar";

  const { toggleFavorite, isFavorite } = useFavorites();

  // Filter States
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showCustomizableOnly, setShowCustomizableOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "popular">("newest");
  
  // Single active dropdown controller: "sort" | "category" | "price" | "location" | null
  const [openDropdown, setOpenDropdown] = useState<"sort" | "category" | "price" | "location" | null>(null);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        toolbarRef.current && !toolbarRef.current.contains(target) &&
        sortRef.current && !sortRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dynamic list of unique categories from available products
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [initialProducts]);

  // Dynamic list of unique governorates / locations
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    initialProducts.forEach(p => {
      const loc = p.artisan?.location || p.artisan?.pickupCity;
      if (loc && loc !== "Egypt" && loc !== "Artisan Member") {
        locs.add(loc);
      }
    });
    return Array.from(locs);
  }, [initialProducts]);

  // Helper for category label
  const getCategoryLabel = (cat: string) => {
    if (cat === "ALL") return isAr ? "جميع التصنيفات" : "All Categories";
    return dict.common?.[cat.toLowerCase()] || cat;
  };

  // Price Range Definitions
  const priceRanges: Array<{ id: string; label: string; min?: number; max?: number }> = [
    { id: "ALL", label: isAr ? "جميع الأسعار" : "All Prices" },
    { id: "UNDER_250", label: isAr ? "أقل من 250 ج.م" : "Under 250 EGP", min: 0, max: 250 },
    { id: "250_500", label: isAr ? "250 - 500 ج.م" : "250 - 500 EGP", min: 250, max: 500 },
    { id: "500_1000", label: isAr ? "500 - 1000 ج.م" : "500 - 1000 EGP", min: 500, max: 1000 },
    { id: "OVER_1000", label: isAr ? "أكثر من 1000 ج.م" : "Over 1000 EGP", min: 1000, max: Infinity },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(p => {
        // 1. Verified Artisan
        if (showVerifiedOnly && !p.artisan?.isVerified) return false;

        // 2. Customizable / Bespoke
        if (showCustomizableOnly && !p.canPersonalize && !p.requiresClientImage) return false;

        // 3. Category Filter
        if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;

        // 4. Governorate / Location Filter
        if (selectedGovernorate !== "ALL") {
          const loc = (p.artisan?.location || p.artisan?.pickupCity || "").toLowerCase();
          if (!loc.includes(selectedGovernorate.toLowerCase())) return false;
        }

        // 5. Price Range Filter
        if (selectedPriceRange !== "ALL") {
          const range = priceRanges.find(r => r.id === selectedPriceRange);
          if (range && range.min !== undefined && range.max !== undefined) {
            if (p.price < range.min || p.price > range.max) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    initialProducts, 
    showVerifiedOnly, 
    showCustomizableOnly, 
    selectedCategory, 
    selectedGovernorate, 
    selectedPriceRange, 
    sortBy
  ]);

  const activeFiltersCount = 
    (showVerifiedOnly ? 1 : 0) +
    (showCustomizableOnly ? 1 : 0) +
    (selectedCategory !== "ALL" ? 1 : 0) +
    (selectedGovernorate !== "ALL" ? 1 : 0) +
    (selectedPriceRange !== "ALL" ? 1 : 0);

  const resetAllFilters = () => {
    setShowVerifiedOnly(false);
    setShowCustomizableOnly(false);
    setSelectedCategory("ALL");
    setSelectedGovernorate("ALL");
    setSelectedPriceRange("ALL");
    setSortBy("newest");
    setOpenDropdown(null);
  };

  const sortOptions = [
    { label: dict.home.newest_arrivals, value: "newest" },
    { label: isAr ? "الأكثر شعبية" : "Most Popular", value: "popular" },
    { label: dict.home.price_low_high, value: "price-low" },
    { label: dict.home.price_high_low, value: "price-high" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 md:gap-8 px-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary flex flex-wrap items-center gap-x-3 gap-y-1">
            {query ? (
              <>{dict.home.search_results_for} <span className="text-accent italic serif brightness-90">"{query}"</span></>
            ) : (
              <>{(dict.home.explore_title_base || dict.home.explore_collection_title?.split(' ')[0])} <span className="text-accent italic serif brightness-90">{(dict.home.explore_title_accent || dict.home.explore_collection_title?.split(' ').slice(1).join(' '))}</span></>
            )}
          </h1>
          <p className="text-charcoal/40 text-xs md:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {dict.home.found_treasures.replace('{count}', filteredProducts.length.toString())}
          </p>
        </div>

        {/* Sort Selector Button */}
        <div ref={sortRef} className="relative w-full md:w-auto z-40">
          <button 
            type="button"
            onClick={() => setOpenDropdown(prev => prev === "sort" ? null : "sort")}
            className="w-full md:w-auto flex items-center justify-between md:justify-center gap-3 px-5 h-11 bg-white border border-primary/10 rounded-full text-xs font-bold text-primary hover:border-primary/20 transition-all active:scale-95 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent" /> 
              <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-primary/40 transition-transform duration-200", openDropdown === "sort" && "rotate-180")} />
          </button>

          <AnimatePresence>
            {openDropdown === "sort" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute end-0 top-full mt-2 w-56 bg-white border border-primary/10 shadow-2xl rounded-2xl p-2 z-50"
              >
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value as any);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full text-start px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                      sortBy === option.value ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                    )}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Faceted Filters Toolbar */}
      <div 
        ref={toolbarRef}
        className="bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-primary/5 shadow-xl shadow-primary/5 mb-8 relative z-30 overflow-visible"
      >
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          
          {/* 1. Verified Filter Toggle */}
          <button 
            type="button"
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={cn(
              "px-4 h-10 border rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shrink-0",
              showVerifiedOnly 
                ? "bg-accent text-white border-accent shadow-md shadow-accent/20" 
                : "bg-cream/40 border-primary/5 text-primary/70 hover:bg-cream hover:text-primary"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> 
            <span>{dict.home.verified_only}</span>
          </button>

          {/* 2. Customizable / Bespoke Toggle */}
          <button 
            type="button"
            onClick={() => setShowCustomizableOnly(!showCustomizableOnly)}
            className={cn(
              "px-4 h-10 border rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shrink-0",
              showCustomizableOnly 
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                : "bg-cream/40 border-primary/5 text-primary/70 hover:bg-cream hover:text-primary"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-light" /> 
            <span>{isAr ? "قابل للتخصيص / حفر" : "Customizable"}</span>
          </button>

          {/* 3. Category Filter Dropdown */}
          {availableCategories.length > 0 && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpenDropdown(prev => prev === "category" ? null : "category")}
                className={cn(
                  "px-4 h-10 border rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95",
                  selectedCategory !== "ALL"
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-cream/40 border-primary/5 text-primary/70 hover:bg-cream"
                )}
              >
                <span>
                  {selectedCategory === "ALL" 
                    ? (isAr ? "التصنيف" : "Category") 
                    : getCategoryLabel(selectedCategory)}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", openDropdown === "category" && "rotate-180")} />
              </button>

              <AnimatePresence>
                {openDropdown === "category" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute start-0 top-full mt-2 w-56 bg-white border border-primary/10 shadow-2xl rounded-2xl p-2 z-50 max-h-64 overflow-y-auto"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                        selectedCategory === "ALL" ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                      )}
                    >
                      <span>{isAr ? "جميع التصنيفات" : "All Categories"}</span>
                      {selectedCategory === "ALL" && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                    {availableCategories.map(cat => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                            isSelected ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                          )}
                        >
                          <span className="truncate">{getCategoryLabel(cat)}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ms-2" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 4. Price Range Filter Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => prev === "price" ? null : "price")}
              className={cn(
                "px-4 h-10 border rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95",
                selectedPriceRange !== "ALL"
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-cream/40 border-primary/5 text-primary/70 hover:bg-cream"
              )}
            >
              <span>{priceRanges.find(r => r.id === selectedPriceRange)?.label || (isAr ? "السعر" : "Price")}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", openDropdown === "price" && "rotate-180")} />
            </button>

            <AnimatePresence>
              {openDropdown === "price" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute start-0 top-full mt-2 w-52 bg-white border border-primary/10 shadow-2xl rounded-2xl p-2 z-50"
                >
                  {priceRanges.map(range => {
                    const isSelected = selectedPriceRange === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => {
                          setSelectedPriceRange(range.id);
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          "w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                          isSelected ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                        )}
                      >
                        <span>{range.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ms-2" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Location / Governorate Filter Dropdown */}
          {availableLocations.length > 0 && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpenDropdown(prev => prev === "location" ? null : "location")}
                className={cn(
                  "px-4 h-10 border rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95",
                  selectedGovernorate !== "ALL"
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-cream/40 border-primary/5 text-primary/70 hover:bg-cream"
                )}
              >
                <MapPin className="w-3.5 h-3.5 opacity-70" />
                <span>{selectedGovernorate === "ALL" ? (isAr ? "المحافظة / الورشة" : "Location") : selectedGovernorate}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", openDropdown === "location" && "rotate-180")} />
              </button>

              <AnimatePresence>
                {openDropdown === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute start-0 top-full mt-2 w-56 bg-white border border-primary/10 shadow-2xl rounded-2xl p-2 z-50 max-h-64 overflow-y-auto"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGovernorate("ALL");
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                        selectedGovernorate === "ALL" ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                      )}
                    >
                      <span>{isAr ? "جميع المحافظات" : "All Locations"}</span>
                      {selectedGovernorate === "ALL" && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                    {availableLocations.map(loc => {
                      const isSelected = selectedGovernorate === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setSelectedGovernorate(loc);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                            isSelected ? "bg-primary text-white" : "text-charcoal/70 hover:bg-cream hover:text-primary"
                          )}
                        >
                          <span className="truncate">{loc}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ms-2" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Reset Filters Shortcut */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 h-10 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-1.5 ms-auto shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? `مسح الفلاتر (${activeFiltersCount})` : `Clear (${activeFiltersCount})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 md:py-28 text-center max-w-md mx-auto space-y-6 bg-white/60 rounded-3xl border border-primary/5 p-8 shadow-xl">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-primary/20" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              {dict.home.no_treasures_found}
            </h2>
            <p className="text-charcoal/50 text-xs md:text-sm leading-relaxed">
              {isAr ? "لم نجد قطع تطابق الفلاتر المحددة. جرب إزالة بعض الفلاتر لعرض المزيد من الإبداعات." : dict.home.no_treasures_desc}
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-light transition-all shadow-md active:scale-95"
            >
              {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, idx) => {
              const artisanLocation = p.artisan?.location || p.artisan?.pickupCity;
              const hasReviews = p.reviews && p.reviews.length > 0;
              const avgRating = hasReviews 
                ? (p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length).toFixed(1)
                : null;

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                >
                  <Link href={`/products/${p.slug || p.id}`} className="group block h-full">
                    <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 shadow-sm hover:shadow-md transition-shadow border border-primary/5 bg-white">
                      <Image 
                        src={p.images[0]} 
                        alt={p.name} 
                        fill 
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(p);
                        }}
                        className={cn(
                          "absolute top-3 end-3 md:top-4 md:end-4 p-2 md:p-3 rounded-full transition-all active:scale-75 shadow-lg z-10",
                          isFavorite(p.id)
                            ? "bg-red-50 text-red-500 opacity-100"
                            : "bg-white/90 backdrop-blur text-primary opacity-90 hover:opacity-100 hover:bg-white"
                        )}
                      >
                        <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isFavorite(p.id) && "fill-current")} />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1 px-1">
                      <h3 className="text-sm md:text-lg font-heading font-bold text-primary leading-tight group-hover:text-accent transition-colors truncate">
                        {p.name}
                      </h3>

                      <div className="flex items-center justify-between pt-0.5">
                        <p className="text-xs md:text-base font-heading font-bold text-primary">
                          {dict.product.currency} {p.price}
                        </p>
                        {avgRating && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-charcoal/60">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{avgRating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Discovery Outreach Banner */}
      <section className="py-16 md:py-24 border-t border-primary/5 mt-16 md:mt-24 bg-cream text-center relative overflow-hidden -mx-4 md:-mx-12 px-6">
        <div className="container mx-auto max-w-2xl space-y-6 md:space-y-8 relative z-10">
          <h2 className="text-2xl md:text-5xl font-heading font-bold text-primary">{dict.home.not_found_title}</h2>
          <p className="text-charcoal/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            {dict.home.custom_commissions_desc}
          </p>
          <Link href="/artisans">
            <button className="h-12 md:h-14 px-8 md:px-12 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 group active:scale-95 duration-200 text-xs md:text-sm">
              {dict.home.explore_custom_makers}
              <span className="inline-block ms-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </section>
    </div>
  );
}
