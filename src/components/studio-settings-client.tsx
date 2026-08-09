"use client";

import { useState, useEffect } from "react";
import { User, Palette, Bell, Shield, Camera, Save, ArrowLeft, Check, AlertCircle, Loader2, Lock, Navigation } from "lucide-react";
import { FaInstagram, FaTiktok, FaPinterestP, FaFacebook, FaGlobe, FaLocationDot, FaEnvelope } from "react-icons/fa6";
import { updateArtisanProfile, checkSlugAvailability } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function StudioSettingsClient({ artisan, dict, lang = "en" }: { artisan: any; dict: any; lang?: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [studioName, setStudioName] = useState(artisan.studioName || "");
  const [bio, setBio] = useState(artisan.bio || "");
  const [location, setLocation] = useState(artisan.location || "");
  const [avatar, setAvatar] = useState(artisan.avatar || "");
  const [instagram, setInstagram] = useState(artisan.instagram || "");
  const [website, setWebsite] = useState(artisan.website || "");
  const [pinterest, setPinterest] = useState(artisan.pinterest || "");
  const [tiktok, setTiktok] = useState(artisan.tiktok || "");
  const [facebook, setFacebook] = useState(artisan.facebook || "");
  const [brandColor, setBrandColor] = useState(artisan.brandColor || "#da7b5a");
  const [bannerImage, setBannerImage] = useState(artisan.bannerImage || "");
  const [phoneNumber, setPhoneNumber] = useState(artisan.phoneNumber || "");
  const parseGpsFromAddress = (raw: string) => {
    const match = raw.match(/\[GPS Pin: (https:\/\/[^\]]+)\]/);
    return match ? match[1] : "";
  };
  const getCleanAddress = (raw: string) => {
    return raw.replace(/\[GPS Pin: https:\/\/[^\]]+\]/, '').trim();
  };

  const [gpsPinUrl, setGpsPinUrl] = useState(parseGpsFromAddress(artisan.pickupAddress || ""));
  const [pickupAddress, setPickupAddress] = useState(getCleanAddress(artisan.pickupAddress || ""));
  const [pickupCity, setPickupCity] = useState(artisan.pickupCity || "");
  const [pickupDistrict, setPickupDistrict] = useState(artisan.pickupDistrict || "");
  const [pickupBuilding, setPickupBuilding] = useState(artisan.pickupBuilding || "");
  const [pickupNotes, setPickupNotes] = useState(artisan.pickupNotes || "");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === "ar" ? "خدمة تحديد الموقع غير مدعومة في متصفحك." : "Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const googleMapsPin = `https://maps.google.com/?q=${latitude},${longitude}`;
          setGpsPinUrl(googleMapsPin);

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const detectedCity = data.address.city || data.address.state || data.address.town || data.address.governorate || "Cairo";
            const detectedDistrict = data.address.suburb || data.address.neighbourhood || data.address.quarter || "";
            const detectedStreet = [data.address.road, data.address.house_number].filter(Boolean).join(", ") || data.display_name?.split(",")[0] || "";

            if (detectedStreet) setPickupAddress(detectedStreet);
            if (detectedDistrict) setPickupDistrict(detectedDistrict);
            if (detectedCity) setPickupCity(detectedCity);
            if (!location && detectedCity) setLocation(`${detectedDistrict ? detectedDistrict + ", " : ""}${detectedCity}`);
          }
        } catch (err) {
          console.error("Could not fetch location", err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [slug, setSlug] = useState(artisan.slug || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailability, setSlugAvailability] = useState<'available' | 'taken' | 'idle'>('idle');

  useEffect(() => {
    if (!slug || slug === artisan.slug) {
      setSlugAvailability('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      const res = await checkSlugAvailability(slug, artisan.userId);
      setIsCheckingSlug(false);
      
      if (res.available) {
        setSlugAvailability('available');
      } else {
        setSlugAvailability('taken');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, artisan.slug, artisan.userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioName || !studioName.trim() || !bio || !bio.trim() || !location || !location.trim() || !phoneNumber || !phoneNumber.trim() || !slug || !slug.trim() || !pickupAddress || !pickupAddress.trim() || !pickupCity || !pickupCity.trim()) {
      setErrorStatus("Studio Name, Handle (Slug), Bio, Location, Phone Number, and Pickup Address are all required.");
      setTimeout(() => setErrorStatus(null), 4000);
      return;
    }
    setIsSaving(true);

    const cleanPickupAddress = pickupAddress.replace(/\[GPS Pin: https:\/\/[^\]]+\]/, '').trim();
    const finalPickupAddress = gpsPinUrl && !cleanPickupAddress.includes("[GPS Pin:")
      ? `${cleanPickupAddress} [GPS Pin: ${gpsPinUrl}]`
      : pickupAddress;

    const res = await updateArtisanProfile(artisan.userId, {
      studioName,
      bio,
      location,
      avatar,
      slug,
      instagram,
      website,
      pinterest,
      tiktok,
      facebook,
      brandColor,
      bannerImage,
      phoneNumber,
      pickupAddress: finalPickupAddress,
      pickupCity,
      pickupDistrict,
      pickupBuilding,
      pickupNotes,
    });

    if (res.success) {
      // Sync names if applicable
      await update({ image: avatar });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      router.refresh();
    } else {
      setErrorStatus(res.error || "Failed to update studio");
      setTimeout(() => setErrorStatus(null), 4000);
    }
    setIsSaving(false);
  };

  const navItems = [
    { id: "profile", icon: User, label: dict.studio_profile.profile_tab },
    { id: "branding", icon: Palette, label: dict.studio_profile.brand_tab },
    { id: "orders", icon: Bell, label: dict.studio_profile.orders_tab },
    { id: "verify", icon: Shield, label: dict.studio_profile.verify_tab },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-6">
          <Link href="/studio" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {dict.studio_profile.back_to_studio}
          </Link>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] w-fit">
              {dict.studio_profile.artisan_portal}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary italic serif leading-tight">
            {dict.studio_profile.studio_title_base} <span className="not-italic">{dict.studio_profile.studio_title_accent}</span>
          </h1>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 end-4 start-4 md:start-auto md:end-10 md:bottom-10 z-[200] px-6 md:px-10 py-4 md:py-5 bg-white text-green-600 rounded-3xl md:rounded-[2rem] font-bold flex items-center gap-4 shadow-2xl border border-green-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">{dict.studio_profile.studio_updated}</p>
              <p className="text-[10px] text-green-600/60 mt-1 uppercase font-bold">{dict.studio_profile.branding_live}</p>
            </div>
          </motion.div>
        )}

        {errorStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 end-4 start-4 md:start-auto md:end-10 md:bottom-10 z-[200] px-6 md:px-10 py-4 md:py-5 bg-white text-red-600 rounded-3xl md:rounded-[2rem] font-bold flex items-center gap-4 shadow-2xl border border-red-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">{dict.studio_profile.update_failed}</p>
              <p className="text-[10px] text-red-600/60 mt-1 uppercase font-bold max-w-xs">{errorStatus}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-[240px_1fr] gap-6 md:gap-12">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide sticky top-0 md:relative z-10 bg-cream md:bg-transparent py-2 md:py-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSettingsTab(item.id)}
              className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap md:whitespace-normal group shrink-0 active:scale-95 ${activeSettingsTab === item.id
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-charcoal/40 hover:bg-primary/5 hover:text-primary bg-white border border-primary/5 md:border-transparent md:bg-transparent"
                }`}
            >
              <item.icon className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", activeSettingsTab === item.id ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-xs md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeSettingsTab === "branding" ? (
              <motion.form
                key="branding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSave}
                className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-2xl space-y-8 md:space-y-10"
              >
                <div className="space-y-10 md:space-y-12">
                  <div className="space-y-5 md:space-y-6">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">
                      {dict.studio_profile.signature_palette} <span className="serif italic">{dict.studio_profile.palette_accent}</span>
                    </h3>
                    <p className="text-charcoal/40 text-xs">{dict.studio_profile.brand_color_desc}</p>

                    <div className="flex flex-wrap gap-2.5 md:gap-4">
                      {["#da7b5a", "#1a4332", "#4a90e2", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBrandColor(color)}
                          className={cn(
                            "w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl transition-all border-2 md:border-4 relative overflow-hidden active:scale-90",
                            brandColor === color ? "border-primary scale-110 shadow-lg" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {brandColor === color && <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white"><Check className="w-5 h-5 md:w-8 md:h-8" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">
                      {dict.studio_profile.studio_banner} <span className="serif italic">{dict.studio_profile.banner_accent}</span>
                    </h3>
                    <p className="text-charcoal/40 text-xs">{dict.studio_profile.banner_desc}</p>

                    <div
                      className="relative w-full h-28 md:h-48 rounded-xl md:rounded-[2rem] bg-cream/30 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-center group hover:border-accent/40 transition-all cursor-pointer overflow-hidden active:scale-[0.99]"
                    >
                      {bannerImage ? (
                        <>
                          <Image src={bannerImage} alt="Banner" fill className="object-cover" />
                          <div className="absolute inset-0 bg-primary/40 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-100">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                              <Camera className="w-5 h-5 md:w-8 md:h-8 text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-primary/20 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-4">{dict.studio_profile.select_banner}</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new (window as any).Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_SIZE = 2500; // Larger for banners
                                let width = img.width;
                                let height = img.height;
                                if (width > height) {
                                  if (width > MAX_SIZE) {
                                    height *= MAX_SIZE / width;
                                    width = MAX_SIZE;
                                  }
                                } else {
                                  if (height > MAX_SIZE) {
                                    width *= MAX_SIZE / height;
                                    height = MAX_SIZE;
                                  }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) ctx.imageSmoothingQuality = 'high';
                                ctx?.drawImage(img, 0, 0, width, height);
                                const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                                setBannerImage(canvas.toDataURL(outType, 0.9));
                              };
                              img.src = reader.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-cream/30 rounded-[1.5rem] md:rounded-[2rem] border border-primary/5 space-y-4">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                      {dict.studio_profile.preview_theme}
                    </h4>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded-full text-white flex items-center justify-center text-[8px] md:text-[10px] font-black uppercase" style={{ backgroundColor: brandColor }}>{dict.studio_profile.button}</div>
                      <div className="h-8 flex-1 rounded-full border flex items-center justify-center text-[8px] md:text-[10px] font-black uppercase" style={{ borderColor: brandColor, color: brandColor }}>{dict.studio_profile.outline}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-primary/5 flex">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto md:px-12 h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-xl md:shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 text-base active:scale-95"
                  >
                    {isSaving ? dict.studio_profile.syncing : dict.studio_profile.save_vision}
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            ) : activeSettingsTab === "profile" ? (
              <motion.form
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSave}
                className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-2xl space-y-6 md:space-y-10"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studioName}`}
                          alt="" fill className="object-cover"
                        />
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-primary/40 backdrop-blur-sm lg:opacity-0 lg:group-hover:opacity-100 transition-all rounded-full cursor-pointer border-4 border-white opacity-100">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new (window as any).Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_SIZE = 1000; // Smaller for avatars
                                  let width = img.width;
                                  let height = img.height;
                                  if (width > height) {
                                    if (width > MAX_SIZE) {
                                      height *= MAX_SIZE / width;
                                      width = MAX_SIZE;
                                    }
                                  } else {
                                    if (height > MAX_SIZE) {
                                      width *= MAX_SIZE / height;
                                      height = MAX_SIZE;
                                    }
                                  }
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  if (ctx) ctx.imageSmoothingQuality = 'high';
                                  ctx?.drawImage(img, 0, 0, width, height);
                                  const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                                  setAvatar(canvas.toDataURL(outType, 0.9));
                                };
                                img.src = reader.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-primary">{studioName || dict.studio_profile.studio_name_placeholder}</h3>
                      <p className="text-charcoal/40 font-bold text-[10px] uppercase tracking-widest">{dict.studio_profile.studio_avatar}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.studio_name_label} *</label>
                      <div className="relative">
                        <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40"><User className="w-4 h-4" /></span>
                        <input
                          type="text"
                          required
                          value={studioName || ""}
                          onChange={(e) => setStudioName(e.target.value)}
                          className="w-full h-16 ps-12 pe-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                          placeholder={dict.studio_profile.studio_name_placeholder}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center gap-2">
                        {dict.studio_profile.studio_slug_label} *
                        <span className="text-[8px] font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full">{dict.studio_profile.studio_slug_permanent}</span>
                      </label>
                      <div className="relative">
                        <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40"><FaGlobe className="w-4 h-4" /></span>
                        <input
                          type="text"
                          required
                          value={slug || ""}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                          className={cn(
                            "w-full h-16 ps-12 pe-12 rounded-2xl bg-white border-2 transition-all font-bold placeholder:text-primary/20",
                            slugAvailability === 'available' ? "border-green-500/50 text-green-700 bg-green-50/10" : 
                            slugAvailability === 'taken' ? "border-red-500/50 text-red-700 bg-red-50/10" : 
                            "border-primary/5 focus:border-accent text-accent"
                          )}
                          placeholder={dict.studio_profile.studio_slug_placeholder}
                        />
                        <div className="absolute end-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {isCheckingSlug ? (
                            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
                          ) : slugAvailability === 'available' ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100/50 rounded-full border border-green-200">
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">{dict.studio_profile.slug_available || "Available"}</span>
                            </div>
                          ) : slugAvailability === 'taken' ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100/50 rounded-full border border-red-200">
                              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-[9px] font-black text-red-700 uppercase tracking-widest">{dict.studio_profile.slug_taken || "Taken"}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-charcoal/40 ms-4">
                        {dict.studio_profile.public_link} <span className="text-primary italic">www.giftisan.com/artisans/{slug || "your-path"}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.artisan_bio_label} *</label>
                      <textarea
                        required
                        value={bio || ""}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-32 p-8 rounded-[2rem] bg-cream/30 border border-primary/5 transition-all font-medium text-primary focus:outline-none focus:border-accent resize-none placeholder:text-primary/40"
                        placeholder={dict.studio_profile.bio_placeholder}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.studio_location_label} *</label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40"><FaLocationDot className="w-4 h-4" /></span>
                          <input
                            type="text"
                            required
                            value={location || ""}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-14 md:h-16 ps-12 pe-8 rounded-xl md:rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40 text-sm md:text-base"
                            placeholder={dict.studio_profile.location_placeholder}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                          {dict.checkout?.phone_number || "Phone Number"} *
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          </span>
                          <input
                            type="tel"
                            required
                            value={phoneNumber || ""}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full h-14 md:h-16 ps-12 pe-8 rounded-xl md:rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40 text-sm md:text-base"
                            placeholder={dict.checkout?.phone_number || "Phone Number"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.primary_email}</label>
                      <div className="w-full h-14 md:h-16 ps-12 pe-8 flex items-center rounded-xl md:rounded-2xl bg-primary/5 border border-primary/5 text-primary/40 font-bold cursor-not-allowed overflow-hidden relative text-sm md:text-base">
                        <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/20"><FaEnvelope className="w-4 h-4" /></span>
                        <span className="truncate w-full">{artisan.user.email}</span>
                      </div>
                    </div>

                    {/* Exact Courier Pickup Address (Admin & Logistics Only) */}
                    <div className="p-6 md:p-8 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            📦
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-primary">
                              {lang === "ar" ? "عنوان استلام الشحنات (للأدمن وشركة التوصيل)" : "Courier Pickup Address (Admin & Logistics Only)"}
                            </h4>
                            <p className="text-xs text-charcoal/60 font-medium">
                              {lang === "ar" ? "العنوان التفصيلي لوكلاء الشحن لاستلام الطلبات من ورشتك/متجرك." : "Exact doorstep address for courier drivers to pick up completed orders."}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          {gpsPinUrl && (
                            <a
                              href={gpsPinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-all shrink-0"
                            >
                              <span>📍 Exact GPS Pin Captured</span>
                              <span className="text-[10px] underline">Open Google Maps ↗</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                            className="w-full sm:w-auto px-5 py-2.5 bg-accent/10 border border-accent/20 hover:bg-accent hover:text-white text-accent rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm shrink-0"
                          >
                            {isDetectingLocation ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Navigation className="w-3.5 h-3.5" />
                            )}
                            <span>{lang === "ar" ? "تحديد موقعي تلقائياً 📍" : "Auto-Detect My Location 📍"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                            {lang === "ar" ? "اسم الشارع والرقم" : "Street Address & Number"} *
                          </label>
                          <input
                            type="text"
                            required
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/10 focus:border-accent font-medium text-primary text-sm"
                            placeholder={lang === "ar" ? "مثال: ١٥ شارع التحرير، الدقي" : "e.g., 15 El-Tahrir St, Dokki"}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                            {lang === "ar" ? "المنطقة / الحي" : "District / Area"}
                          </label>
                          <input
                            type="text"
                            value={pickupDistrict}
                            onChange={(e) => setPickupDistrict(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/10 focus:border-accent font-medium text-primary text-sm"
                            placeholder={lang === "ar" ? "مثال: المعادي / الزمالك" : "e.g., Maadi / Zamalek"}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                            {lang === "ar" ? "المحافظة / المدينة" : "City / Governorate"} *
                          </label>
                          <input
                            type="text"
                            required
                            value={pickupCity}
                            onChange={(e) => setPickupCity(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/10 focus:border-accent font-medium text-primary text-sm"
                            placeholder={lang === "ar" ? "مثال: القاهرة" : "e.g., Cairo"}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                            {lang === "ar" ? "رقم المبنى / الدور / الشقة" : "Building / Floor / Apt"}
                          </label>
                          <input
                            type="text"
                            value={pickupBuilding}
                            onChange={(e) => setPickupBuilding(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/10 focus:border-accent font-medium text-primary text-sm"
                            placeholder={lang === "ar" ? "مثال: مبنى ٤، الدور ٣، شقة ١٢" : "e.g., Bldg 4, Fl 3, Apt 12"}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                            {lang === "ar" ? "علامة مميزة / تعليمات للمندوب" : "Pickup Notes & Landmarks"}
                          </label>
                          <input
                            type="text"
                            value={pickupNotes}
                            onChange={(e) => setPickupNotes(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/10 focus:border-accent font-medium text-primary text-sm"
                            placeholder={lang === "ar" ? "مثال: بجوار البنك الأهلي، بوابة خضراء" : "e.g., Near NBE Bank, Green Gate"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                          <span>{dict.studio_profile.instagram_handle}</span>
                          <Lock className="w-3.5 h-3.5 text-primary/30 me-4" />
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40"><FaInstagram className="w-4 h-4" /></span>
                          <input
                            type="text"
                            disabled
                            readOnly
                            value="giftisan_eg"
                            className="w-full h-16 ps-12 pe-8 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60 placeholder:text-primary/20"
                            placeholder="giftisan_eg"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                          <span>{dict.studio_profile.website_url}</span>
                          <Lock className="w-3.5 h-3.5 text-primary/30 me-4" />
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40"><FaGlobe className="w-4 h-4" /></span>
                          <input
                            type="url"
                            disabled
                            readOnly
                            value="https://www.giftisan.com"
                            className="w-full h-16 ps-12 pe-8 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60 placeholder:text-primary/20"
                            placeholder="https://www.giftisan.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                          <span>{dict.studio_profile.tiktok_handle}</span>
                          <Lock className="w-3.5 h-3.5 text-primary/30 me-4" />
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaTiktok className="w-4 h-4" /></span>
                          <input
                            type="text"
                            disabled
                            readOnly
                            value="giftisan.eg"
                            className="w-full h-16 ps-12 pe-8 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60 placeholder:text-primary/20"
                            placeholder="giftisan.eg"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                          <span>{dict.studio_profile.facebook_profile}</span>
                          <Lock className="w-3.5 h-3.5 text-primary/30 me-4" />
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaFacebook className="w-4 h-4" /></span>
                          <input
                            type="text"
                            disabled
                            readOnly
                            value={facebook || ""}
                            onChange={(e) => setFacebook(e.target.value)}
                            className="w-full h-16 ps-12 pe-8 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60 placeholder:text-primary/20"
                            placeholder={dict.studio_profile.facebook_placeholder}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                          <span>{dict.studio_profile.pinterest_username}</span>
                          <Lock className="w-3.5 h-3.5 text-primary/30 me-4" />
                        </label>
                        <div className="relative">
                          <span className="absolute start-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaPinterestP className="w-4 h-4" /></span>
                          <input
                            type="text"
                            disabled
                            readOnly
                            value={pinterest || ""}
                            onChange={(e) => setPinterest(e.target.value)}
                            className="w-full h-16 ps-12 pe-8 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60 placeholder:text-primary/20"
                            placeholder={dict.studio_profile.pinterest_placeholder}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-primary/5 flex">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto md:px-12 h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-xl md:shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 text-sm md:text-base"
                  >
                    {isSaving ? dict.studio_profile.syncing : dict.studio_profile.save_branding}
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-20 rounded-[3rem] border border-primary/5 shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 bg-cream rounded-3xl flex items-center justify-center text-primary/20">
                  {activeSettingsTab === "branding" && <Palette className="w-12 h-12" />}
                  {activeSettingsTab === "orders" && <Bell className="w-12 h-12" />}
                  {activeSettingsTab === "verify" && <Shield className="w-12 h-12" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-bold text-primary">{dict.studio_profile.coming_soon}</h3>
                  <p className="text-charcoal/40 max-w-sm">{dict.studio_profile.building_tools.replace('{tab}', (navItems.find(i => i.id === activeSettingsTab)?.label || activeSettingsTab).toLowerCase())}</p>
                </div>
                <button
                  onClick={() => setActiveSettingsTab("profile")}
                  className="px-8 h-12 bg-primary/5 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  {dict.studio_profile.back_to_profile}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

