"use client";

import React, { useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { 
  Link as LinkIcon, 
  QrCode as QrIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Download,
  CheckCircle2,
  ArrowRight,
  Share2,
  Save,
  Loader2,
  Sparkles,
  Store,
  LayoutGrid
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa6";
import { updateArtisanProfile } from "@/lib/actions";
import { toast } from "react-hot-toast";

interface BioLinkTabProps {
  artisan: {
    id: string;
    studioName: string | null;
    slug: string | null;
    bio: string | null;
    avatar: string | null;
    isVerified: boolean;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    pinterest?: string | null;
    user: {
      name: string | null;
    };
  };
  lang: string;
}

export function BioLinkTab({ artisan, lang }: BioLinkTabProps) {
  const [copied, setCopied] = useState(false);
  const [instagram, setInstagram] = useState(artisan.instagram || "");
  const [facebook, setFacebook] = useState(artisan.facebook || "");
  const [tiktok, setTiktok] = useState(artisan.tiktok || "");
  const [pinterest, setPinterest] = useState(artisan.pinterest || "");
  const [saving, setSaving] = useState(false);

  const isRtl = lang === "ar";
  const name = artisan.studioName || artisan.user.name || "Artisan";
  const slug = artisan.slug || artisan.id;
  const bioUrl = typeof window !== "undefined"
    ? `${window.location.origin}/bio/${slug}`
    : `https://giftisan.com/bio/${slug}`;

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/artisan/socials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: instagram.trim(),
          facebook: facebook.trim(),
          tiktok: tiktok.trim(),
          pinterest: pinterest.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(isRtl ? "تم حفظ حسابات التواصل الاجتماعي بنجاح!" : "Social accounts updated successfully!");
      } else {
        toast.error(data.error || (isRtl ? "فشل الحفظ" : "Failed to update"));
      }
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bioUrl);
    setCopied(true);
    toast.success(isRtl ? "تم نسخ رابط البايو!" : "Bio Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svgEl = document.getElementById("studio-qr-code");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new globalThis.Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${slug}-giftisan-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success(isRtl ? "تم تحميل رمز QR لبطاقات التغليف!" : "QR Code downloaded for packaging!");
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-6 text-charcoal font-sans">
      
      {/* Top Header Banner Card */}
      <div className="bg-white border border-[#064E3B]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/10 text-[#064E3B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            {isRtl ? "رابط البايو المعتمد لمتجرك" : "Official Studio Bio Link"}
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#064E3B] tracking-tight">
            {isRtl ? "رابط البايو & QR Code" : "Bio Link & Packaging QR"}
          </h2>
          <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-medium">
            {isRtl 
              ? "ضع هذا الرابط في حسابك على إنستغرام أو فيسبوك ليوجه متابعيك مباشرة لمعرض منتجاتك اليدوية على Giftisan."
              : "Put this link in your Instagram & Facebook bios. Followers visiting your bio page can access all your channels and shop your crafts."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <div className="flex items-center justify-between gap-3 bg-cream/70 border border-[#064E3B]/15 rounded-2xl px-4 py-3 shadow-inner">
            <span className="text-xs font-mono font-bold text-[#064E3B] select-all truncate max-w-[210px]">
              {bioUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl bg-white hover:bg-[#064E3B] text-[#064E3B] hover:text-white border border-[#064E3B]/10 transition shadow-sm"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <a
            href={`/bio/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#D97706] hover:bg-[#D97706]/90 text-white transition flex items-center justify-center gap-2 text-xs font-bold shadow-md shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            {isRtl ? "معاينة الصفحة" : "Open Page"}
          </a>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Controls Side (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Social Media Accounts Form */}
          <div className="bg-white border border-[#064E3B]/10 rounded-[2.5rem] p-6 space-y-5 shadow-sm">
            <div className="border-b border-[#064E3B]/10 pb-3">
              <h3 className="text-base font-bold text-[#064E3B] flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#D97706]" />
                {isRtl ? "حسابات وسائل التواصل الاجتماعي" : "Social Media Accounts"}
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                {isRtl ? "أدخل اسم حسابك ليظهر زر الوصول المباشر في أعلى صفحة البايو." : "Enter your handles to display quick social icons on your bio page header."}
              </p>
            </div>

            <form onSubmit={handleSaveSocials} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Instagram */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                    <FaInstagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="e.g. my_studio"
                    className="w-full bg-cream/40 border border-[#064E3B]/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-[#064E3B] transition"
                  />
                </div>

                {/* TikTok */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                    <FaTiktok className="w-4 h-4 text-slate-800" />
                    TikTok
                  </label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="e.g. @studio_crafts"
                    className="w-full bg-cream/40 border border-[#064E3B]/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-[#064E3B] transition"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                    <FaFacebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="e.g. mystudio"
                    className="w-full bg-cream/40 border border-[#064E3B]/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-[#064E3B] transition"
                  />
                </div>

                {/* Pinterest */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal/70 flex items-center gap-1.5">
                    <FaPinterest className="w-4 h-4 text-red-600" />
                    Pinterest
                  </label>
                  <input
                    type="text"
                    value={pinterest}
                    onChange={(e) => setPinterest(e.target.value)}
                    placeholder="e.g. studio"
                    className="w-full bg-cream/40 border border-[#064E3B]/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-[#064E3B] transition"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#064E3B]/90 text-white text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shadow-md"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saving ? (isRtl ? "جاري الحفظ..." : "Saving...") : (isRtl ? "حفظ الحسابات" : "Save Social Accounts")}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Packaging QR Code */}
          <div className="bg-white border border-[#064E3B]/10 rounded-[2.5rem] p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#064E3B]/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#064E3B] flex items-center gap-2">
                  <QrIcon className="w-5 h-5 text-[#D97706]" />
                  {isRtl ? "رمز QR للتغليف وبطاقات العمل" : "Packaging & Business Card QR Code"}
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  {isRtl
                    ? "اطبع هذا الرمز على بطاقات الشكر والتغليف ليوجه المشترين لمتجرك بسهولة."
                    : "Print this high-resolution QR code on your order packaging inserts and business cards."}
                </p>
              </div>

              <button
                onClick={handleDownloadQR}
                className="px-5 py-2.5 rounded-2xl bg-[#D97706] hover:bg-[#D97706]/90 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shrink-0"
              >
                <Download className="w-4 h-4" />
                {isRtl ? "تحميل HD" : "Download PNG"}
              </button>
            </div>

            <div className="flex items-center justify-center p-6 bg-cream/50 rounded-2xl border border-[#064E3B]/10">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/5">
                <QRCode
                  id="studio-qr-code"
                  value={bioUrl}
                  size={150}
                  bgColor="#FFFFFF"
                  fgColor="#064E3B"
                  level="H"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Smartphone Simulator Side (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-6 w-full max-w-[320px] bg-[#064E3B] border-[6px] border-[#064E3B] rounded-[44px] shadow-2xl p-3 flex flex-col items-center overflow-hidden">
            
            {/* Phone Speaker Notch */}
            <div className="w-20 h-3.5 bg-black/20 rounded-full mb-3 shrink-0" />

            {/* Inner Screen */}
            <div className="w-full bg-[#FDFCF0] rounded-[26px] p-4 flex flex-col items-center text-center space-y-4 border border-[#064E3B]/10 overflow-y-auto max-h-[480px] scrollbar-hide">
              
              {/* Profile Avatar */}
              <div className="relative w-16 h-16 rounded-full border-2 border-[#064E3B]/20 overflow-hidden bg-white shadow-sm mt-2 shrink-0">
                {artisan.avatar ? (
                  <Image
                    src={artisan.avatar}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#064E3B]">
                    {name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#064E3B] flex items-center justify-center gap-1">
                  {name}
                  {artisan.isVerified && <CheckCircle2 className="w-4 h-4 text-[#D97706]" />}
                </h4>
                <p className="text-[11px] text-charcoal/60 line-clamp-2 mt-0.5 font-medium">
                  {artisan.bio || (isRtl ? "منتجات يدوية مميزة على Giftisan" : "Handcrafted creations on Giftisan")}
                </p>
              </div>

              {/* Social Icons Live Preview */}
              <div className="flex items-center justify-center gap-2.5 text-xs text-[#064E3B]">
                {instagram && <FaInstagram className="w-4 h-4 text-pink-600" />}
                {tiktok && <FaTiktok className="w-4 h-4 text-slate-800" />}
                {facebook && <FaFacebook className="w-4 h-4 text-blue-600" />}
                {pinterest && <FaPinterest className="w-4 h-4 text-red-600" />}
              </div>

              {/* Action Buttons Live Preview (Arabic / English Localized) */}
              <div className="w-full space-y-2">
                <div className="w-full p-3 rounded-xl bg-[#064E3B] text-white text-[11px] font-bold flex items-center justify-between shadow-sm">
                  <span className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-amber-300" />
                    {isRtl ? "تصفح متجري الكامل" : "Shop My Collection"}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 text-amber-300 ${isRtl ? "rotate-180" : ""}`} />
                </div>
                <div className="w-full p-3 rounded-xl bg-white text-[#064E3B] text-[11px] font-bold flex items-center justify-between border border-[#064E3B]/15 shadow-sm">
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#064E3B]/60" />
                    {isRtl ? "تصفح الأقسام" : "Explore Categories"}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 text-[#064E3B]/60 ${isRtl ? "rotate-180" : ""}`} />
                </div>
              </div>

              <div className="text-[10px] text-charcoal/50 pt-2 border-t border-[#064E3B]/10 w-full">
                Powered by <span className="text-[#064E3B] font-bold">Giftisan</span>
              </div>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 bg-white/20 rounded-full mt-3 shrink-0" />
          </div>
        </div>

      </div>
    </div>
  );
}
