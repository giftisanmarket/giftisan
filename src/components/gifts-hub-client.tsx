"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Star,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Gift,
  Package,
  X,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { BespokeImage } from "@/components/bespoke-image";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

export interface GiftsHubClientProps {
  initialProducts: any[];
  dict: any;
}

type RecipientType = "all" | "her" | "him" | "kids";

export function GiftsHubClient({ initialProducts, dict }: GiftsHubClientProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const isAr = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");
  const currency = dict?.product?.currency || "EGP";
  const hubDict = dict?.gifts_hub || {};

  // Filter States
  const [recipient, setRecipient] = useState<RecipientType>("all");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showPersonalizedOnly, setShowPersonalizedOnly] = useState(false);
  const [showSetsOnly, setShowSetsOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high">("popular");
  const [openDropdown, setOpenDropdown] = useState<"price" | "sort" | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [stickyTop, setStickyTop] = useState<number | null>(null);

  // Measure exact bottom of sticky navbar to ensure flawless alignment without overlap
  useEffect(() => {
    const updateStickyTop = () => {
      const navContainer = document.querySelector("nav")?.closest(".sticky") as HTMLElement;
      if (navContainer) {
        setStickyTop(navContainer.offsetHeight);
      }
    };

    updateStickyTop();
    window.addEventListener("resize", updateStickyTop);

    let observer: ResizeObserver | null = null;
    const navContainer = document.querySelector("nav")?.closest(".sticky");
    if (navContainer && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateStickyTop);
      observer.observe(navContainer);
    }

    return () => {
      window.removeEventListener("resize", updateStickyTop);
      observer?.disconnect();
    };
  }, []);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileDrawerOpen]);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = Math.abs(container.scrollLeft);
    const itemWidth = container.firstElementChild?.clientWidth || 1;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveSlide(Math.min(Math.max(index, 0), 2));
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const items = carouselRef.current.children;
    if (items[index]) {
      (items[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveSlide(index);
    }
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const priceRanges = [
    { id: "ALL", label: isAr ? "جميع الأسعار" : "All Prices" },
    { id: "UNDER_250", label: hubDict.gifts_under_250 || (isAr ? "أقل من 250 ج.م" : `Under 250 ${currency}`), min: 0, max: 250 },
    { id: "UNDER_500", label: hubDict.gifts_under_500 || (isAr ? "أقل من 500 ج.م" : `Under 500 ${currency}`), min: 0, max: 500 },
    { id: "UNDER_1000", label: hubDict.gifts_under_1000 || (isAr ? "أقل من 1,000 ج.م" : `Under 1,000 ${currency}`), min: 0, max: 1000 },
    { id: "OVER_1000", label: isAr ? "أكثر من 1,000 ج.م" : `Over 1,000 ${currency}`, min: 1000, max: Infinity },
  ];

  const sortOptions = [
    { label: isAr ? "الأكثر شعبية" : "Most Popular", value: "popular" },
    { label: dict.home?.newest_arrivals || (isAr ? "وصل حديثاً" : "Newest Arrivals"), value: "newest" },
    { label: dict.home?.price_low_high || (isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"), value: "price-low" },
    { label: dict.home?.price_high_low || (isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"), value: "price-high" },
  ];

  const resetAllFilters = () => {
    setRecipient("all");
    setShowVerifiedOnly(false);
    setShowPersonalizedOnly(false);
    setShowSetsOnly(false);
    setSelectedPriceRange("ALL");
    setSortBy("popular");
    setOpenDropdown(null);
  };

  const activeFiltersCount =
    (recipient !== "all" ? 1 : 0) +
    (showVerifiedOnly ? 1 : 0) +
    (showPersonalizedOnly ? 1 : 0) +
    (showSetsOnly ? 1 : 0) +
    (selectedPriceRange !== "ALL" ? 1 : 0);

  // Recipient Card Definitions
  const recipientCards = [
    {
      id: "her" as RecipientType,
      title: hubDict.for_her_title || (isAr ? "هدايا لها" : "Gifts for Her"),
      desc: hubDict.for_her_desc || (isAr ? "فاجئها بهدية استثنائية تُبهج يومها وأيامها القادمة." : "Make her day, week, month, and year."),
      image: "/images/gifts/gifts-for-her.jpg",
      alt: isAr ? "هدايا لها - شموع وعطور ومجوهرات حرفية" : "Gifts for Her - artisanal scented candles and jewelry",
    },
    {
      id: "him" as RecipientType,
      title: hubDict.for_him_title || (isAr ? "هدايا له" : "Gifts for Him"),
      desc: hubDict.for_him_desc || (isAr ? "صعب الاختيار له؟ لدينا كل ما يناسب ذوقه بحرفية وفخامة." : "Hard to shop for? Not on our watch."),
      image: "/images/gifts/gifts-for-him.jpg",
      alt: isAr ? "هدايا له - إكسسوارات جلدية وخشبية" : "Gifts for Him - handcrafted leather and woodwork accessories",
    },
    {
      id: "kids" as RecipientType,
      title: hubDict.for_kids_title || (isAr ? "هدايا للأطفال" : "Gifts for Kids"),
      desc: hubDict.for_kids_desc || (isAr ? "ألعاب ومصنوعات خشبية وكروشيه تشعل خيالهم ومرحهم." : "Imaginative and fun—just like them."),
      image: "/images/gifts/gifts-for-kids.jpg",
      alt: isAr ? "هدايا للأطفال - ألعاب ومجسمات يدوية" : "Gifts for Kids - wooden blocks and plush toys",
    },
  ];

  // Helper function for Recipient Matching
  const matchesRecipient = (product: any, target: RecipientType): boolean => {
    if (target === "all") return true;

    const cat = (product.category || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const tags = Array.isArray(product.tags) ? product.tags.map((t: string) => t.toLowerCase()) : [];
    const textCorpus = `${cat} ${name} ${tags.join(" ")}`;

    if (target === "her") {
      const herKeywords = [
        "bag", "tote", "flower", "rose", "pearl", "necklace", "bracelet", "earring", "jewelry",
        "clutch", "scarf", "dress", "beauty", "apothecary", "bath", "candle", "trinket", "dish",
        "شنطة", "ورد", "بوكيه", "اسورة", "سلسلة", "حلق", "مجوهرات", "توت", "كروشيه", "مراءه", "مرآة",
        "بينك", "زهور", "عروس", "خطوبة", "حريمي", "ستات", "مكياج", "كوستر", "فيونكه", "طرحة"
      ];
      const herCats = ["jewelry", "beauty-apothecary", "bath-and-beauty", "bags-and-purses", "textiles", "wedding"];
      return herCats.some(c => cat.includes(c)) || herKeywords.some(kw => textCorpus.includes(kw));
    }

    if (target === "him") {
      const himKeywords = [
        "leather", "wallet", "card holder", "laptop", "sleeve", "wood", "desk", "stand", "mug",
        "watch", "tie", "belt", "cufflink", "gadget", "keychain", "grooming",
        "اباجورة", "استاند", "محفظة", "جلد", "خشب", "مقلمة", "حامل", "كارت", "لابتوب", "ميدالية",
        "رجالي", "مكتب", "كونكريت"
      ];
      const himCats = ["woodwork", "leatherwork", "accessories", "gadgets", "electronics-and-accessories"];
      return himCats.some(c => cat.includes(c)) || himKeywords.some(kw => textCorpus.includes(kw));
    }

    if (target === "kids") {
      const kidsKeywords = [
        "doll", "toy", "octopus", "puzzle", "voodoo", "kid", "baby", "child", "game", "plush",
        "beanie", "cat", "unicorn", "crochet doll", "blocks",
        "دميه", "دمية", "لعبة", "اطفال", "طفل", "طفلة", "بيبي", "يونيكورن", "كيرلي", "ميدالية",
        "أشكال", "كتكوت", "ألعاب", "تخرج"
      ];
      const kidsCats = ["toys", "toys-games", "kids-baby", "baby-and-child-care"];
      return kidsCats.some(c => cat.includes(c)) || kidsKeywords.some(kw => textCorpus.includes(kw));
    }

    return true;
  };

  const handleCardClick = (target: RecipientType) => {
    setRecipient(prev => (prev === target ? "all" : target));
    // Smooth scroll down to products grid
    if (productsGridRef.current) {
      productsGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter(p => {
        // Recipient filter
        if (recipient !== "all" && !matchesRecipient(p, recipient)) {
          return false;
        }

        // Verified Artisan filter
        if (showVerifiedOnly && !p.artisan?.isVerified) {
          return false;
        }

        // Personalized filter
        if (showPersonalizedOnly) {
          const isPersonalized =
            p.canPersonalize ||
            p.requiresClientImage ||
            (p.category || "").toLowerCase().includes("personalized") ||
            (p.name || "").includes("إسم") ||
            (p.name || "").includes("اسم") ||
            (p.name || "").includes("حرف");
          if (!isPersonalized) return false;
        }

        // Gift Sets & Boxes filter
        if (showSetsOnly) {
          const isSet =
            (p.category || "").toLowerCase().includes("gift-boxes") ||
            (p.category || "").toLowerCase().includes("gifts-sets") ||
            (p.name || "").toLowerCase().includes("set") ||
            (p.name || "").toLowerCase().includes("box") ||
            (p.name || "").includes("طقم") ||
            (p.name || "").includes("بوكيه") ||
            (p.name || "").includes("صندوق");
          if (!isSet) return false;
        }

        // Price range filter
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
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Default "popular"
        return (b.views || b.reviews?.length || 0) - (a.views || a.reviews?.length || 0);
      });
  }, [initialProducts, recipient, showVerifiedOnly, showPersonalizedOnly, showSetsOnly, selectedPriceRange, sortBy]);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      {/* Etsy Editorial Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFE9F6] via-[#F7F4FA] to-cream pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 border-b border-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Header Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-14">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#222222] tracking-tight font-normal leading-[1.15]"
            >
              {hubDict.title_main || (isAr ? "هدايا ستأسر" : "Gifts They'll")}{" "}
              <span className="font-serif italic font-normal text-primary">
                {hubDict.title_highlight || (isAr ? "قلوبهم" : "Love")}
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-base md:text-lg text-charcoal/70 max-w-xl mx-auto font-normal leading-relaxed"
            >
              {hubDict.subtitle || (isAr ? "وجهتك الأولى للهدايا المميزة والفريدة من المبدعين والورش المحلية." : "THE place for meaningful presents from small shops.")}
            </motion.p>
          </div>

          {/* 3 Curated Recipient Cards Grid - Horizontal Snap Swipe on Small Screens, 3-Col Grid on Desktop */}
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible pb-4 pt-1 px-4 -mx-4 md:px-0 md:mx-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
          >
            {recipientCards.map((card, idx) => {
              const isSelected = recipient === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
                  onClick={() => handleCardClick(card.id)}
                  className={cn(
                    "group cursor-pointer flex flex-col transition-all rounded-3xl p-3 md:p-3.5 bg-white/70 backdrop-blur-sm border shadow-sm hover:shadow-md",
                    "w-[76vw] max-w-[310px] sm:w-[46vw] md:w-auto shrink-0 snap-center md:snap-align-none",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-white shadow-lg"
                      : "border-primary/10 hover:border-primary/30"
                  )}
                >
                  {/* Editorial Image Container */}
                  <div className="relative aspect-[4/5] rounded-2xl md:rounded-[22px] overflow-hidden mb-3 md:mb-4 bg-primary/5">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 640px) 76vw, (max-width: 1024px) 46vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority={idx === 0}
                    />

                    {/* Active State Pill Overlay */}
                    {isSelected && (
                      <div className="absolute top-2.5 end-2.5 sm:top-3 sm:end-3 z-10 bg-primary text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{isAr ? "محدد" : "Active"}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="px-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-[#222222] group-hover:text-primary transition-colors tracking-tight">
                        {card.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-charcoal/70 leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                        {card.desc}
                      </p>
                    </div>

                    {/* Shop Now Link */}
                    <div className="pt-3 md:pt-4 flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#222222] group-hover:text-primary transition-colors">
                      <span className="underline underline-offset-4">
                        {hubDict.shop_now || (isAr ? "تسوق الآن" : "Shop now")}
                      </span>
                      <ArrowIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Carousel Indicators & Swipe Hint */}
          <div className="flex md:hidden items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-1.5">
              {recipientCards.map((card, i) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeSlide === i ? "w-6 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-charcoal/50 font-medium">
              <span>{isAr ? "اسحب للاستكشاف" : "Swipe to explore"}</span>
              <ArrowIcon className="w-3 h-3 text-primary animate-pulse" />
            </div>
          </div>

        </div>
      </section>

      {/* Anchor for Smooth Scrolling */}
      <div ref={productsGridRef} className="scroll-mt-36" />

      {/* Sticky Etsy-Style Filter Toolbar */}
      <div
        ref={toolbarRef}
        style={stickyTop !== null ? { top: `${stickyTop}px` } : undefined}
        className="sticky top-[105px] md:top-[124px] z-30 bg-cream/95 backdrop-blur-md py-2.5 md:py-3 border-y border-primary/5 mb-6 md:mb-8 transition-all"
      >

        <div className="container mx-auto px-4 md:px-6">
          
          {/* Mobile Toolbar: Single Clean Row with Horizontal Swiping Pills & Filters Drawer Button */}
          <div className="flex md:hidden items-center gap-2 w-full">
            {/* All Filters Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs shrink-0 active:scale-95",
                activeFiltersCount > 0
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-charcoal/80 border-primary/20 hover:border-primary/40"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{hubDict.filters || (isAr ? "الفلاتر" : "Filters")}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Separator */}
            <div className="h-5 w-px bg-primary/10 shrink-0" />

            {/* Scrollable Pills Strip */}
            <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-1.5 whitespace-nowrap py-0.5">
              <button
                type="button"
                onClick={() => setRecipient("all")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  recipient === "all"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <Gift className="w-3 h-3" />
                <span>{hubDict.all_gifts || (isAr ? "الكل" : "All")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "her" ? "all" : "her")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  recipient === "her"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <span>{hubDict.for_her_title || (isAr ? "لها" : "For Her")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "him" ? "all" : "him")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  recipient === "him"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <span>{hubDict.for_him_title || (isAr ? "له" : "For Him")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "kids" ? "all" : "kids")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  recipient === "kids"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <span>{hubDict.for_kids_title || (isAr ? "للأطفال" : "For Kids")}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPriceRange(prev => prev === "UNDER_250" ? "ALL" : "UNDER_250")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  selectedPriceRange === "UNDER_250"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <span>{hubDict.gifts_under_250 || (isAr ? "< 250 ج.م" : "< 250 EGP")}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPriceRange(prev => prev === "UNDER_500" ? "ALL" : "UNDER_500")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  selectedPriceRange === "UNDER_500"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <span>{hubDict.gifts_under_500 || (isAr ? "< 500 ج.م" : "< 500 EGP")}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPersonalizedOnly(!showPersonalizedOnly)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  showPersonalizedOnly
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <Sparkles className="w-3 h-3" />
                <span>{hubDict.personalized_gifts || (isAr ? "مخصصة" : "Personalized")}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSetsOnly(!showSetsOnly)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shrink-0 active:scale-95",
                  showSetsOnly
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-charcoal/80 border-primary/15"
                )}
              >
                <Package className="w-3 h-3" />
                <span>{hubDict.gift_sets || (isAr ? "أطقم" : "Sets")}</span>
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-accent bg-accent/10 border border-accent/20 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{hubDict.clear_filters || (isAr ? "إلغاء" : "Reset")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Toolbar (>= md screen size) */}
          <div className="hidden md:flex items-center justify-between gap-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              {/* Desktop Recipient Pills */}
              <button
                type="button"
                onClick={() => setRecipient("all")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  recipient === "all"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{hubDict.all_gifts || (isAr ? "جميع الهدايا" : "All Gifts")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "her" ? "all" : "her")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  recipient === "her"
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <span>{hubDict.for_her_title || (isAr ? "هدايا لها" : "Gifts for Her")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "him" ? "all" : "him")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  recipient === "him"
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <span>{hubDict.for_him_title || (isAr ? "هدايا له" : "Gifts for Him")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecipient(prev => prev === "kids" ? "all" : "kids")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  recipient === "kids"
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <span>{hubDict.for_kids_title || (isAr ? "هدايا للأطفال" : "Gifts for Kids")}</span>
              </button>

              {/* Price Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(prev => prev === "price" ? null : "price")}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                    selectedPriceRange !== "ALL"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <span>
                    {selectedPriceRange !== "ALL"
                      ? priceRanges.find(r => r.id === selectedPriceRange)?.label
                      : `${isAr ? "الميزانية" : "Price"} (${currency})`}
                  </span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openDropdown === "price" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {openDropdown === "price" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute start-0 top-full mt-2 w-52 bg-white border border-primary/10 shadow-xl rounded-2xl p-1.5 z-[100]"
                    >
                      {priceRanges.map(range => (
                        <button
                          key={range.id}
                          type="button"
                          onClick={() => {
                            setSelectedPriceRange(range.id);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full text-start px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                            selectedPriceRange === range.id
                              ? "bg-primary/5 text-primary font-bold"
                              : "text-charcoal/70 hover:bg-cream hover:text-primary"
                          )}
                        >
                          <span>{range.label}</span>
                          {selectedPriceRange === range.id && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Personalized Gifts Pill */}
              <button
                type="button"
                onClick={() => setShowPersonalizedOnly(!showPersonalizedOnly)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  showPersonalizedOnly
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hubDict.personalized_gifts || (isAr ? "هدايا مخصصة" : "Personalized")}</span>
              </button>

              {/* Gift Sets Pill */}
              <button
                type="button"
                onClick={() => setShowSetsOnly(!showSetsOnly)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  showSetsOnly
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{hubDict.gift_sets || (isAr ? "أطقم هدايا" : "Gift Sets")}</span>
              </button>

              {/* Verified Artisans Pill */}
              <button
                type="button"
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                  showVerifiedOnly
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{dict.home?.artisans_tab || (isAr ? "حرفيون موثقون" : "Verified Artisans")}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(prev => prev === "sort" ? null : "sort")}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs active:scale-95",
                    sortBy !== "popular"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <ArrowUpDown className="w-3 h-3 text-accent" />
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openDropdown === "sort" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {openDropdown === "sort" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute start-0 md:end-0 md:start-auto top-full mt-2 w-52 bg-white border border-primary/10 shadow-xl rounded-2xl p-1.5 z-[100]"
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
                            "w-full text-start px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                            sortBy === option.value
                              ? "bg-primary/5 text-primary font-bold"
                              : "text-charcoal/70 hover:bg-cream hover:text-primary"
                          )}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear All Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1 ps-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{hubDict.clear_filters || (isAr ? "إعادة تعيين" : "Reset")}</span>
                </button>
              )}
            </div>

            {/* Product Count */}
            <div className="text-xs text-charcoal/50 font-medium shrink-0">
              <span>{filteredProducts.length}</span>{" "}
              <span>{isAr ? "هدية متاحة" : (filteredProducts.length === 1 ? "gift available" : "gifts available")}</span>
            </div>
          </div>

        </div>
      </div>


      {/* Curated Gifts Product Grid */}
      <section className="pb-16 container mx-auto px-4 md:px-6">
        
        {/* Dynamic Section Heading */}
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#222222] font-normal">
            {recipient === "her"
              ? (hubDict.for_her_title || (isAr ? "هدايا لها" : "Gifts for Her"))
              : recipient === "him"
              ? (hubDict.for_him_title || (isAr ? "هدايا له" : "Gifts for Him"))
              : recipient === "kids"
              ? (hubDict.for_kids_title || (isAr ? "هدايا للأطفال" : "Gifts for Kids"))
              : (hubDict.browse_all_gifts || (isAr ? "جميع الهدايا الحرفية" : "All Handcrafted Gifts"))}
          </h2>

          {recipient !== "all" && (
            <button
              onClick={() => setRecipient("all")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {hubDict.all_gifts || (isAr ? "عرض جميع الهدايا" : "Show All Gifts")}
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
              <SlidersHorizontal className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-2 px-4 max-w-md">
              <h3 className="text-lg md:text-2xl font-serif text-primary font-medium">
                {hubDict.no_gifts_found || (isAr ? "لم نجد هدايا تطابق الفلتر المحدد" : "No gifts match your filter selection")}
              </h3>
              <p className="text-charcoal/60 text-xs md:text-sm font-normal leading-relaxed">
                {isAr
                  ? "جرب إزالة بعض الفلاتر أو تصفح جميع الهدايا لاكتشاف أروع القطع المصنوعة يدوياً."
                  : "Try clearing some filters or browse all gifts to discover handcrafted treasures."}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-light transition-all shadow-xs"
                >
                  {hubDict.clear_filters || (isAr ? "إعادة ضبط الفلاتر" : "Reset Filters")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Products Grid (Etsy Style) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => {
                const reviews = product.reviews || [];
                const ratingCount = reviews.length;
                const avgRating = ratingCount > 0
                  ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / ratingCount).toFixed(1)
                  : null;
                const artisanName = product.artisan?.studioName || product.artisan?.user?.name;
                const slugOrId = (product.slug || product.id).trim();
                const productUrl = `/products/${encodeURI(slugOrId)}`;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
                  >
                    <div className="group cursor-pointer block h-full flex flex-col justify-between">
                      <div>
                        {/* Image Frame */}
                        <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-2.5 shadow-xs hover:shadow-md transition-shadow border border-primary/5 bg-cream/20">
                          <Link href={productUrl} className="block w-full h-full">
                            <BespokeImage
                              type="product"
                              id={product.id}
                              src={product.images?.[0] || "/images/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </Link>

                          {/* Wishlist Button */}
                          <div className="absolute top-2 end-2 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(product);
                              }}
                              className={cn(
                                "p-1.5 md:p-2 rounded-full transition-all scale-95 active:scale-75 shadow-md",
                                isFavorite(product.id)
                                  ? "bg-red-50 text-red-500 opacity-100"
                                  : "bg-white/90 backdrop-blur text-primary opacity-90 sm:opacity-0 group-hover:opacity-100 hover:bg-white"
                              )}
                              aria-label="Save to favorites"
                            >
                              <Heart className={cn("w-3.5 h-3.5 md:w-4 md:h-4", isFavorite(product.id) && "fill-current")} />
                            </button>
                          </div>

                          {/* Badges Overlay */}
                          <div className="absolute bottom-2 start-2 z-10 flex flex-col gap-1 items-start">
                            {(product.canPersonalize || product.requiresClientImage) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-accent shadow-xs">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{isAr ? "مخصص" : "Personalized"}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Artisan Studio */}
                        {artisanName && (
                          <p className="text-[11px] text-charcoal/50 font-normal line-clamp-1">
                            {artisanName}
                          </p>
                        )}

                        {/* Title */}
                        <h3 className="text-xs md:text-sm font-heading font-medium text-charcoal group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                          <Link href={productUrl}>{product.name}</Link>
                        </h3>

                        {/* Rating */}
                        {avgRating && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold text-charcoal">{avgRating}</span>
                            <span className="text-[10px] text-charcoal/50 font-normal">({ratingCount})</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <p className="font-heading font-bold text-primary text-xs md:text-sm pt-1 mt-1">
                        {currency} {Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* Mobile Filter & Sort Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-xs"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-cream rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden border-t border-primary/10"
            >
              {/* Drag Handle Pill */}
              <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto mt-3 mb-1" />

              {/* Drawer Header */}
              <div className="px-5 py-3 border-b border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-heading font-bold text-primary">
                    {hubDict.filter_and_sort || (isAr ? "تصفية وترتيب" : "Filter & Sort")}
                  </h3>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      {hubDict.clear_filters || (isAr ? "إعادة تعيين" : "Reset")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 hover:bg-primary/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-charcoal/70" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {/* Section: Who is it for? */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2.5 block">
                    {hubDict.who_is_it_for || (isAr ? "لمن الهدية؟" : "Who is it for?")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecipient("all")}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold text-center border transition-all flex items-center justify-center gap-2",
                        recipient === "all"
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-charcoal border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <Gift className="w-4 h-4" />
                      <span>{hubDict.all_gifts || (isAr ? "جميع الهدايا" : "All Gifts")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipient(prev => prev === "her" ? "all" : "her")}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold text-center border transition-all flex items-center justify-center gap-2",
                        recipient === "her"
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-charcoal border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <span>{hubDict.for_her_title || (isAr ? "هدايا لها" : "Gifts for Her")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipient(prev => prev === "him" ? "all" : "him")}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold text-center border transition-all flex items-center justify-center gap-2",
                        recipient === "him"
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-charcoal border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <span>{hubDict.for_him_title || (isAr ? "هدايا له" : "Gifts for Him")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipient(prev => prev === "kids" ? "all" : "kids")}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold text-center border transition-all flex items-center justify-center gap-2",
                        recipient === "kids"
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-charcoal border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <span>{hubDict.for_kids_title || (isAr ? "هدايا للأطفال" : "Gifts for Kids")}</span>
                    </button>
                  </div>
                </div>

                {/* Section: Budget */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2.5 block">
                    {hubDict.budget || (isAr ? "الميزانية" : "Budget")} ({currency})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all",
                          selectedPriceRange === range.id
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section: Special Features */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2.5 block">
                    {hubDict.special_features || (isAr ? "خيارات مميزة" : "Special Features")}
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowPersonalizedOnly(!showPersonalizedOnly)}
                      className={cn(
                        "w-full p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between",
                        showPersonalizedOnly
                          ? "bg-accent/10 text-accent border-accent"
                          : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span>{hubDict.personalized_gifts || (isAr ? "هدايا مخصصة بالاسم" : "Personalized Gifts")}</span>
                      </div>
                      {showPersonalizedOnly && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSetsOnly(!showSetsOnly)}
                      className={cn(
                        "w-full p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between",
                        showSetsOnly
                          ? "bg-accent/10 text-accent border-accent"
                          : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-accent" />
                        <span>{hubDict.gift_sets || (isAr ? "صناديق وأطقم هدايا" : "Gift Boxes & Sets")}</span>
                      </div>
                      {showSetsOnly && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                      className={cn(
                        "w-full p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between",
                        showVerifiedOnly
                          ? "bg-accent/10 text-accent border-accent"
                          : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>{dict.home?.artisans_tab || (isAr ? "حرفيون موثقون فقط" : "Verified Artisans Only")}</span>
                      </div>
                      {showVerifiedOnly && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </button>
                  </div>
                </div>

                {/* Section: Sort By */}
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-2.5 block">
                    {hubDict.sort_by || (isAr ? "ترتيب حسب" : "Sort By")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSortBy(option.value as any)}
                        className={cn(
                          "p-2.5 rounded-xl text-xs font-semibold border transition-all text-center",
                          sortBy === option.value
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-white text-charcoal/80 border-primary/15 hover:border-primary/30"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Sticky Action */}
              <div className="p-4 bg-white/95 backdrop-blur-md border-t border-primary/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    if (productsGridRef.current) {
                      productsGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-light transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>
                    {isAr
                      ? `عرض ${filteredProducts.length} هدية`
                      : `Show ${filteredProducts.length} ${filteredProducts.length === 1 ? "Gift" : "Gifts"}`}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>

  );
}
