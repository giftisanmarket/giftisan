"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, Sparkles, ArrowRight } from "lucide-react";

interface GiftFinderWidgetProps {
  dict: any;
}

export function GiftFinderWidget({ dict }: GiftFinderWidgetProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");
  const currency = dict?.product?.currency || "EGP";

  const [activeRecipient, setActiveRecipient] = useState<string>("all");
  const [activeBudget, setActiveBudget] = useState<string>("all");

  const recipients = [
    { id: "all", label: isArabic ? "الجميع" : "Everyone", href: "/gifts" },
    { id: "her", label: isArabic ? "لها" : "For Her", href: "/gifts?recipient=her" },
    { id: "him", label: isArabic ? "له" : "For Him", href: "/gifts?recipient=him" },
    { id: "kids", label: isArabic ? "للأطفال" : "For Kids", href: "/gifts?recipient=kids" },
    { id: "home", label: isArabic ? "للمنزل" : "For Home", href: "/category/home-and-living" },
  ];

  const budgets = [
    { id: "all", label: isArabic ? "أي ميزانية" : "Any Budget", href: "/gifts" },
    { id: "u250", label: isArabic ? `أقل من ٢٥٠ ${currency}` : `Under 250 ${currency}`, href: "/gifts?maxPrice=250" },
    { id: "250-500", label: isArabic ? `٢٥٠ - ٥٠٠ ${currency}` : `250 - 500 ${currency}`, href: "/gifts?minPrice=250&maxPrice=500" },
    { id: "500-1000", label: isArabic ? `٥٠٠ - ١٠٠٠ ${currency}` : `500 - 1,000 ${currency}`, href: "/gifts?minPrice=500&maxPrice=1000" },
    { id: "1000p", label: isArabic ? `+١٠٠٠ ${currency} (فاخر)` : `1,000+ ${currency} (Luxury)`, href: "/gifts?minPrice=1000" },
  ];

  const getTargetHref = () => {
    let base = "/gifts";
    const params = new URLSearchParams();
    if (activeRecipient !== "all") {
      params.set("recipient", activeRecipient);
    }
    if (activeBudget === "u250") {
      params.set("maxPrice", "250");
    } else if (activeBudget === "250-500") {
      params.set("minPrice", "250");
      params.set("maxPrice", "500");
    } else if (activeBudget === "500-1000") {
      params.set("minPrice", "500");
      params.set("maxPrice", "1000");
    } else if (activeBudget === "1000p") {
      params.set("minPrice", "1000");
    }
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-6">
      <div className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Header text */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>{isArabic ? "دليل الهدايا الذكي" : "Smart Gift Finder"}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold font-heading text-primary">
              {isArabic ? "اختر الهدية المثالية بالميزانية المناسبة" : "Find the perfect gift by recipient and budget"}
            </h3>
          </div>

          {/* Interactive Filters & Direct CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Recipient Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {recipients.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRecipient(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeRecipient === r.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-cream text-charcoal/70 hover:bg-primary/5 hover:text-primary border border-primary/10"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Budget Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {budgets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBudget(b.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeBudget === b.id
                      ? "bg-accent text-white shadow-xs"
                      : "bg-cream text-charcoal/70 hover:bg-accent/10 hover:text-accent border border-primary/10"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Find CTA Button */}
            <Link
              href={getTargetHref()}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-light transition-all shadow-sm active:scale-95 shrink-0"
            >
              <span>{isArabic ? "عرض الهدايا" : "Show Gifts"}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
