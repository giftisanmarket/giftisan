"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import Link from "next/link";
import {
  Heart, ArrowRight, CheckCircle2,
  Leaf, Trophy, Palette,
  Gem, PencilLine, History,
  Scissors, Hammer, Shapes,
  Sparkles, ShoppingBag, Package,
  Shirt, Brush, Utensils,
  Flame, Grid, Briefcase,
  Wand2, Lightbulb
} from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BespokeImage } from "@/components/bespoke-image";
import { NewsletterForm } from "@/components/newsletter-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const categoryImageMap: Record<string, string> = {
  // English Names & Slugs
  "gift-boxes-sets": "/images/categories/gift-boxes-sets.png",
  "gift boxes & sets": "/images/categories/gift-boxes-sets.png",
  "jewelry": "/images/categories/jewelry.png",
  "ceramics": "/images/categories/ceramics.png",
  "woodwork": "/images/categories/woodwork.png",
  "textiles": "/images/categories/textiles.png",
  "fashion": "/images/categories/fashion.png",
  "art-collectibles": "/images/categories/art-collectibles.png",
  "art & collectibles": "/images/categories/art-collectibles.png",
  "personalized": "/images/categories/personalized.png",
  "wedding": "/images/categories/wedding.png",
  "vintage": "/images/categories/vintage.png",
  "stationery": "/images/categories/stationery.png",
  "metalwork": "/images/categories/metalwork.png",
  "beauty-apothecary": "/images/categories/beauty-apothecary.png",
  "beauty & apothecary": "/images/categories/beauty-apothecary.png",
  "leatherwork": "/images/categories/fashion.png",
  "culinary-arts": "/images/categories/gift-boxes-sets.png",
  "basketry": "/images/categories/textiles.png",
  "glasswork": "/images/categories/ceramics.png",

  // Arabic Names
  "مجموعات الهدايا": "/images/categories/gift-boxes-sets.png",
  "صناديق وهدايا": "/images/categories/gift-boxes-sets.png",
  "مجوهرات": "/images/categories/jewelry.png",
  "خزف وفخار": "/images/categories/ceramics.png",
  "خزف": "/images/categories/ceramics.png",
  "أعمال خشبية": "/images/categories/woodwork.png",
  "خشبيات": "/images/categories/woodwork.png",
  "منسوجات": "/images/categories/textiles.png",
  "أزياء وموضة": "/images/categories/fashion.png",
  "أزياء": "/images/categories/fashion.png",
  "الأزياء": "/images/categories/fashion.png",
  "فنون ومقتنيات": "/images/categories/art-collectibles.png",
  "فن ومقتنيات": "/images/categories/art-collectibles.png",
  "منتجات حسب الطلب": "/images/categories/personalized.png",
  "هدايا مخصصة": "/images/categories/personalized.png",
  "هدايا الزفاف": "/images/categories/wedding.png",
  "زفاف": "/images/categories/wedding.png",
  "عتيق": "/images/categories/vintage.png",
  "قرطاسية": "/images/categories/stationery.png",
  "أعمال معادن": "/images/categories/metalwork.png",
  "جمال وعناية": "/images/categories/beauty-apothecary.png",
  "منتجات جلدية": "/images/categories/fashion.png",
  "فنون الطهي": "/images/categories/gift-boxes-sets.png",
  "الخوص والسلال": "/images/categories/textiles.png",
  "أعمال الزجاج": "/images/categories/ceramics.png",
};

function getCategoryCoverImage(name: string, slug: string): string {
  const cleanName = (name || "").toLowerCase().trim();
  const cleanSlug = (slug || "").toLowerCase().trim();

  return (
    categoryImageMap[name] ||
    categoryImageMap[cleanName] ||
    categoryImageMap[slug] ||
    categoryImageMap[cleanSlug] ||
    "/images/categories/gift-boxes-sets.png"
  );
}

interface CategoryCount {
  name: string;
  count: number;
}

interface HomeClientProps {
  products: any[];
  artisans: any[];
  categoryCounts: CategoryCount[];
  artisanCount: number;
  dict: any;
}

