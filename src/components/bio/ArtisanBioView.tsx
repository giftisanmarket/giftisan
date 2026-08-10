"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "react-qr-code";
import { 
  CheckCircle2, 
  MapPin, 
  ShoppingBag, 
  ExternalLink, 
  QrCode as QrIcon, 
  Share2, 
  ArrowRight, 
  X, 
  Copy, 
  Check,
  Sparkles,
  Store,
  LayoutGrid,
  Link as LinkIcon
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/cart-context";

interface ProductItem {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  images: string[];
  category: string;
  isFeatured?: boolean;
}

interface BioLinkItem {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  isFeatured: boolean;
  clicks: number;
}

interface ArtisanBioViewProps {
  artisan: {
    id: string;
    studioName: string | null;
    slug: string | null;
    bio: string | null;
    avatar: string | null;
    bannerImage: string | null;
    location: string | null;
    brandColor: string | null;
    isVerified: boolean;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    pinterest?: string | null;
    phoneNumber: string | null;
    user: {
      name: string | null;
    };
    bioLinks: BioLinkItem[];
    products: ProductItem[];
  };
  lang: string;
}

export function ArtisanBioView({ artisan, lang }: ArtisanBioViewProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToCart } = useCart();

  const isRtl = lang === "ar";
  const name = artisan.studioName || artisan.user.name || "Artisan";
  const bioUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/bio/${artisan.slug || artisan.id}`
    : `https://giftisan.com/bio/${artisan.slug || artisan.id}`;

  const featuredProduct = artisan.products.find(p => p.isFeatured) || artisan.products[0];
  const miniGridProducts = artisan.products.slice(0, 4);

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      fetch(`/api/bio-links/${linkId}/click`, { method: "POST" }).catch(() => {});
    } catch {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bioUrl);
    setCopied(true);
    toast.success(isRtl ? "تم نسخ الرابط!" : "Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: artisan.bio || `${name} on Giftisan`,
          url: bioUrl,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#1F2937] flex flex-col items-center justify-between pb-12 relative overflow-hidden font-sans selection:bg-[#064E3B] selection:text-white">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#064E3B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-md px-4 pt-6 pb-8 z-10 flex flex-col items-center gap-5">
        
        {/* Top Utility Bar */}
        <div className="w-full flex justify-between items-center px-1">
          <Link 
            href={`/${lang}`}
            className="flex items-center gap-2 text-xs font-bold text-[#064E3B] hover:text-[#064E3B]/80 transition bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#064E3B]/15 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            Giftisan
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-charcoal hover:text-[#064E3B] border border-[#064E3B]/15 shadow-sm transition"
              title="Show QR Code"
            >
              <QrIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-charcoal hover:text-[#064E3B] border border-[#064E3B]/15 shadow-sm transition"
              title="Share Bio"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center w-full mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-[#064E3B]/20 blur opacity-70 transition duration-500 group-hover:opacity-100" />
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              {artisan.avatar ? (
                <Image
                  src={artisan.avatar}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-cream text-[#064E3B]">
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-heading font-black tracking-tight text-[#064E3B] flex items-center justify-center gap-1.5">
            {name}
            {artisan.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-[#D97706] fill-[#D97706]/15 shrink-0" />
            )}
          </h1>

          {artisan.location && (
            <p className="text-xs text-charcoal/60 font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
              {artisan.location}
            </p>
          )}

          {artisan.bio && (
            <p className="text-xs text-charcoal/80 max-w-sm mt-2.5 leading-relaxed font-medium px-2">
              {artisan.bio}
            </p>
          )}

          {/* Social Bar */}
          <div className="flex items-center gap-3 mt-4">
            {artisan.instagram && (
              <a
                href={artisan.instagram.startsWith("http") ? artisan.instagram : `https://instagram.com/${artisan.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white border border-[#064E3B]/10 shadow-sm text-pink-600 hover:scale-110 transition"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            )}
            {artisan.tiktok && (
              <a
                href={artisan.tiktok.startsWith("http") ? artisan.tiktok : `https://tiktok.com/@${artisan.tiktok}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white border border-[#064E3B]/10 shadow-sm text-slate-800 hover:scale-110 transition"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            )}
            {artisan.facebook && (
              <a
                href={artisan.facebook.startsWith("http") ? artisan.facebook : `https://facebook.com/${artisan.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white border border-[#064E3B]/10 shadow-sm text-blue-600 hover:scale-110 transition"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
            )}
            {artisan.pinterest && (
              <a
                href={artisan.pinterest.startsWith("http") ? artisan.pinterest : `https://pinterest.com/${artisan.pinterest}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white border border-[#064E3B]/10 shadow-sm text-red-600 hover:scale-110 transition"
              >
                <FaPinterest className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Featured Product Spotlight Card */}
        {featuredProduct && (
          <div className="w-full bg-white border border-[#D97706]/30 rounded-2xl p-3.5 shadow-md relative overflow-hidden group">
            <div className="absolute top-2 right-2 z-10 bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3" />
              {isRtl ? "مميز" : "Spotlight"}
            </div>

            <div className="flex gap-3.5 items-center">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream shrink-0 border border-primary/10">
                <Image
                  src={featuredProduct.images[0] || "/icon.png"}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized
                />
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h3 className="text-sm font-bold text-[#064E3B] truncate">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-xs text-[#D97706] font-bold mt-0.5">
                    {featuredProduct.price} EGP
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/${lang}/products/${featuredProduct.slug || featuredProduct.id}`}
                    className="flex-1 bg-cream hover:bg-cream/80 text-[#064E3B] border border-[#064E3B]/15 text-xs py-1.5 rounded-xl text-center font-bold transition"
                  >
                    {isRtl ? "التفاصيل" : "View"}
                  </Link>
                  <button
                    onClick={() => {
                      addToCart(featuredProduct);
                      toast.success(isRtl ? "تمت الإضافة للسلة!" : "Added to bag!");
                    }}
                    className="bg-[#064E3B] hover:bg-[#064E3B]/90 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {isRtl ? "شراء" : "Buy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stack of Core Action Links */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {/* Default Core 1: Shop Full Catalog */}
          <Link
            href={`/${lang}/artisans/${artisan.slug || artisan.id}`}
            className="w-full p-4 rounded-2xl bg-[#064E3B] hover:bg-[#064E3B]/95 text-white flex items-center justify-between transition group shadow-md"
          >
            <span className="flex items-center gap-3 text-sm font-bold">
              <span className="p-2.5 rounded-xl bg-white/10 text-amber-400 group-hover:scale-110 transition">
                <Store className="w-4 h-4" />
              </span>
              {isRtl ? "تصفح متجري الكامل على Giftisan" : "Shop My Full Giftisan Collection"}
            </span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition" />
          </Link>

          {/* Default Core 2: Explore All Categories */}
          <Link
            href={`/${lang}/categories`}
            className="w-full p-4 rounded-2xl bg-white hover:bg-cream/50 border border-[#064E3B]/20 text-[#064E3B] flex items-center justify-between transition group shadow-sm"
          >
            <span className="flex items-center gap-3 text-sm font-bold">
              <span className="p-2.5 rounded-xl bg-[#064E3B]/10 text-[#064E3B] group-hover:scale-110 transition">
                <LayoutGrid className="w-4 h-4" />
              </span>
              {isRtl ? "تصفح جميع أقسام المنتجات اليدوية" : "Explore All Handcrafted Categories"}
            </span>
            <ArrowRight className="w-4 h-4 text-[#064E3B]/50 group-hover:text-[#064E3B] group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Mini Product Showcase (Top 4) */}
        {miniGridProducts.length > 0 && (
          <div className="w-full mt-3">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                {isRtl ? "أحدث الإبداعات اليدوية" : "Top Handcrafted Items"}
              </h2>
              <Link 
                href={`/${lang}/artisans/${artisan.slug || artisan.id}`}
                className="text-xs font-bold text-[#064E3B] hover:underline"
              >
                {isRtl ? "عرض الكل" : "View all"}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {miniGridProducts.map((prod) => (
                <div 
                  key={prod.id}
                  className="bg-white border border-[#064E3B]/10 rounded-2xl p-3 flex flex-col justify-between hover:border-[#064E3B]/30 transition group shadow-sm"
                >
                  <div>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-cream mb-2 border border-primary/5">
                      <Image
                        src={prod.images[0] || "/icon.png"}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        unoptimized
                      />
                    </div>
                    <h4 className="text-xs font-bold text-charcoal line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-bold text-[#D97706] mt-0.5">
                      {prod.price} EGP
                    </p>
                  </div>

                  <Link
                    href={`/${lang}/products/${prod.slug || prod.id}`}
                    className="mt-2 text-center text-[11px] font-bold bg-cream hover:bg-[#064E3B] text-[#064E3B] hover:text-white border border-[#064E3B]/15 py-1.5 rounded-xl transition"
                  >
                    {isRtl ? "عرض" : "View"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding Bar */}
      <footer className="z-10 flex flex-col items-center gap-2 mt-4 text-center px-4">
        <Link 
          href={`/${lang}`}
          className="flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-[#064E3B] transition bg-white px-4 py-2 rounded-full border border-[#064E3B]/15 shadow-sm"
        >
          <span>Powered by</span>
          <span className="font-bold text-[#064E3B]">Giftisan</span>
          <span className="text-[10px] bg-[#D97706]/15 text-[#D97706] font-bold px-1.5 py-0.5 rounded ml-1">
            Verified Creator
          </span>
        </Link>
        <p className="text-[10px] text-charcoal/50 font-medium">
          Discover unique handmade gifts directly from local Egyptian artisans.
        </p>
      </footer>

      {/* Modal: Downloadable QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-primary/10 rounded-[2.5rem] p-6 max-w-xs w-full flex flex-col items-center text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#064E3B]/10 flex items-center justify-center text-[#064E3B] mb-3">
              <QrIcon className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#064E3B]">{name}</h3>
            <p className="text-xs text-charcoal/60 mt-0.5 mb-4">
              Scan to view bio links & shop handmade creations
            </p>

            <div id="artisan-qr-container" className="p-4 bg-cream rounded-2xl shadow-inner border border-primary/10 mb-4">
              <QRCode
                value={bioUrl}
                size={180}
                bgColor="#FDFCF0"
                fgColor="#064E3B"
                level="H"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#064E3B]/90 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الرابط" : "Copy Link")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
