"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import Link from "next/link";
import {
  Heart, ArrowRight, CheckCircle2,
  Leaf, Trophy, Palette,
  Gem, PencilLine, Radio,
  Scissors, Hammer, Shapes,
  Sparkles, ShoppingBag
} from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BespokeImage } from "@/components/bespoke-image";
import { NewsletterForm } from "@/components/newsletter-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

interface CategoryCount {
  name: string;
  count: number;
}

interface HomeClientProps {
  products: any[];
  artisans: any[];
  categoryCounts: CategoryCount[];
  artisanCount: number;
}

export default function HomeClient({ products, artisans, categoryCounts, artisanCount }: HomeClientProps) {
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
    <main className="min-h-screen bg-cream">
      <Navbar />
      <Hero artisanCount={artisanCount} />

      {/* Featured Treasures */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary italic serif">Treasures of the Week</h2>
            <p className="text-charcoal/60 mt-2">Curated by our expert artisans for the perfect gift.</p>
          </div>
          <Link
            href="/search"
            className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2 group decoration-accent decoration-2 underline-offset-4"
          >
            Shop All Collections
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
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl border border-primary/5">
                      {product.badge}
                    </div>
                  )}

                  {/* Actions Layer */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={cn(
                        "p-3 rounded-full transition-all scale-90 active:scale-75 shadow-lg",
                        isFavorite(product.id)
                          ? "bg-red-50 text-red-500"
                          : "bg-white/80 backdrop-blur text-primary opacity-0 group-hover:opacity-100 hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, undefined, true);
                        toast.success(`${product.name} added to cart!`, {
                          icon: '🏺',
                          style: {
                            borderRadius: '1rem',
                            background: '#1A2E2A',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          },
                        });
                      }}
                      className="p-3 rounded-full bg-accent text-white shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent-light active:scale-75"
                    >
                      <ShoppingBag className="w-5 h-5" />
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
              <p className="font-heading font-bold text-primary mt-2">EGP {product.price}.00</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">Browse by Category</h2>
            <p className="text-charcoal/60 mt-2">Find the perfect gift for every personality</p>
          </div>
          <Link
            href="/categories"
            className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2 group decoration-accent decoration-2 underline-offset-4"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoryCounts.slice(0, 6).map((cat) => {
            const icons: Record<string, any> = {
              "Ceramics": Shapes,
              "Jewelry": Gem,
              "Stationery": PencilLine,
              "Vintage": Radio,
              "Textiles": Scissors,
              "Woodwork": Hammer,
              "Wedding": Heart,
              "Personalized": Sparkles,
              "Art & Collectibles": ShoppingBag,
            };
            const Icon = icons[cat.name] || ShoppingBag;

            return (
              <Link
                key={cat.name}
                href={`/category/${cat.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="group cursor-pointer aspect-square bg-white border border-primary/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="block font-heading font-bold text-primary text-sm tracking-tight">{cat.name}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 group-hover:text-accent transition-colors">
                    {cat.count} Items
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary/5 py-16 border-y border-primary/5">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Direct from Artisans",
              desc: "Support independent local creators. Every purchase goes directly to the artist behind the work.",
              icon: Palette
            },
            {
              title: "Curated Excellence",
              desc: "Every item is vetted for quality and originality. We only feature the best in handmade crafts.",
              icon: Trophy
            },
            {
              title: "Sustainable Gifting",
              desc: "Eco-friendly packaging and ethical sourcing. Beautiful gifts that don't cost the earth.",
              icon: Leaf
            },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-left space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-accent shadow-sm mx-auto md:mx-0">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-primary text-xl">{item.title}</h3>
              <p className="text-charcoal/60 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artisan Spotlight */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Meet the <span className="serif italic font-normal text-accent">Masters</span></h2>
            <p className="text-charcoal/60 max-w-lg">The hands and hearts behind your favorite treasures.</p>
          </div>
          <Link href="/artisans" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group">
            View All Studios
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
                        <BespokeImage src={artisan.avatar} alt={artisan.user.name} fill className="object-cover" />
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
                      <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Master Artisan</span>
                      <div className="w-10 h-10 rounded-full bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
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
      <section id="newsletter" className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold">Join the Giftisan Waitlist</h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg text-balance">
            Be the first to know when we launch! Secure your spot in our Inner Circle for exclusive early access and grand opening surprises.
          </p>
          <NewsletterForm />
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cream border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
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
            © 2026 Giftisan. Proudly Handcrafted. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/terms" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
