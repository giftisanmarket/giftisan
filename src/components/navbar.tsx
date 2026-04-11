"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/data";
import Image from "next/image";

export function Navbar() {
  const { setIsCartOpen, totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.artisan.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-primary/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative w-10 h-10 overflow-hidden shadow-lg shadow-primary/5 rounded-lg">
            <Image
              src="/icon.png"
              alt="Giftisan Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-heading font-black text-primary tracking-tighter">
            Giftisan
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search for unique gifts..."
              className="w-full h-12 pl-12 pr-10 bg-white border border-primary/20 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-primary font-medium placeholder:text-primary/50 transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5 group-focus-within:text-accent transition-colors" />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Quick Results Overlay */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-primary/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-primary/5 flex justify-between items-center bg-cream/30">
                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Gifts for You</span>
                <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded-full">{filteredProducts.length} items found</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-all group border-b border-primary/5 last:border-0"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-primary/5">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-bold text-primary group-hover:text-accent transition-colors">{p.name}</h4>
                          <span className="text-sm font-bold text-primary">${p.price}</span>
                        </div>
                        <p className="text-xs text-charcoal/40 font-medium">{p.artisan.name} • {p.category}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <p className="text-charcoal/40 font-medium italic">"Nothing matches your search yet..."</p>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Try "Vase" or "Gold"</p>
                  </div>
                )}
              </div>

              {filteredProducts.length > 0 && (
                <div className="p-3 bg-primary/5 text-center">
                  <button className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] hover:text-accent transition-colors">
                    See All Results →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/favorites" className="p-2 text-charcoal/60 hover:text-primary transition-colors relative">
            <Heart className="w-6 h-6" />
            {totalFavorites > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {totalFavorites}
              </span>
            )}
          </Link>
          <button className="p-2 text-charcoal/60 hover:text-primary transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-charcoal/70 hover:text-primary transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-charcoal/70 hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Categories Bar - Desktop */}
      <div className="hidden md:block border-t border-primary/5 py-3">
        <div className="container mx-auto px-4 flex justify-between">
          {[
            "Ceramics", "Jewelry", "Wedding", "Personalized", "Art & Collectibles", "Vintage", "Stationery"
          ].map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase().replace(/ & /g, "-")}`}
              className="text-sm font-medium text-charcoal/60 hover:text-primary hover:underline decoration-accent decoration-2 underline-offset-8 transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
