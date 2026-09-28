"use client";

import Link from "next/link";
import { HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";

interface MissionStatementBarProps {
  dict: any;
}

export function MissionStatementBar({ dict }: MissionStatementBarProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  return (
    <section className="w-full bg-primary/5 border-t border-primary/10 mt-12 pt-12 md:pt-16 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Etsy-Style Mission Headline with Giftisan Brand Typography */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-serif font-normal italic text-primary tracking-tight leading-tight">
            {isArabic
              ? "مهمتنا الحفاظ على التجارة إنسانية والاحتفاء بالحرفية المصرية الأصيلة."
              : "We're on a mission to keep commerce human."}
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-charcoal/65 leading-relaxed font-normal">
            {isArabic
              ? "جيفتيزان مجتمع يربطك مباشرة بأمهر المبدعين والحرفيين في مصر، لنمنح كل هدية قيمة حقيقية وقصة ملهمة."
              : "Giftisan is a curated community connecting you directly to passionate independent creators across Egypt, making every gift meaningful."}
          </p>
        </div>

        {/* 4 Trust Pillars in Giftisan Brand Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pb-12 border-b border-primary/10">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-primary/5 shadow-2xs space-y-2 text-center md:text-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-primary">
              {isArabic ? "دعم الحرفيين مباشرة" : "Support Real Makers"}
            </h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              {isArabic
                ? "كل عملية شراء تذهب مباشرة إلى ورشة الحرفي المستقل."
                : "Every purchase directly supports independent Egyptian workshops."}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-primary/5 shadow-2xs space-y-2 text-center md:text-start">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto md:mx-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-primary">
              {isArabic ? "قطع فريدة وتذكارات خاصة" : "One-of-a-Kind Finds"}
            </h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              {isArabic
                ? "إبداعات مميزة لا تجدها في المتاجر التجارية التقليدية."
                : "Handcrafted creations you won't find on mass-market shelves."}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-primary/5 shadow-2xs space-y-2 text-center md:text-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-primary">
              {isArabic ? "تسوق آمن وموثوق" : "Peace of Mind"}
            </h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              {isArabic
                ? "حماية المشتري، جودة مفحوصة، ومتابعة دقيقة لكل طلب."
                : "Buyer protection, vetted authenticity, and responsive artisan support."}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-primary/5 shadow-2xs space-y-2 text-center md:text-start">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto md:mx-0">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-primary">
              {isArabic ? "توصيل لكافة المحافظات" : "Door-to-Door Delivery"}
            </h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              {isArabic
                ? "تغليف بعناية وشحن سريع من الورشة إلى باب منزلك."
                : "Carefully packaged and delivered straight from the artisan's hands."}
            </p>
          </div>
        </div>

        {/* 4 Multi-column Links matching Etsy Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 text-xs text-charcoal/70">
          <div>
            <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider font-heading">
              {isArabic ? "تسوق" : "Shop"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-accent transition-colors">
                  {isArabic ? "جميع المجموعات" : "All Collections"}
                </Link>
              </li>
              <li>
                <Link href="/gifts" className="hover:text-accent transition-colors">
                  {isArabic ? "مركز الهدايا" : "Gift Guides"}
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-accent transition-colors">
                  {isArabic ? "استوديوهات الحرفيين" : "Artisan Studios"}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-accent transition-colors">
                  {isArabic ? "تصفح الفئات" : "Browse Categories"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider font-heading">
              {isArabic ? "بيع" : "Sell"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/become-artisan" className="hover:text-accent transition-colors">
                  {isArabic ? "افتح استوديو في جيفتيزان" : "Sell on Giftisan"}
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-accent transition-colors">
                  {isArabic ? "لوحة تحكم الحرفي" : "Artisan Studio Portal"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  {isArabic ? "ميثاق الجودة والحرفية" : "Artisan Guidelines"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider font-heading">
              {isArabic ? "عن جيفتيزان" : "About"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bio" className="hover:text-accent transition-colors">
                  {isArabic ? "قصتنا ورؤيتنا" : "Our Story & Mission"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  {isArabic ? "الشروط والأحكام" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider font-heading">
              {isArabic ? "المساعدة" : "Help"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  {isArabic ? "تواصل معنا" : "Contact & Support"}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent transition-colors">
                  {isArabic ? "سياسة الشحن والتوصيل" : "Shipping Policy"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-accent transition-colors">
                  {isArabic ? "سياسة الاسترجاع" : "Refund Policy"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
