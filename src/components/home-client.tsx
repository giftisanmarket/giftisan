"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CategoryStoryStrip } from "@/components/home/category-story-strip";
import { CuratedPicksGrid } from "@/components/home/curated-picks-grid";
import { ProductShelfRow, ShelfProduct } from "@/components/home/product-shelf-row";
import { EditorialSplitBanner } from "@/components/home/editorial-split-banner";
import { VisualGiftCategories } from "@/components/home/visual-gift-categories";
import { ArtisanSpotlightSection } from "@/components/home/artisan-spotlight-section";
import { ArtisanRecruitmentBanner } from "@/components/home/artisan-recruitment-banner";
import { MissionStatementBar } from "@/components/home/mission-statement-bar";
import { BespokeImage } from "@/components/bespoke-image";
import { NewsletterForm } from "@/components/newsletter-form";

interface HomeClientProps {
  trendingProducts?: ShelfProduct[];
  bagProducts?: ShelfProduct[];
  homeDecorProducts?: ShelfProduct[];
  jewelryProducts?: ShelfProduct[];
  crochetApparelProducts?: ShelfProduct[];
  giftSetProducts?: ShelfProduct[];
  featuredArtisans?: any[];
  artisanCount?: number;
  dict: any;
  // Backward compatibility fallbacks
  featuredProducts?: ShelfProduct[];
  products?: ShelfProduct[];
  personalizedProducts?: ShelfProduct[];
  textileFashionProducts?: ShelfProduct[];
}

