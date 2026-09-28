"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ArtisanCard } from "@/components/artisans/artisan-card";

interface ArtisanSpotlightSectionProps {
  artisans: any[];
  dict: any;
}

export function ArtisanSpotlightSection({ artisans, dict }: ArtisanSpotlightSectionProps) {
  if (!artisans || artisans.length === 0) return null;

  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 border-t border-primary/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>{isArabic ? "استوديوهات الحرفيين" : "Maker Spotlight"}</span>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary italic serif">
            {isArabic
              ? dict?.home?.meet_masters || "تواصل مع المبدعين"
              : dict?.home?.meet_masters || "Meet the Makers"}
          </h2>
          <p className="text-charcoal/60 text-xs md:text-sm mt-1">
            {isArabic
              ? dict?.home?.meet_masters_desc || "الأيدي والقلوب الكامنة وراء منتجاتك المفضلة."
              : dict?.home?.meet_masters_desc || "The hands and hearts behind your favorite handcrafted creations."}
          </p>
        </div>

        <Link
          href="/artisans"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/20 hover:border-primary hover:bg-primary hover:text-cream text-xs font-bold text-primary transition-all group shrink-0 active:scale-95 shadow-2xs"
        >
          <span>{isArabic ? "عرض جميع الاستوديوهات" : dict?.home?.view_studios || "Explore All Studios"}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {artisans.slice(0, 4).map((artisan) => (
          <div key={artisan.id} className="h-full">
            <ArtisanCard artisan={artisan} dict={dict} />
          </div>
        ))}
      </div>
    </section>
  );
}
