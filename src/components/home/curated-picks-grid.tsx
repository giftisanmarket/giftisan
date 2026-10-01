"use client";

import Link from "next/link";
import { BespokeImage } from "@/components/bespoke-image";
import { ShelfProduct } from "@/components/home/product-shelf-row";

interface CuratedPicksGridProps {
  dict: any;
  bagProduct?: ShelfProduct;
  woodworkProduct?: ShelfProduct;
  jewelryProduct?: ShelfProduct;
  apparelProduct?: ShelfProduct;
  giftSetProduct?: ShelfProduct;
}

export function CuratedPicksGrid({
  dict,
  bagProduct,
  woodworkProduct,
  jewelryProduct,
  apparelProduct,
  giftSetProduct,
}: CuratedPicksGridProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  const picks = [
    {
      id: "bags",
      titleEn: "Handcrafted Bags",
      titleAr: "حقائب ومصنوعات يدوية",
      href: "/category/bags-and-purses",
      product: bagProduct,
      fallbackImg: "/hero.webp",
    },
    {
      id: "woodwork",
      titleEn: "Artisan Woodwork",
      titleAr: "أعمال خشبية وديكور",
      href: "/category/home-and-living",
      product: woodworkProduct,
      fallbackImg: "/inlaid-box.webp",
    },
    {
      id: "jewelry",
      titleEn: "Bespoke Jewelry",
      titleAr: "حلي ومجوهرات يدوية",
      href: "/category/jewelry",
      product: jewelryProduct,
      fallbackImg: "/earrings.webp",
    },
    {
      id: "apparel",
      titleEn: "Crochet & Apparel",
      titleAr: "كروشية وأزياء يدوية",
      href: "/category/clothing",
      product: apparelProduct,
      fallbackImg: "/journal.webp",
    },
    {
      id: "gifts",
      titleEn: "Curated Gift Sets",
      titleAr: "صناديق هدايا مختارة",
      href: "/gifts",
      product: giftSetProduct,
      fallbackImg: "/kilim-rug.webp",
    },
  ];

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-6 md:pt-8 md:pb-10">
      {/* Section Header styled in Giftisan brand style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 md:mb-6 gap-2">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary italic serif">
            {isArabic ? "مختارات خاصة لك" : dict?.home?.picks_for_you || "Picks for you"}
          </h2>
          <p className="text-charcoal/60 text-xs md:text-sm mt-0.5">
            {isArabic
              ? "استكشف إبداعات أصيلة ومصنوعة يدوياً من ورش الحرفيين في مصر"
              : "Handcrafted authentic treasures curated directly from Egyptian artisan workshops"}
          </p>
        </div>

        <Link
          href="/categories"
          className="text-primary font-bold hover:text-accent transition-colors text-xs md:text-sm underline-offset-4 decoration-accent decoration-2 shrink-0"
        >
          {isArabic ? "تصفح جميع الفئات ←" : "Explore All Categories →"}
        </Link>
      </div>

      {/* 5 Cards Row featuring REAL artisan products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {picks.map((item) => {
          const imgSrc = item.product?.images?.[0] || item.fallbackImg;
          const label = isArabic ? item.titleAr : item.titleEn;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block aspect-[4/5] sm:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-primary/10 bg-cream/40"
            >
              {/* Real Artisan Product Image */}
              <BespokeImage
                type="product"
                id={item.product?.id || item.id}
                src={imgSrc}
                alt={label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
              />

              {/* Subtle Warm Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/70 via-black/15 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

              {/* Giftisan Frosted Bottom Pill Tag */}
              <div className="absolute bottom-3.5 inset-x-3 flex justify-center z-10 pointer-events-none">
                <span className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-cream/95 backdrop-blur-md text-primary text-xs md:text-sm font-bold shadow-sm border border-primary/15 group-hover:bg-primary group-hover:text-cream group-hover:border-primary transition-all duration-200 truncate max-w-full text-center">
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
