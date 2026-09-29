"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { BespokeImage } from "@/components/bespoke-image";
import { ShelfProduct } from "@/components/home/product-shelf-row";

interface VisualGiftCategoriesProps {
  dict: any;
  herProduct?: ShelfProduct;
  himProduct?: ShelfProduct;
  kidsProduct?: ShelfProduct;
  decorProduct?: ShelfProduct;
  accessoriesProduct?: ShelfProduct;
}

export function VisualGiftCategories({
  dict,
  herProduct,
  himProduct,
  kidsProduct,
  decorProduct,
  accessoriesProduct,
}: VisualGiftCategoriesProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  const categories = [
    {
      id: "her",
      titleEn: "Gifts for Her",
      titleAr: "هدايا لها",
      href: "/gifts?recipient=her",
      product: herProduct,
      fallbackImg: "/hero.webp",
    },
    {
      id: "him",
      titleEn: "Gifts for Him",
      titleAr: "هدايا له",
      href: "/gifts?recipient=him",
      product: himProduct,
      fallbackImg: "/inlaid-box.png",
    },
    {
      id: "kids",
      titleEn: "Gifts for Kids",
      titleAr: "هدايا للأطفال",
      href: "/gifts?recipient=kids",
      product: kidsProduct,
      fallbackImg: "/journal.webp",
    },
    {
      id: "decor",
      titleEn: "Artisan Wood & Decor",
      titleAr: "ديكور وأعمال خشبية",
      href: "/category/home-and-living",
      product: decorProduct,
      fallbackImg: "/muski-vase.png",
    },
    {
      id: "accessories",
      titleEn: "Handcrafted Adornments",
      titleAr: "حلي وإكسسوارات يدوية",
      href: "/category/jewelry",
      product: accessoriesProduct,
      fallbackImg: "/earrings.webp",
    },
  ];

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 border-t border-primary/5">
      {/* Section Header in Giftisan brand style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 md:mb-6 gap-2">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary italic serif">
            {isArabic ? "هدايا مميزة لمن تحب" : dict?.home?.gifts_as_special || "Gifts as special as they are"}
          </h2>
          <p className="text-charcoal/60 text-xs md:text-sm mt-0.5">
            {isArabic
              ? "اختر هدايا مصممة خصيصاً لكل شخصية ومناسبة"
              : "Discover curated gifts tailored by recipient, occasion, and handcrafted specialty"}
          </p>
        </div>

        <Link
          href="/gifts"
          className="text-primary font-bold hover:text-accent transition-colors text-xs md:text-sm underline-offset-4 decoration-accent decoration-2 shrink-0"
        >
          {isArabic ? "استكشف دليل الهدايا بالكامل ←" : "Explore Gift Guides →"}
        </Link>
      </div>

      {/* 5 Visual Cards with Real Product Photos & Search Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {categories.map((item) => {
          const imgSrc = item.product?.images?.[0] || item.fallbackImg;
          const label = isArabic ? item.titleAr : item.titleEn;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block aspect-[4/5] sm:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-primary/10 bg-cream/40"
            >
              {/* Real Product Image */}
              <BespokeImage
                type="product"
                id={item.product?.id || item.id}
                src={imgSrc}
                alt={label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/70 via-black/15 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

              {/* Giftisan Search Pill */}
              <div className="absolute bottom-3.5 inset-x-3 flex justify-center z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream/95 backdrop-blur-md text-primary text-xs md:text-sm font-bold shadow-sm border border-primary/15 group-hover:bg-primary group-hover:text-cream group-hover:border-primary transition-all duration-200 truncate max-w-full text-center">
                  <Search className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{label}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
