"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/home/product-card";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Trophy,
  Palette
} from "lucide-react";
import { BespokeImage } from "@/components/bespoke-image";
import { NewsletterForm } from "@/components/newsletter-form";
import { useEffect } from "react";

interface HomeClientProps {
  featuredProducts?: any[];
  products?: any[]; // backwards compatibility fallback
  personalizedProducts?: any[];
  textileFashionProducts?: any[];
  homeDecorProducts?: any[];
  artisanCount?: number;
  dict: any;
}

export default function HomeClient({
  featuredProducts,
  products,
  personalizedProducts = [],
  textileFashionProducts = [],
  homeDecorProducts = [],
  artisanCount,
  dict
}: HomeClientProps) {
  const mainProducts = featuredProducts || products || [];

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
    <main className="min-h-screen bg-cream relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#064e3b08_1px,transparent_1px),linear-gradient(to_bottom,#064e3b08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      <Navbar dict={dict} />
      <Hero artisanCount={artisanCount} dict={dict} />

      {/* 1. Featured Products / Treasures of the Week */}
      {mainProducts.length > 0 && (
        <section className="py-10 md:py-16 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary italic serif">
                {dict.home.treasures_week || "Products of the Week"}
              </h2>
              <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                {dict.home.treasures_desc || "Curated by our expert artisans for the perfect gift."}
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1.5 group text-xs md:text-sm shrink-0 underline-offset-4 decoration-accent decoration-2"
            >
              <span>{dict.home.shop_all_collections || "Shop All Collections"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {mainProducts.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Personalized & Bespoke Gifts */}
      {personalizedProducts.length > 0 && (
        <section className="py-10 md:py-16 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 border-t border-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary italic serif">
                {dict.home.personalized_section_title || "Personalized & Bespoke Gifts"}
              </h2>
              <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                {dict.home.personalized_section_desc || "One-of-a-kind treasures custom-made with heart for you and your loved ones."}
              </p>
            </div>
            <Link
              href="/search?q=personalized"
              className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1.5 group text-xs md:text-sm shrink-0 underline-offset-4 decoration-accent decoration-2"
            >
              <span>{dict.home.shop_personalized || "Shop Personalized"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {personalizedProducts.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Handcrafted Textiles & Wearables */}
      {textileFashionProducts.length > 0 && (
        <section className="py-10 md:py-16 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 border-t border-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary italic serif">
                {dict.home.textiles_section_title || "Handcrafted Textiles & Wearables"}
              </h2>
              <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                {dict.home.textiles_section_desc || "Authentic fabrics, woven heritage, and contemporary Egyptian fashion."}
              </p>
            </div>
            <Link
              href="/category/textiles"
              className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1.5 group text-xs md:text-sm shrink-0 underline-offset-4 decoration-accent decoration-2"
            >
              <span>{dict.home.shop_textiles || "Shop Textiles & Fashion"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {textileFashionProducts.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Artisan Woodwork & Home Collectibles */}
      {homeDecorProducts.length > 0 && (
        <section className="py-10 md:py-16 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 border-t border-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary italic serif">
                {dict.home.homedecor_section_title || "Artisan Woodwork & Home Collectibles"}
              </h2>
              <p className="text-charcoal/60 text-xs md:text-sm mt-1">
                {dict.home.homedecor_section_desc || "Transform your space with timeless carved wood and fine handmade decor."}
              </p>
            </div>
            <Link
              href="/category/woodwork"
              className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1.5 group text-xs md:text-sm shrink-0 underline-offset-4 decoration-accent decoration-2"
            >
              <span>{dict.home.shop_homedecor || "Shop Home & Living"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {homeDecorProducts.map((product) => (
              <ProductCard key={product.id} product={product} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* Trust Bar */}
      <section className="bg-primary/5 py-14 md:py-16 border-y border-primary/5 relative z-10 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 grid md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              title: dict.home.direct_artisans || "Direct from Artisans",
              desc: dict.home.direct_artisans_desc || "Support independent local creators. Every purchase goes directly to the artist behind the work.",
              icon: Palette
            },
            {
              title: dict.home.curated_excellence || "Curated Excellence",
              desc: dict.home.curated_excellence_desc || "Every item is vetted for quality and originality. We only feature the best in handmade crafts.",
              icon: Trophy
            },
            {
              title: dict.home.sustainable_gifting || "Sustainable Gifting",
              desc: dict.home.sustainable_gifting_desc || "Eco-friendly packaging and ethical sourcing. Beautiful gifts that don't cost the earth.",
              icon: Leaf
            },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-start space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-accent shadow-sm mx-auto md:mx-0">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-primary text-lg md:text-xl">{item.title}</h3>
              <p className="text-charcoal/60 leading-relaxed text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 md:py-24 bg-primary text-white overflow-hidden relative border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 text-center space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-5xl font-heading font-bold">{dict.home.waitlist_title}</h2>
          <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg text-balance">
            {dict.home.waitlist_desc}
          </p>
          <NewsletterForm dict={dict} />
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 start-0 w-96 h-96 bg-primary-light/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cream border-t border-primary/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="relative w-8 h-8 overflow-hidden rounded-lg">
              <BespokeImage
                src="/icon.png"
                alt="Giftisan Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-xl font-heading font-bold text-primary">Giftisan</span>
          </div>
          <p className="text-charcoal/40 text-sm mb-4">
            © 2026 Giftisan. {dict.home.proudly_handcrafted}. {dict.home.rights_reserved}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-8 gap-y-3">
            <Link href="/terms" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.terms || 'Terms'}</Link>
            <Link href="/shipping" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.shipping || 'Shipping'}</Link>
            <Link href="/refund" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.refund || 'Refund'}</Link>
            <Link href="/privacy" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.privacy || 'Privacy'}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