export default function HomeClient({
  trendingProducts,
  bagProducts = [],
  homeDecorProducts = [],
  jewelryProducts = [],
  crochetApparelProducts = [],
  giftSetProducts = [],
  featuredArtisans = [],
  artisanCount,
  dict,
  featuredProducts,
  products,
}: HomeClientProps) {
  const isArabic = dict?.common?.home === "الرئيسية" || dict?.common?.search?.includes("ابحث");

  // Fallback for trending products if legacy props were passed
  const mainTrending = trendingProducts || featuredProducts || products || [];

  useEffect(() => {
    if (window.location.hash === "#newsletter") {
      const element = document.getElementById("newsletter");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-cream relative overflow-hidden selection:bg-primary/20">
      {/* Subtle Artisanal Grid Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#064e3b06_1px,transparent_1px),linear-gradient(to_bottom,#064e3b06_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      {/* Main Header / Sticky Navbar */}
      <Navbar dict={dict} />

      {/* Giftisan Brand Hero */}
      <Hero artisanCount={artisanCount} dict={dict} />

      {/* 1. Category Story Bubbles Strip — right below hero */}
      <CategoryStoryStrip dict={dict} />

      {/* 2. Curated Visual Picks ("Picks for you" - 5 Real Artisan Products) */}
      <CuratedPicksGrid
        dict={dict}
        bagProduct={bagProducts[0]}
        woodworkProduct={homeDecorProducts[0]}
        jewelryProduct={jewelryProducts[0]}
        apparelProduct={crochetApparelProducts[0]}
        giftSetProduct={giftSetProducts[0]}
      />

      {/* 2. Primary Product Shelf ("Picks inspired by your shopping" - Trending Finds) */}
      {mainTrending.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "مختارات مستوحاة من اهتماماتك" : "Picks inspired by your shopping"}
          subtitle={
            isArabic
              ? "قطع فريدة يدوية الصنع تحظى بإعجاب المتسوقين الآن"
              : "Unique handmade creations shoppers are loving right now"
          }
          viewAllHref="/products"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={mainTrending}
          dict={dict}
        />
      )}

      {/* 3. Editorial Split Banner ("Gifting feels more special with handcrafted picks" - Real Products) */}
      <EditorialSplitBanner
        dict={dict}
        featuredProduct1={homeDecorProducts[1] || homeDecorProducts[0]}
        featuredProduct2={bagProducts[1] || bagProducts[0]}
      />

      {/* 4. Category Shelf: Handcrafted Bags & Leather Goods */}
      {bagProducts.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "حقائب ومصنوعات جلدية يدوية" : "Handcrafted Bags & Leather Goods"}
          subtitle={
            isArabic
              ? "حقائب جلدية أصلية، كروشيه فاخر، وإكسسوارات صنعت لتدوم"
              : "Authentic leather totes, fine crochet purses, and durable accessories"
          }
          viewAllHref="/category/bags-and-purses"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={bagProducts}
          dict={dict}
          defaultBadge={isArabic ? "صناعة يدوية" : "Handmade"}
        />
      )}

      {/* 5. Category Shelf: Bespoke Jewelry & Adornments */}
      {jewelryProducts.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "مجوهرات وحلي يدوية الصنع" : "Bespoke Jewelry & Keepsakes"}
          subtitle={
            isArabic
              ? "فضة، أحجار كريمة، وقطع فنية مصممة بلمسة مصرية فريدة"
              : "Handcrafted silver, semi-precious stones, and artisan jewelry"
          }
          viewAllHref="/category/jewelry"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={jewelryProducts}
          dict={dict}
        />
      )}

      {/* 6. Category Shelf: Artisan Woodwork & Home Collectibles */}
      {homeDecorProducts.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "أعمال خشبية وديكورات فنية" : "Artisan Woodwork & Home Collectibles"}
          subtitle={
            isArabic
              ? "خشب طبيعي منحوت يدويًا، صواني تراثية، ومقتنيات للمنزل العصري"
              : "Carved natural wood, handcrafted trays, and authentic home accents"
          }
          viewAllHref="/category/home-and-living"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={homeDecorProducts}
          dict={dict}
        />
      )}

      {/* 7. Curated Visual Exploration Strip ("Gifts as special as they are" - Real Products with 🔍 Search Pills) */}
      <VisualGiftCategories
        dict={dict}
        herProduct={bagProducts[2] || bagProducts[0]}
        himProduct={homeDecorProducts[2] || homeDecorProducts[0]}
        kidsProduct={
          giftSetProducts.find((p) => p.category === "toys-and-games") ||
          giftSetProducts[1] ||
          giftSetProducts[0]
        }
        decorProduct={homeDecorProducts[3] || homeDecorProducts[0]}
        accessoriesProduct={jewelryProducts[1] || jewelryProducts[0]}
      />

      {/* 8. Category Shelf: Handmade Crochet & Apparel */}
      {crochetApparelProducts.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "كروشية وأزياء يدوية الصنع" : "Handmade Crochet, Knits & Apparel"}
          subtitle={
            isArabic
              ? "أزياء ومنسوجات مريحة صنعت بحب بواسطة أمهر الحرفيات"
              : "Cozy knitwear, handcrafted wraps, and mindful everyday apparel"
          }
          viewAllHref="/category/clothing"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={crochetApparelProducts}
          dict={dict}
        />
      )}

      {/* 9. Category Shelf: Curated Gift Sets & Celebrations */}
      {giftSetProducts.length > 0 && (
        <ProductShelfRow
          title={isArabic ? "صناديق هدايا ومجموعات راقية" : "Curated Gift Sets & Celebrations"}
          subtitle={
            isArabic
              ? "باقات وتنسيقات جاهزة للإهداء ومعدة لإسعاد أحبائك"
              : "Thoughtfully assembled bundles and keepsake boxes ready to delight"
          }
          viewAllHref="/gifts"
          viewAllText={isArabic ? "عرض الكل" : "View all"}
          products={giftSetProducts}
          dict={dict}
        />
      )}

      {/* 10. Maker Spotlight ("Meet the Makers" / Real Egyptian Studios) */}
      <ArtisanSpotlightSection artisans={featuredArtisans} dict={dict} />

      {/* 11. Seller Recruitment Banner ("Sell on Giftisan" / 0% Platform Fees) */}
      <ArtisanRecruitmentBanner dict={dict} />

      {/* 12. Mission Statement & Value Pillars Bar (Etsy Signature Human Commerce Section) */}
      <MissionStatementBar dict={dict} />

      {/* 13. Newsletter Club */}
      <section
        id="newsletter"
        className="py-16 md:py-20 bg-primary text-white overflow-hidden relative border-t border-white/10"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 text-center space-y-5 md:space-y-6">
          <h2 className="text-2xl md:text-4xl font-heading font-bold">
            {dict?.home?.waitlist_title || (isArabic ? "انضم إلى مجتمع جيفتيزان" : "Join the Giftisan Circle")}
          </h2>
          <p className="text-white/75 max-w-xl mx-auto text-xs md:text-base text-balance leading-relaxed">
            {dict?.home?.waitlist_desc ||
              (isArabic
                ? "اشترك لتصلك أحدث الإبداعات اليدوية وقصص الحرفيين والعروض الخاصة أولاً بأول."
                : "Subscribe to discover new collection drops, authentic artisan stories, and exclusive offers delivered to your inbox.")}
          </p>
          <div className="pt-2">
            <NewsletterForm dict={dict} />
          </div>
        </div>

        {/* Subtle Ambient Blobs */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-96 h-96 bg-primary-light/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </section>

      {/* 14. Minimal Footer */}
      <footer className="py-8 bg-cream border-t border-primary/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 overflow-hidden rounded-md">
              <BespokeImage
                src="/icon.png"
                alt="Giftisan Logo"
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-base font-heading font-bold text-primary">Giftisan</span>
            <span className="text-charcoal/40 text-xs ps-2">
              © {new Date().getFullYear()} Giftisan.{" "}
              {dict?.home?.proudly_handcrafted || "Proudly Handcrafted in Egypt"}.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-charcoal/50">
            <Link href="/terms" className="hover:text-primary transition-colors">
              {dict?.common?.terms || "Terms"}
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {dict?.common?.privacy || "Privacy"}
            </Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">
              {dict?.common?.shipping || "Shipping"}
            </Link>
            <Link href="/refund" className="hover:text-primary transition-colors">
              {dict?.common?.refund || "Refund"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
