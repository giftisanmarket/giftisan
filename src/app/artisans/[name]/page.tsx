"use client";

import { useParams } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ShieldCheck, Share2, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function ArtisanProfile() {
  const params = useParams();
  const nameSlug = params.name as string;
  
  // Find products by this artisan
  const products = MOCK_PRODUCTS.filter(
    p => p.artisan.name.toLowerCase().replace(/ /g, "-") === nameSlug
  );

  const artisan = products[0]?.artisan || {
    name: "Master Artisan",
    location: "Global Studio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan",
    bio: "Crafting beautiful stories through traditional techniques."
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Profile Header */}
      <section className="pt-32 pb-20 bg-cream relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl shadow-primary/10 rotate-3 group"
            >
              <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="text-5xl font-heading font-bold text-primary">{artisan.name}</h1>
                <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Verified Artisan</span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-6 text-charcoal/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{artisan.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-bold text-primary">4.9 (1.2k Sales)</span>
                </div>
              </div>

              <p className="text-xl text-charcoal/70 leading-relaxed max-w-2xl serif">
                "{artisan.bio}"
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <button className="h-12 px-8 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-lg">
                  Follow
                </button>
                <button className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 transition-colors">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 text-primary"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </button>
                <button className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 transition-colors">
                  <Globe className="w-5 h-5 text-primary" />
                </button>
                <button className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 transition-colors">
                  <Share2 className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Stats Bar */}
      <div className="border-y border-primary/5 bg-white py-8">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-8">
          <div className="flex-1 min-w-[150px] text-center border-r border-primary/5 last:border-0">
            <p className="text-3xl font-heading font-bold text-primary">124</p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Creations</p>
          </div>
          <div className="flex-1 min-w-[150px] text-center border-r border-primary/5 last:border-0">
            <p className="text-3xl font-heading font-bold text-primary">2.4k</p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Followers</p>
          </div>
          <div className="flex-1 min-w-[150px] text-center border-r border-primary/5 last:border-0">
            <p className="text-3xl font-heading font-bold text-primary">12</p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Years Experience</p>
          </div>
          <div className="flex-1 min-w-[150px] text-center last:border-0">
            <p className="text-3xl font-heading font-bold text-primary">99%</p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Positive Feedback</p>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-heading font-bold text-primary">In the Studio</h2>
            <p className="text-charcoal/60 mt-2">Currently available works and one-of-a-kind treasures.</p>
          </div>
          <div className="flex gap-4">
            <button className="text-sm font-bold text-primary hover:underline">Available Now</button>
            <span className="text-primary/20">|</span>
            <button className="text-sm font-bold text-charcoal/40 hover:text-primary">Sold Out</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/products/${product.id}`} className="group block">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden mb-6 shadow-2xl shadow-primary/5 border border-primary/5">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary group-hover:text-accent transition-colors">{product.name}</h3>
                <p className="text-lg font-bold text-primary mt-1">${product.price}.00</p>
              </Link>
            </motion.div>
          ))}
          
          {/* Custom Request Card */}
          <div className="aspect-square rounded-[3rem] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center p-8 text-center bg-cream/20 group hover:border-accent/40 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary mb-2">Custom Request</h3>
            <p className="text-sm text-charcoal/60 mb-6">Have a specific vision? Collaborate with {artisan.name.split(' ')[0]} to create a custom piece.</p>
            <button className="text-sm font-black text-accent uppercase tracking-widest hover:text-primary">Start a Chat →</button>
          </div>
        </div>
      </section>

      {/* Footer (Simple) */}
      <footer className="py-12 bg-cream/30 border-t border-primary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">© 2026 Giftisan • Supporting Global Craftsmanship</p>
        </div>
      </footer>
    </main>
  );
}
