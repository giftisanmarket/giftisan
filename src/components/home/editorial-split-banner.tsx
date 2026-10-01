"use client";

import Link from "next/link";
import { BespokeImage } from "@/components/bespoke-image";
import { ShelfProduct } from "@/components/home/product-shelf-row";

interface EditorialSplitBannerProps {
  dict: any;
  featuredProduct1?: ShelfProduct;
  featuredProduct2?: ShelfProduct;
}

export function EditorialSplitBanner({
  dict,
  featuredProduct1,
  featuredProduct2,
}: EditorialSplitBannerProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  const prod1Img = featuredProduct1?.images?.[0] || "/hero.webp";
  const prod2Img = featuredProduct2?.images?.[0] || "/inlaid-box.webp";

  const prod1Url = featuredProduct1 ? `/products/${encodeURI(featuredProduct1.slug || featuredProduct1.id)}` : "/products";
  const prod2Url = featuredProduct2 ? `/products/${encodeURI(featuredProduct2.slug || featuredProduct2.id)}` : "/category/home-and-living";

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
      <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#053d2e] to-[#043327] text-white shadow-md border border-primary/20 grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Side: Giftisan Editorial Typography & Cream CTA Button */}
        <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 md:p-12 space-y-4 md:space-y-6 text-center lg:text-start">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-serif font-normal leading-[1.18] tracking-tight text-cream">
            {isArabic
              ? "الهدايا تصبح أكثر دفئاً مع إبداعات الحرفيين"
              : dict?.home?.split_banner_title || "Gifting feels more special with handcrafted picks"}
          </h2>

          <p className="text-cream/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
            {isArabic
              ? "اكتشف هدايا مصنوعة بالقلب واليد من أفضل المبدعين المستقلين في مصر."
              : "Discover one-of-a-kind treasures crafted by hand and heart from independent Egyptian makers."}
          </p>

          <div className="pt-2">
            <Link
              href="/gifts"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-cream text-primary font-bold text-xs sm:text-sm hover:bg-white hover:text-accent transition-all duration-200 shadow-md active:scale-95"
            >
              {isArabic ? "استكشف الهدايا" : dict?.home?.split_banner_btn || "Take a look"}
            </Link>
          </div>
        </div>

        {/* Right Side: Real Artisan Featured Products Showcase */}
        <div className="lg:col-span-6 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 bg-black/15">
          {/* Card 1 */}
          <Link
            href={prod1Url}
            className="group relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square bg-primary/40 block shadow-sm border border-white/10"
          >
            <BespokeImage
              type="product"
              id={featuredProduct1?.id || "feat-1"}
              src={prod1Img}
              alt={featuredProduct1?.name || "Handcrafted creation"}
              fill
              sizes="(max-width: 640px) 100vw, 30vw"
              className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 start-3 end-3 text-white">
              <span className="text-xs sm:text-sm font-semibold text-white/95 group-hover:text-accent-light transition-colors line-clamp-1">
                {featuredProduct1?.name || (isArabic ? "إبداعات يدوية مميزة" : "Original Artisan Finds")}
              </span>
              <p className="text-[11px] text-white/70">
                {isArabic ? "عرض المنتج ←" : "View item →"}
              </p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href={prod2Url}
            className="group relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square bg-primary/40 block shadow-sm border border-white/10"
          >
            <BespokeImage
              type="product"
              id={featuredProduct2?.id || "feat-2"}
              src={prod2Img}
              alt={featuredProduct2?.name || "Handcrafted creation"}
              fill
              sizes="(max-width: 640px) 100vw, 30vw"
              className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 start-3 end-3 text-white">
              <span className="text-xs sm:text-sm font-semibold text-white/95 group-hover:text-accent-light transition-colors line-clamp-1">
                {featuredProduct2?.name || (isArabic ? "أعمال فنية وديكور" : "Artisan Home Decor")}
              </span>
              <p className="text-[11px] text-white/70">
                {isArabic ? "عرض المنتج ←" : "View item →"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
