"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { BespokeImage } from "@/components/bespoke-image";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

export interface ShelfProduct {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  images: string[];
  badge?: string | null;
  canPersonalize?: boolean;
  requiresClientImage?: boolean;
  category?: string;
  artisan?: {
    id?: string;
    studioName?: string | null;
    slug?: string | null;
    user?: {
      name?: string | null;
    };
  };
}

interface ProductShelfRowProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  products: ShelfProduct[];
  dict: any;
  defaultBadge?: string;
}

export function ProductShelfRow({
  title,
  subtitle,
  viewAllHref,
  viewAllText,
  products,
  dict,
  defaultBadge,
}: ProductShelfRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");
  const currency = dict?.product?.currency || "EGP";
  const defaultViewAll = isArabic ? "عرض الكل" : "View all";

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    if (isArabic) {
      const absLeft = Math.abs(scrollLeft);
      setCanScrollRight(absLeft > 10);
      setCanScrollLeft(absLeft + clientWidth < scrollWidth - 10);
    } else {
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [products, isArabic]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 320;
    const factor = direction === "left" ? -step : step;
    const scrollAmount = isArabic ? -factor : factor;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 border-t border-primary/5">
      {/* Shelf Header in Giftisan brand style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4 md:mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-primary italic serif">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-charcoal/60 mt-0.5">{subtitle}</p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/20 hover:border-primary hover:bg-primary hover:text-cream text-xs font-bold text-primary transition-all shrink-0 active:scale-95 group shadow-2xs"
          >
            <span>{viewAllText || defaultViewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Product Shelf Track with Giftisan Brand Arrow Buttons */}
      <div className="relative group/shelf">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute -start-3.5 top-1/3 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-light text-cream shadow-md items-center justify-center z-20 cursor-pointer active:scale-90 transition-all opacity-0 group-hover/shelf:opacity-100 border border-cream/20"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute -end-3.5 top-1/3 -translate-y-1/2 w-9 h-9 rounded-full bg-primary hover:bg-primary-light text-cream shadow-md items-center justify-center z-20 cursor-pointer active:scale-90 transition-all opacity-90 group-hover/shelf:opacity-100 border border-cream/20"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}

        {/* Horizontal Track */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 -mx-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, idx) => {
            const slugOrId = (product.slug || product.id).trim();
            const productUrl = `/products/${encodeURI(slugOrId)}`;
            const artisanName = product.artisan?.studioName || product.artisan?.user?.name;
            const isHandmadeBadge = (b?: string | null) =>
              b ? ["handmade", "صناعة يدوية", "صنع يدوي"].includes(b.trim().toLowerCase()) : false;
            const validBadge = product.badge && !isHandmadeBadge(product.badge) ? product.badge : null;
            const validDefaultBadge = defaultBadge && !isHandmadeBadge(defaultBadge) ? defaultBadge : null;
            const hasBadge =
              validBadge ||
              validDefaultBadge ||
              (idx === 0 ? (isArabic ? "الأكثر طلباً" : "Best seller") : null);

            return (
              <div
                key={product.id}
                className="w-[160px] sm:w-[195px] md:w-[220px] lg:w-[235px] flex-shrink-0 snap-start group/card block"
              >
                {/* Image Box */}
                <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-2 shadow-xs hover:shadow-md transition-all duration-300 border border-primary/5 bg-cream/30">
                  <Link href={productUrl} className="block w-full h-full">
                    <BespokeImage
                      type="product"
                      id={product.id}
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover/card:scale-106 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 240px"
                    />
                  </Link>

                  {/* Badges in Giftisan Colors (Emerald / Amber) */}
                  {product.canPersonalize ? (
                    <span className="absolute top-2 start-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-primary text-cream shadow-xs border border-primary-light/20 pointer-events-none">
                      {isArabic ? "قابل للتخصيص" : "Personalizable"}
                    </span>
                  ) : hasBadge ? (
                    <span className="absolute top-2 start-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-accent text-white shadow-xs pointer-events-none">
                      {hasBadge}
                    </span>
                  ) : null}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product as any);
                    }}
                    aria-label="Save to favorites"
                    className={cn(
                      "absolute top-2 end-2 z-10 p-1.5 rounded-full transition-all duration-200 shadow-sm",
                      isFavorite(product.id)
                        ? "bg-red-50 text-red-500 opacity-100 scale-100"
                        : "bg-white/90 text-primary opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-red-500 active:scale-75"
                    )}
                  >
                    <Heart
                      className={cn("w-3.5 h-3.5", isFavorite(product.id) && "fill-current text-red-500")}
                    />
                  </button>
                </div>

                {/* Details Underneath in Giftisan Brand Typography */}
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-heading font-medium text-charcoal group-hover/card:text-primary transition-colors line-clamp-1 leading-snug">
                    <Link href={productUrl}>{product.name}</Link>
                  </h3>

                  {artisanName && (
                    <p className="text-[11px] text-charcoal/50 truncate font-light">
                      {isArabic ? `بواسطة ${artisanName}` : `by ${artisanName}`}
                    </p>
                  )}

                  <p className="font-heading font-bold text-primary text-xs sm:text-sm pt-0.5">
                    {currency} {product.price}.00
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