export default function HomeClient({ products, artisans, categoryCounts, artisanCount, dict }: HomeClientProps) {
  const { data: session } = useSession();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    if (window.location.hash === "#newsletter") {
      const element = document.getElementById("newsletter");
      if (element) {
        // Delay slightly to ensure layout is finished
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

      {/* Featured Treasures */}
      <section className="py-16 md:py-20 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary italic serif">{dict.home.treasures_week}</h2>
            <p className="text-charcoal/60 mt-2">{dict.home.treasures_desc}</p>
          </div>
          <Link
            href="/products"
            className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2 group decoration-accent decoration-2 underline-offset-4"
          >
            {dict.home.shop_all_collections}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer block"
            >
              <Link href={`/products/${product.slug || product.id}`}>
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl shadow-primary/5 border border-primary/5">
                  <BespokeImage
                    type="product"
                    id={product.id}
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {product.badge && (
                    <div className="absolute top-4 start-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl border border-primary/5">
                      {product.badge}
                    </div>
                  )}

                  {/* Actions Layer */}
                  <div className="absolute top-4 end-4 z-10 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={cn(
                        "p-3 rounded-full transition-all scale-90 active:scale-75 shadow-lg",
                        isFavorite(product.id)
                          ? "bg-red-50 text-red-500 opacity-100"
                          : "bg-white/90 backdrop-blur text-primary xl:opacity-0 xl:group-hover:opacity-100 opacity-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
                    </button>
                  </div>
                </div>
              </Link>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                {product.artisan.studioName || product.artisan.user.name}
              </p>
              <h3 className="text-xl font-heading font-bold text-primary group-hover:text-accent transition-colors">
                <Link href={`/products/${product.slug || product.id}`}>{product.name}</Link>
              </h3>
              <p className="font-heading font-bold text-primary mt-2">{dict.product.currency} {product.price}.00</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-16 md:py-20 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{dict.home.browse_category}</h2>
            <p className="text-charcoal/60 mt-2">{dict.home.category_desc}</p>
          </div>
          <Link
            href="/categories"
            className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2 group decoration-accent decoration-2 underline-offset-4"
          >
            {dict.home.view_all_categories}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categoryCounts.slice(0, 12).map((cat) => {
            const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
            const imageUrl = getCategoryCoverImage(cat.name, slug);
            const categoryTitle = dict.common.categories_list?.[slug] || cat.name;

            return (
              <Link
                key={cat.name}
                href={`/category/${slug}`}
                className="group relative block aspect-[4/3] sm:aspect-square bg-white border border-primary/5 rounded-3xl overflow-hidden shadow-md shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all"
              >
                <BespokeImage
                  src={imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                <div className="absolute top-3 start-3 z-10 px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-wider shadow-sm">
                  {cat.count} {cat.count === 1 ? (dict.common.treasure_single || "Treasure") : (dict.common.treasure_plural || "Treasures")}
                </div>

                <div className="absolute bottom-4 inset-x-4 z-10 text-white flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-white text-sm md:text-base tracking-tight truncate group-hover:text-accent-light transition-colors">
                    {categoryTitle}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-accent group-hover:scale-110 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary/5 py-16 border-y border-primary/5 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 grid md:grid-cols-3 gap-12">
          {[
            {
              title: dict.home.direct_artisans,
              desc: dict.home.direct_artisans_desc,
              icon: Palette
            },
            {
              title: dict.home.curated_excellence,
              desc: dict.home.curated_excellence_desc,
              icon: Trophy
            },
            {
              title: dict.home.sustainable_gifting,
              desc: dict.home.sustainable_gifting_desc,
              icon: Leaf
            },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-start space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-accent shadow-sm mx-auto md:mx-0">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-primary text-xl">{item.title}</h3>
              <p className="text-charcoal/60 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">{(dict.home.meet_masters_base || dict.home.meet_masters.split('Makers')[0])}{' '}<span className="serif italic font-normal text-accent">{(dict.home.meet_masters_accent || (dict.home.meet_masters.includes('Masters') ? 'Masters' : 'المبدعين'))}</span></h2>
            <p className="text-charcoal/60 max-w-lg">{dict.home.meet_masters_desc}</p>
          </div>
          <Link href="/artisans" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group">
            {dict.home.view_studios}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-8 px-4 pt-4 overflow-x-auto pb-8 snap-x no-scrollbar">
            {artisans.map((artisan, idx) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 snap-center"
              >
                <Link href={`/artisans/${artisan.slug || artisan.user.name.toLowerCase().replace(/ /g, "-")}`} className="group block h-full">
                  <div className="bg-cream rounded-[3rem] p-8 border border-primary/5 shadow-xl shadow-primary/5 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <BespokeImage 
                          type="artisan"
                          id={artisan.id}
                          src={artisan.avatar} 
                          alt={artisan.user.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-heading font-bold text-primary">{artisan.studioName || artisan.user.name}</h3>
                      {artisan.isVerified && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </div>
                    <p className="text-xs text-accent font-black uppercase tracking-[0.2em] mb-4">{artisan.location}</p>
                    <p className="text-charcoal/60 text-sm leading-relaxed mb-8 flex-1 italic group-hover:text-charcoal transition-colors">
                      "{artisan.bio}"
                    </p>

                    <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{dict.product.master_artisan}</span>
                    <div className="w-10 h-10 rounded-full bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm xl:opacity-0 xl:group-hover:opacity-100 opacity-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Newsletter */}
      <section id="newsletter" className="py-24 bg-primary text-white overflow-hidden relative border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold">{dict.home.waitlist_title}</h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg text-balance">
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

