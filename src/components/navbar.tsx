"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu, X, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useNotifications } from "./notification-provider";
import { useFavorites } from "@/context/favorites-context";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { searchProducts } from "@/lib/actions";
import { PreLaunchBanner } from "./pre-launch-banner";
import { VerificationBanner } from "./verification-banner";
import { toast } from "react-hot-toast";

import { getDictionary } from "@/app/[lang]/dictionaries";

export function Navbar({ dict }: { dict?: any }) {
  // Safe fallback if dict is not provided
  const d = dict || {
    common: {
      search: "Search products, artisans, crafts...",
      categories: "Categories",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      home: "Home",
      artisans: "Artisans",
      manage_profile: "Manage Profile",
      support: "Support",
      become_artisan: "Apply to Join",
      open_studio: "Open Your Studio",
      start_shopping: "Start Shopping",
      search_placeholder: "Search for unique gifts...",
      explore_trending: "Explore Trending Treasures",
      all_categories: "Browse All Categories",
      sell: "Sell",
      pro_studio: "Pro Studio",
      sign_in: "Sign In",
      sign_out: "Sign Out",
      menu: "Menu",
      explore: "Explore Treasures",
      terms: "Terms of Service",
      privacy: "Privacy Policy"
    }
  };
  const { data: session, update } = useSession();
  const { setIsCartOpen, totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "EmailVerified") {
      toast.success(d.home.verified_toast || "Identity verified! Your account is now fully active.", {
        id: "global-verified",
        duration: 5000
      });
      update();

      // Clean up URL to prevent re-triggering on refresh
      const newUrl = pathname;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    }
  }, [searchParams, update, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


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
    <div className="sticky top-0 z-50 w-full">
      <PreLaunchBanner dict={d} />
      <VerificationBanner dict={d} />
      <nav className="w-full glass border-b border-primary/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden shadow-lg shadow-primary/5 rounded-md">
              <Image
                src="/icon.png"
                alt="Giftisan Logo"
                fill
                className="object-cover"
                sizes="40px"
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
                placeholder={d.common.search_placeholder}
                className="w-full h-12 ps-12 pe-10 bg-white border border-primary/20 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-primary font-medium placeholder:text-primary/50 transition-all shadow-inner"
              />
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5 group-focus-within:text-accent transition-colors" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Quick Results Overlay */}
            {showResults && (
              <div className="absolute top-full start-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-primary/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {!searchQuery ? (
                  /* Empty Search State - Trending discovered */
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center bg-accent/5 p-4 rounded-2xl border border-accent/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Search className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">{d.common.discovery_mode}</p>
                          <p className="text-sm font-bold text-primary">{d.common.explore_trending}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] ms-1">{d.common.popular_collections}</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(d.common.trending_tags || {}).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => {
                              const searchLabel = label as string;
                              setSearchQuery(searchLabel);
                              router.push(`/search?q=${encodeURIComponent(searchLabel)}`);
                              setShowResults(false);
                            }}
                            className="px-4 py-2 rounded-full bg-cream text-primary/60 text-xs font-bold border border-primary/5 hover:bg-accent/5 hover:text-accent hover:border-accent/20 transition-all uppercase tracking-wider"
                          >
                            {label as string}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-primary/5">
                      <Link
                        href="/categories"
                        onClick={() => setShowResults(false)}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-primary">{d.common.all_categories}</span>
                        </div>
                        <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-primary/5 flex justify-between items-center bg-cream/30">
                      <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{d.common.gifts_for_you}</span>
                      <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded-full">
                        {isSearching ? d.common.searching : d.common.items_found.replace('{count}', searchResults.length.toString())}
                      </span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setShowResults(false)}
                            className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-all group border-b border-primary/5 last:border-0"
                          >
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-primary/5">
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="56px" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-heading font-bold text-primary group-hover:text-accent transition-colors">{p.name}</h4>
                                <span className="text-sm font-bold text-primary">EGP {p.price}</span>
                              </div>
                              <p className="text-xs text-charcoal/40 font-medium">
                                {p.artisan.user?.name || p.artisan.studioName} • {p.category}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : !isSearching ? (
                        <div className="p-8 text-center space-y-6">
                          <div className="space-y-2">
                            <p className="text-charcoal/40 font-medium italic">"{d.common.nothing_matches.replace('{query}', searchQuery)}"</p>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] text-accent font-black uppercase tracking-widest">{d.common.try_trending}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                              {["gift_guides", "art_prints", "minimalist"].map(tagKey => {
                                const tagLabel = (d.common.trending_tags?.[tagKey]) || tagKey;
                                return (
                                  <button
                                    key={tagKey}
                                    onClick={() => {
                                      setSearchQuery(tagLabel);
                                      router.push(`/search?q=${encodeURIComponent(tagLabel)}`);
                                      setShowResults(false);
                                    }}
                                    className="px-3 py-1.5 rounded-full bg-cream text-primary/40 text-[10px] font-bold border border-primary/5 hover:text-accent uppercase tracking-tighter"
                                  >
                                    {tagLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-charcoal/40 animate-pulse">
                          {d.common.scanning_workshop}
                        </div>
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="p-3 bg-primary/5 text-center">
                        <button
                          onClick={handleSearch}
                          className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] hover:text-accent transition-colors"
                        >
                          {d.common.see_all_results} →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            <Link href="/favorites" className="hidden md:block p-2 text-charcoal/60 hover:text-primary transition-colors relative active:scale-90">
              <Heart className="w-6 h-6" />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -end-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalFavorites}
                </span>
              )}
            </Link>
            {session && (
              <Link href="/profile/messages" className="hidden md:block relative p-2 text-charcoal/60 hover:text-primary transition-colors active:scale-90">
                <MessageSquare className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            {session ? (
              <div className="flex items-center gap-3">
                {/* Contextual Action Badge (Studio or Sell) */}
                {session.user?.role === "ARTISAN" ? (
                  <Link
                    href="/studio"
                    className={cn(
                      "hidden lg:flex items-center gap-2 h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm active:scale-95",
                      pathname === "/studio"
                        ? "bg-primary text-white"
                        : "bg-accent/10 text-accent hover:bg-accent hover:text-white"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", pathname === "/studio" ? "bg-white" : "bg-accent")} />
                    {d.common.pro_studio}
                  </Link>
                ) : (
                  <Link
                    href="/become-artisan"
                    className="hidden lg:flex items-center h-9 px-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full hover:bg-primary-light transition-all shadow-md shadow-primary/10 active:scale-95"
                  >
                    {d.common.sell}
                  </Link>
                )}

                {/* Consolidated Profile Hub (Desktop only) */}
                <div className="hidden lg:flex items-center gap-2 border-l border-primary/10 ps-3">
                  <Link
                    href="/profile"
                    className="group flex items-center gap-3 ps-1 pe-3 py-1 rounded-full hover:bg-primary/5 transition-all border border-transparent hover:border-primary/5 active:scale-95"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white ring-1 ring-primary/10 shadow-sm group-hover:ring-accent/40 transition-all">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <div className="w-full h-full bg-cream flex items-center justify-center">
                          <User className="w-4 h-4 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-0.5">{d.common.account}</p>
                      <p className="text-[12px] font-bold text-primary leading-none group-hover:text-accent transition-colors truncate max-w-[80px]">
                        {session.user?.name?.split(' ')[0]}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 text-charcoal/30 hover:text-red-500 transition-colors group active:scale-90"
                    title={d.common.sign_out}
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex group items-center gap-2 h-10 px-5 border border-primary/10 rounded-full text-charcoal/60 hover:text-primary hover:border-primary/30 transition-all bg-white shadow-sm active:scale-95"
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{d.common.sign_in}</span>
              </Link>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-charcoal/70 hover:text-primary transition-colors relative active:scale-90"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -end-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300 shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-charcoal/70 hover:text-primary transition-colors active:scale-90"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 ms-2 ps-2 border-s border-primary/10">
              <Link 
                href={pathname.replace(/^\/(en|ar)/, pathname.startsWith('/en') ? '/ar' : '/en')}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${pathname.startsWith('/en') ? 'ar' : 'en'}; path=/; max-age=31536000`;
                }}
                className="text-xs font-black uppercase tracking-widest text-primary/40 hover:text-accent transition-colors active:scale-90"
              >
                {pathname.startsWith('/en') ? 'عربي' : 'EN'}
              </Link>
            </div>
          </div>
        </div>
        {/* Categories Bar - Desktop */}
        <div className="hidden md:block border-t border-primary/5 py-3">
          <div className="container mx-auto px-4 flex justify-between">
            {[
              { id: "ceramics", label: d.common.ceramics },
              { id: "jewelry", label: d.common.jewelry },
              { id: "wedding", label: d.common.wedding },
              { id: "personalized", label: d.common.personalized },
              { id: "art-collectibles", label: d.common.art_collectibles },
              { id: "vintage", label: d.common.vintage },
              { id: "stationery", label: d.common.stationery }
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="text-sm font-medium text-charcoal/60 hover:text-primary hover:underline decoration-accent decoration-2 underline-offset-8 transition-all"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-charcoal/60 backdrop-blur-md z-[60] md:hidden transition-all duration-500",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "absolute end-0 top-0 h-[100dvh] w-[80%] max-w-sm bg-cream shadow-2xl transition-transform duration-500 flex flex-col",
          isMenuOpen ? "translate-x-0" : (pathname.startsWith('/ar') ? "-translate-x-full" : "translate-x-full")
        )}>
          <div className="p-6 border-b border-primary/10 flex justify-between items-center">
            <span className="font-heading font-black text-primary text-xl">{d.common.menu}</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Mobile Search */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{d.common.find_treasure}</p>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={d.common.search_placeholder}
                  className="w-full h-12 ps-12 pe-4 bg-white border border-primary/20 rounded-2xl text-primary font-medium"
                />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              </form>
            </div>

            {/* User Specific Links */}
            {session ? (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{d.common.your_studio_hub}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-primary/5 text-center"
                  >
                    <User className="w-5 h-5 text-primary/40 mb-2" />
                    <span className="text-xs font-bold text-primary uppercase">{d.common.profile}</span>
                  </Link>
                  <Link
                    href="/profile/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-primary/5 text-center"
                  >
                    <MessageSquare className="w-5 h-5 text-primary/40 mb-2" />
                    <span className="text-xs font-bold text-primary uppercase">{d.common.messages}</span>
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-primary/5 text-center"
                  >
                    <Heart className="w-5 h-5 text-primary/40 mb-2" />
                    <span className="text-xs font-bold text-primary uppercase">{d.common.favorites}</span>
                  </Link>
                  {session.user?.role === "ARTISAN" ? (
                    <Link
                      href="/studio"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 bg-accent/5 rounded-2xl border border-accent/10 text-center active:scale-95 transition-transform"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mb-2" />
                      <span className="text-xs font-black text-accent uppercase">{d.common.studio}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/become-artisan"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center justify-center p-4 bg-primary text-white rounded-2xl border border-primary text-center active:scale-95 transition-transform"
                    >
                      <span className="text-xs font-black uppercase tracking-widest">{d.common.sell}</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{d.common.join_the_circle}</p>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 text-primary font-bold active:scale-95 transition-transform"
                >
                  {d.common.sign_in}
                  <span className="text-accent">→</span>
                </Link>
              </div>
            )}

            {/* Mobile Categories */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{d.common.categories}</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "ceramics", label: d.common.ceramics },
                  { id: "jewelry", label: d.common.jewelry },
                  { id: "wedding", label: d.common.wedding },
                  { id: "personalized", label: d.common.personalized },
                  { id: "art-collectibles", label: d.common.art_collectibles },
                  { id: "vintage", label: d.common.vintage },
                  { id: "stationery", label: d.common.stationery }
                ].map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-between items-center p-4 bg-white rounded-2xl border border-primary/5 text-primary font-bold hover:bg-primary/5 transition-colors active:scale-[0.98] transition-transform"
                  >
                    {cat.label}
                    <span className="text-accent">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-primary/10 bg-primary/5 space-y-4">
            {!session ? (
              <>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full h-12 bg-primary text-white font-bold rounded-xl flex items-center justify-center shadow-lg"
                >
                  {d.common.join_the_circle}
                </Link>
                <p className="text-xs text-charcoal/40 text-center italic">{d.common.crafted_for_community}</p>
              </>
            ) : (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full h-12 border border-red-100 bg-red-50/50 text-red-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {d.common.sign_out}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

