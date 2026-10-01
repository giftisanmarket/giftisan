"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Mail } from "lucide-react";

interface FooterProps {
  dict: any;
}

export function Footer({ dict }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  const handleToggleLanguage = () => {
    const isCurrentAr = pathname.startsWith("/ar") || isArabic;
    const nextLang = isCurrentAr ? "en" : "ar";
    document.cookie = `NEXT_LOCALE=${nextLang}; path=/; max-age=31536000`;

    let nextPath = pathname;
    if (pathname.startsWith("/en") || pathname.startsWith("/ar")) {
      nextPath = pathname.replace(/^\/(en|ar)/, `/${nextLang}`);
    } else {
      nextPath = `/${nextLang}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    }

    router.push(nextPath);
  };

  return (
    <footer className="w-full bg-[#F7F5EA] text-charcoal border-t border-primary/10 selection:bg-accent/20">
      {/* 1. Main Upper Section (Clean Etsy-inspired layout) */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-14 md:pt-18 pb-14">
        
        {/* Confident Mission Headline — No redundant marketing subtitle */}
        <div className="mb-10 md:mb-12 max-w-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-medium text-primary leading-[1.12] tracking-tight">
            {isArabic ? (
              <>
                مهمتنا الحفاظ على
                <br />
                التجارة إنسانية.
              </>
            ) : (
              <>
                We&apos;re on a mission to
                <br />
                keep commerce human.
              </>
            )}
          </h2>
        </div>

        {/* 4 Clean Link Columns & Artisan Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          
          {/* Left: 4 Focused Columns — No redundant badges, clean whitespace */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
              
              {/* Column 1: Shop */}
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3.5 font-heading">
                  {isArabic ? "تسوق" : "Shop"}
                </h3>
                <ul className="space-y-2.5 text-[13px] text-charcoal/80">
                  <li>
                    <Link href="/products" className="hover:text-primary hover:underline transition-all">
                      {dict?.common?.all_collections || (isArabic ? "جميع المجموعات" : "All Collections")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/gifts" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "دليل الهدايا والمجموعات" : "Gift Guides & Sets"}
                    </Link>
                  </li>
                  <li>
                    <Link href="/artisans" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "متاجر الحرفيين" : "Artisan Shops"}
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-primary hover:underline transition-all">
                      {dict?.common?.all_categories || (isArabic ? "تصفح الفئات" : "Browse Categories")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Sell */}
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3.5 font-heading">
                  {isArabic ? "بيع" : "Sell"}
                </h3>
                <ul className="space-y-2.5 text-[13px] text-charcoal/80">
                  <li>
                    <Link href="/become-artisan" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "افتح متجرك في جيفتيزان" : "Sell on Giftisan"}
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "ميثاق الجودة والحرفية" : "Artisan Guidelines"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: About */}
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3.5 font-heading">
                  {isArabic ? "عن جيفتيزان" : "About"}
                </h3>
                <ul className="space-y-2.5 text-[13px] text-charcoal/80">
                  <li>
                    <Link href="/about" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "قصتنا ورؤيتنا" : "Our Story & Mission"}
                    </Link>
                  </li>
                  <li>
                    <Link href="/artisans" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "صناع الأثر في مصر" : "Meet the Makers"}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "الصحافة والاستفسارات" : "Press & Inquiries"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Help */}
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3.5 font-heading">
                  {isArabic ? "المساعدة" : "Help"}
                </h3>
                <ul className="space-y-2.5 text-[13px] text-charcoal/80">
                  <li>
                    <Link href="/contact" className="hover:text-primary hover:underline transition-all">
                      {isArabic ? "مركز الدعم والتواصل" : "Help & Support"}
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="mailto:support@giftisan.com" 
                      className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-primary transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>support@giftisan.com</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Right: Signature Handcrafted Artisan Illustration */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-[260px] sm:max-w-[290px] select-none">
              <svg 
                viewBox="0 0 320 220" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-2xs"
                aria-label="Giftisan Egyptian Artisans Crafting"
              >
                {/* Framed Canvas */}
                <rect x="135" y="45" width="130" height="95" rx="8" stroke="#1F2937" strokeWidth="2.5" fill="#FFFFFF"/>
                <rect x="142" y="52" width="116" height="81" rx="5" stroke="#1F2937" strokeWidth="1" strokeDasharray="3 3" fill="#FDFCF0"/>
                
                {/* Egyptian Botanical Lotus & Palm Motifs */}
                <path d="M175 110C175 90 190 75 210 75C215 88 210 102 195 108C185 112 178 110 175 110Z" fill="#D97706" opacity="0.9"/>
                <path d="M195 105C200 95 215 90 225 95C225 108 215 115 205 112" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="170" cy="85" r="4.5" fill="#D97706"/>
                <circle cx="160" cy="98" r="3.5" fill="#064E3B"/>
                <circle cx="225" cy="75" r="4" fill="#064E3B"/>

                {/* Artisan 1 (Left - Maker in Terracotta Apron) */}
                <circle cx="108" cy="72" r="11" fill="#D97706"/>
                <path d="M102 78C102 72 108 67 114 67C121 67 126 72 126 80C126 87 119 92 112 92C106 92 102 85 102 78Z" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2"/>
                <path d="M104 74C108 70 118 69 123 75" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="118" cy="77" r="1.5" fill="#1F2937"/>
                <path d="M117 83C119 84 121 83 122 81" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Apron in Giftisan Amber & Terracotta */}
                <path d="M96 112C96 98 104 94 116 94C128 94 135 100 135 112L132 185H92L96 112Z" fill="#D97706" stroke="#1F2937" strokeWidth="2"/>
                <path d="M108 94V125" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3"/>
                <path d="M100 135H128V155C128 159 124 163 120 163H108C104 163 100 159 100 155V135Z" fill="#B45309" stroke="#1F2937" strokeWidth="1.5"/>

                {/* Arm & Paintbrush */}
                <path d="M125 105C136 102 148 94 158 84" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
                <line x1="156" y1="86" x2="168" y2="76" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
                <polygon points="167,77 172,72 170,71 165,76" fill="#D97706"/>

                {/* Artisan 2 (Right - Craftsman in Giftisan Deep Forest Emerald Coat) */}
                <circle cx="258" cy="80" r="13" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2"/>
                <path d="M246 76C248 68 256 66 266 67C272 68 274 74 274 80C268 76 256 76 246 76Z" fill="#1F2937"/>
                <path d="M240 102C230 108 220 125 210 145C222 152 238 154 252 145L265 185H295L285 110C282 102 270 96 258 96C250 96 244 99 240 102Z" fill="#064E3B"/>

                {/* Hands holding the craft frame */}
                <path d="M205 130C210 120 216 110 220 95" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="218" cy="94" r="4" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2"/>
                <path d="M232 142C236 130 240 115 244 102" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="242" cy="100" r="4" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2"/>

                {/* Workshop Baseline */}
                <line x1="60" y1="185" x2="305" y2="185" stroke="#064E3B" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3"/>
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Etsy-Style Bottom Bar in Warm Giftisan Palette */}
      <div className="border-t border-primary/10 bg-[#EDE8D8] text-charcoal">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px]">
          
          {/* Left: Egypt Localization Button & Social Icons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            
            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-accent cursor-pointer select-none transition-colors"
              title={isArabic ? "Switch to English" : "التبديل إلى اللغة العربية"}
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{isArabic ? "English" : "العربية"}</span>
            </button>

            {/* Social Media Icons (Authentic Giftisan Channels) */}
            <div className="flex items-center gap-3 ps-1">
              
              {/* Instagram */}
              <a
                href="https://instagram.com/giftisan_eg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @giftisan_eg"
                className="text-charcoal/70 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@giftisan.eg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok @giftisan.eg"
                className="text-charcoal/70 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/giftisan.eg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook giftisan.eg"
                className="text-charcoal/70 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com/giftisaneg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest giftisaneg"
                className="text-charcoal/70 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>

            </div>

          </div>

          {/* Right: Copyright & Distinct Legal Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-1 text-charcoal/70">
            <span>© {new Date().getFullYear()} Giftisan. {dict?.home?.proudly_handcrafted || (isArabic ? "صنع بكل فخر وحب في مصر." : "Proudly Handcrafted in Egypt.")}</span>
            <Link href="/terms" className="hover:text-primary hover:underline transition-colors">
              {dict?.common?.terms || (isArabic ? "الشروط والأحكام" : "Terms")}
            </Link>
            <Link href="/privacy" className="hover:text-primary hover:underline transition-colors">
              {dict?.common?.privacy || (isArabic ? "الخصوصية" : "Privacy")}
            </Link>
            <Link href="/shipping" className="hover:text-primary hover:underline transition-colors">
              {dict?.common?.shipping || (isArabic ? "الشحن" : "Shipping")}
            </Link>
            <Link href="/refund" className="hover:text-primary hover:underline transition-colors">
              {dict?.common?.refund || (isArabic ? "الاسترجاع" : "Refund")}
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
