"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CategoryStoryStrip — Etsy-style circular story bubbles
 * Uses only real brand photos from /images/categories/ and /public/ assets.
 * No AI-generated images.
 */

interface CategoryItem {
  slug: string;
  image: string;  // Only brand-owned or real photos
  fallbackName: string;
  arName: string;
  href?: string;
}

// All images use the curated /images/categories/ folder from our own brand assets
const FEATURED_CATEGORIES: CategoryItem[] = [
  {
    slug: "jewelry",
    image: "/images/categories/jewelry.png",
    fallbackName: "Jewelry",
    arName: "مجوهرات وحلي",
  },
  {
    slug: "ceramics",
    image: "/images/categories/ceramics.png",
    fallbackName: "Ceramics & Pottery",
    arName: "خزف وفخار",
  },
  {
    slug: "woodwork",
    image: "/images/categories/woodwork.png",
    fallbackName: "Artisan Woodwork",
    arName: "أعمال خشبية",
  },
  {
    slug: "textiles",
    image: "/images/categories/textiles.png",
    fallbackName: "Handmade Textiles",
    arName: "منسوجات تراثية",
  },
  {
    slug: "personalized",
    image: "/images/categories/personalized.png",
    fallbackName: "Personalized Gifts",
    arName: "هدايا مخصصة",
    href: "/search?q=personalized",
  },
  {
    slug: "metalwork",
    image: "/images/categories/metalwork.png",
    fallbackName: "Metalwork & Craft",
    arName: "أعمال معدنية",
  },
  {
    slug: "gift-boxes-sets",
    image: "/images/categories/gift-boxes-sets.png",
    fallbackName: "Gift Sets",
    arName: "صناديق هدايا",
    href: "/gifts",
  },
  {
    slug: "art-collectibles",
    image: "/images/categories/art-collectibles.png",
    fallbackName: "Art & Collectibles",
    arName: "لوحات وفنون",
  },
  {
    slug: "vintage",
    image: "/images/categories/vintage.png",
    fallbackName: "Vintage Heritage",
    arName: "أنتيك وتراث",
  },
  {
    slug: "beauty-apothecary",
    image: "/images/categories/beauty-apothecary.png",
    fallbackName: "Bath & Beauty",
    arName: "عناية طبيعية",
  },
  {
    slug: "stationery",
    image: "/images/categories/stationery.png",
    fallbackName: "Stationery & Art",
    arName: "قرطاسية وفنون",
  },
  {
    slug: "fashion",
    image: "/images/categories/fashion.png",
    fallbackName: "Fashion & Bags",
    arName: "أزياء وحقائب",
  },
];

interface CategoryStoryStripProps {
  dict: any;
}

export function CategoryStoryStrip({ dict }: CategoryStoryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = 320;
    const scrollAmount = direction === "left"
      ? (isArabic ? offset : -offset)
      : (isArabic ? -offset : offset);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const getCategoryTitle = (item: CategoryItem) => {
    if (isArabic) return item.arName;
    return dict?.common?.categories_list?.[item.slug] || item.fallbackName;
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-5 md:py-8">
      {/* Section Header in Giftisan brand style */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-primary italic serif">
            {isArabic ? "تصفح حسب الفئة" : dict?.home?.browse_category || "Browse by Category"}
          </h2>
          <p className="text-xs md:text-sm text-charcoal/60 mt-0.5">
            {isArabic
              ? "اكتشف إبداعات أصيلة من ورش الحرفيين في مصر"
              : dict?.home?.category_desc || "Explore authentic handcrafted creations from independent Egyptian makers"}
          </p>
        </div>

        {/* Scroll Controls (Desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label={isArabic ? "تمرير لليسار" : "Scroll left"}
            className="w-8 h-8 rounded-full border border-primary/20 bg-cream text-primary hover:bg-primary hover:text-cream hover:border-primary flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label={isArabic ? "تمرير لليمين" : "Scroll right"}
            className="w-8 h-8 rounded-full border border-primary/20 bg-cream text-primary hover:bg-primary hover:text-cream hover:border-primary flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Horizontal Story Bubbles Scroll */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {FEATURED_CATEGORIES.map((cat) => {
          const href = cat.href || `/category/${cat.slug}`;
          const title = getCategoryTitle(cat);

          return (
            <Link
              key={cat.slug}
              href={href}
              className="group flex flex-col items-center flex-shrink-0 snap-start text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl p-1"
            >
              {/* Circular Bubble with Giftisan brand ring */}
              <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[2.5px] bg-gradient-to-br from-accent/50 via-primary/20 to-primary/50 group-hover:from-accent group-hover:to-primary-light transition-all duration-300 shadow-sm group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-cream border border-cream/50">
                  <Image
                    src={cat.image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 72px, (max-width: 768px) 80px, 96px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Label Underneath — Giftisan typography */}
              <span className="mt-2 text-[11px] md:text-xs font-heading font-medium text-charcoal/80 group-hover:text-primary transition-colors max-w-[80px] sm:max-w-[88px] md:max-w-[100px] leading-tight line-clamp-2 text-center">
                {title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
