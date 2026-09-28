"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Percent } from "lucide-react";
import { BespokeImage } from "@/components/bespoke-image";

interface ArtisanRecruitmentBannerProps {
  dict: any;
}

export function ArtisanRecruitmentBanner({ dict }: ArtisanRecruitmentBannerProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#12382c] via-[#0b2920] to-[#041a13] text-white p-6 sm:p-10 md:p-14 shadow-lg border border-primary/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 end-0 w-80 h-80 bg-accent/15 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 start-0 w-80 h-80 bg-primary-light/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

        {/* Content Column */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6 relative z-10 text-center lg:text-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isArabic ? "برنامج الحرفيين المؤسسين ٢٠٢٦ • عمولة ٠٪" : "2026 Founding Artisan Program • 0% Platform Fees"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-serif font-medium leading-[1.2] text-cream">
            {isArabic
              ? "تصنع بشغف؟ اعرض إبداعاتك لآلاف الباحثين عن التميز"
              : dict?.home?.sell_banner_title || "Crafted with heart? Sell directly to thousands of gift seekers"}
          </h2>

          <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            {isArabic
              ? "انضم إلى أرقى منصة للمبدعين المستقلين في مصر. احتفظ بكامل أرباحك بعمولة ٠٪، مع استلام الطلبات مباشرة من باب ورشتك."
              : dict?.home?.sell_banner_desc || "Join Egypt's curated marketplace for independent artisans. Keep 100% of your sales with 0% platform commission and direct door-to-door courier pickup."}
          </p>

          {/* Value Props Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 pb-2 text-center lg:text-start">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start text-accent-light">
                <Percent className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold text-white">0% Fee</span>
              </div>
              <p className="text-[11px] text-white/60">
                {isArabic ? "طوال موسم ٢٠٢٦" : "For 2026 Season"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start text-accent-light">
                <Truck className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {isArabic ? "استلام من الورشة" : "Doorstep Pickup"}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                {isArabic ? "لكافة المحافظات" : "Nationwide Delivery"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start text-accent-light">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {isArabic ? "استوديو موثق" : "Verified Badge"}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                {isArabic ? "تسويق احترافي" : "Curated Platform"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              href="/become-artisan"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-accent text-white font-bold text-xs sm:text-sm hover:bg-accent-dark transition-all duration-200 shadow-md active:scale-95"
            >
              <span>{isArabic ? "قدم لفتح استوديو" : "Apply to Open a Studio"}</span>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
            </Link>

            <Link
              href="/artisans"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200 border border-white/20 active:scale-95"
            >
              {isArabic ? "تعرف على الحرفيين" : "Meet Our Makers"}
            </Link>
          </div>
        </div>

        {/* Visual Column — Real photo from marketing assets */}
        <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-inner border border-white/15">
          <BespokeImage
            src="/marketing/artisan-working.webp"
            alt="Artisan at work"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041a13]/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 start-4 end-4 text-xs text-white/90 font-medium font-heading">
            {isArabic ? "بواسطة حرفيين مصريين مستقلين" : "Authentic craftsmanship from real independent workshops"}
          </div>
        </div>
      </div>
    </section>
  );
}
