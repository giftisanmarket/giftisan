"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Palette, 
  Camera, 
  Save, 
  Check, 
  AlertCircle, 
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Lock,
  Navigation
} from "lucide-react";
import { 
  FaInstagram, 
  FaTiktok, 
  FaPinterestP, 
  FaFacebook 
} from "react-icons/fa6";
import { updateArtisanProfile, checkSlugAvailability } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface SettingsTabProps {
  artisan: any;
  dict: any;
  lang?: string;
}

export function SettingsTab({ artisan, dict, lang = "en" }: SettingsTabProps) {
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
      toast.error(lang === "ar" ? "خدمة تحديد الموقع غير مدعومة في متصفحك." : "Geolocation is not supported by your browser.");
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

            toast.success(lang === "ar" ? "تم تحديد موقعك بدقة وتسجيل الدبوس الجغرافي 📍" : "Exact location detected and GPS pin saved 📍");
          }
        } catch (err) {
          toast.error(lang === "ar" ? "تعذر تحديد العنوان تلقائياً." : "Could not fetch address details.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        toast.error(lang === "ar" ? "يرجى السماح بالوصول للموقع لتحديد العنوان." : "Location access was denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [slug, setSlug] = useState(artisan.slug || "");
  const [isSaving, setIsSaving] = useState(false);
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
    if (!studioName.trim() || !bio.trim() || !location.trim() || !phoneNumber.trim() || !slug.trim() || !pickupAddress.trim() || !pickupCity.trim()) {
      toast.error(lang === "ar" ? "جميع البيانات الأساسية وعنوان الاستلام التفصيلي مطلوبة." : "Studio Name, Slug, Bio, Location, Phone Number, and Pickup Address are all required.");
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
      await update({ image: avatar });
      toast.success(dict.studio_profile.studio_updated, {
        icon: <Check className="w-5 h-5 text-green-500" />,
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update studio");
    }
    setIsSaving(false);
  };

  const navItems = [
    { id: "profile", icon: User, label: dict.studio_profile.profile_tab },
    { id: "branding", icon: Palette, label: dict.studio_profile.brand_tab },
  ];

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-12">
          <div className="space-y-2 text-center md:text-start w-full md:w-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight">
              {dict.studio_profile.studio_title_base} <span className="serif italic font-normal text-accent">{dict.studio_profile.studio_title_accent}</span>
            </h2>
            <p className="text-sm md:text-base text-charcoal/40 font-medium">{dict.studio_profile.branding_desc}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-16">
          {/* Sub Navigation */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-12 lg:pb-0 scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSettingsTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shrink-0 active:scale-95",
                  activeSettingsTab === item.id
                    ? "bg-primary text-white shadow-[0_15px_40px_-10px_rgba(6,78,59,0.2)]"
                    : "text-primary/40 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm md:text-base">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeSettingsTab === "profile" ? (
                <motion.form
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSave}
                  className="space-y-10"
                >
                  {/* Identity Section */}
                  <div className="grid md:grid-cols-[200px_1fr] gap-10">
                    <div className="space-y-4">
                      <div className="relative group mx-auto md:mx-0 w-40 h-40">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                          <Image
                            src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studioName}`}
                            alt="" fill className="object-cover"
                          />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-primary/20 lg:bg-primary/40 backdrop-blur-[2px] lg:backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all rounded-full cursor-pointer border-4 border-white">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl">
                            <Camera className="w-5 h-5 md:w-6 md:h-6" />
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
                                    const MAX_SIZE = 1000;
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
                      <p className="text-center md:text-start text-[10px] font-black uppercase tracking-widest text-primary/20">{dict.studio_profile.studio_avatar}</p>
                    </div>

                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.studio_name_label} *</label>
                          <div className="relative">
                            <User className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                            <input
                              type="text"
                              required
                              value={studioName}
                              onChange={(e) => setStudioName(e.target.value)}
                              className="w-full h-14 ps-14 pe-6 rounded-2xl bg-cream/20 border border-primary/5 focus:border-accent focus:bg-white transition-all font-bold text-primary"
                              placeholder={dict.studio_profile.studio_name_placeholder}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center gap-2">
                            {dict.studio_profile.studio_slug_label} *
                            <span className="text-[8px] font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full uppercase tracking-widest">{dict.studio_profile.studio_slug_permanent}</span>
                          </label>
                          <div className="relative">
                            <Globe className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                            <input
                              type="text"
                              required
                              value={slug}
                              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                              className={cn(
                                "w-full h-14 ps-14 pe-14 rounded-2xl bg-cream/20 border transition-all font-bold",
                                slugAvailability === 'available' ? "border-green-500/50 text-green-700" : 
                                slugAvailability === 'taken' ? "border-red-500/50 text-red-700" : 
                                "border-primary/5"
                              )}
                              placeholder="studio-slug"
                            />
                            <div className="absolute end-4 top-1/2 -translate-y-1/2">
                              {isCheckingSlug ? <Loader2 className="w-4 h-4 animate-spin text-primary/20" /> :
                               slugAvailability === 'available' ? <Check className="w-4 h-4 text-green-500" /> :
                               slugAvailability === 'taken' ? <AlertCircle className="w-4 h-4 text-red-500" /> : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.artisan_bio_label} *</label>
                        <textarea
                          required
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full p-6 rounded-[2rem] bg-cream/20 border border-primary/5 focus:border-accent focus:bg-white transition-all font-medium text-primary resize-none"
                          placeholder={dict.studio_profile.bio_placeholder}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-primary/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.studio_location_label} *</label>
                      <div className="relative">
                        <MapPin className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-14 ps-14 pe-6 rounded-2xl bg-cream/20 border border-primary/5 focus:border-accent focus:bg-white transition-all font-bold text-primary"
                          placeholder={dict.studio_profile.location_placeholder}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio_profile.phone_number_label} *</label>
                      <div className="relative">
                        <Phone className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full h-14 ps-14 pe-6 rounded-2xl bg-cream/20 border border-primary/5 focus:border-accent focus:bg-white transition-all font-bold text-primary"
                          placeholder="+20 ..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exact Courier Pickup Address (Admin & Logistics Only) */}
                  <div className="p-6 md:p-8 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 mt-0.5">
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
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full xl:w-auto shrink-0">
                        {gpsPinUrl && (
                          <a
                            href={gpsPinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex flex-wrap items-center justify-between sm:justify-center gap-2 hover:bg-emerald-100 transition-all shrink-0"
                          >
                            <span className="flex items-center gap-1.5 shrink-0">
                              <span>📍</span>
                              <span>{lang === "ar" ? "تم تحديد الدبوس الجغرافي" : "GPS Pin Captured"}</span>
                            </span>
                            <span className="text-[10px] underline bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/40 shrink-0">
                              {lang === "ar" ? "فتح الخرائط ↗" : "Open Google Maps ↗"}
                            </span>
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

                      <div className="space-y-2">
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

                  {/* Socials - Locked for now */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                        <span>{dict.studio_profile.instagram_handle}</span>
                        <Lock className="w-3 h-3 text-primary/30" />
                      </label>
                      <div className="relative">
                        <FaInstagram className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                        <input
                          type="text"
                          disabled
                          readOnly
                          value="giftisan_eg"
                          className="w-full h-14 ps-14 pe-6 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60"
                          placeholder="giftisan_eg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                        <span>{dict.studio_profile.tiktok_handle}</span>
                        <Lock className="w-3 h-3 text-primary/30" />
                      </label>
                      <div className="relative">
                        <FaTiktok className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                        <input
                          type="text"
                          disabled
                          readOnly
                          value="giftisan.eg"
                          className="w-full h-14 ps-14 pe-6 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60"
                          placeholder="giftisan.eg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4 flex items-center justify-between">
                        <span>{dict.studio_profile.website_url}</span>
                        <Lock className="w-3 h-3 text-primary/30" />
                      </label>
                      <div className="relative">
                        <Globe className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                        <input
                          type="url"
                          disabled
                          readOnly
                          value="https://www.giftisan.com"
                          className="w-full h-14 ps-14 pe-6 rounded-2xl bg-primary/5 border border-primary/5 font-bold text-primary/40 cursor-not-allowed select-none opacity-60"
                          placeholder="https://www.giftisan.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="h-16 px-12 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                      {isSaving ? dict.studio_profile.syncing : dict.studio_profile.save_profile}
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </motion.form>
              ) : activeSettingsTab === "branding" ? (
                <motion.form
                  key="branding"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSave}
                  className="space-y-12"
                >
                  {/* Banner */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-bold text-primary">{dict.studio_profile.studio_banner}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">{dict.studio_profile.banner_recommended}</p>
                    </div>
                    <div className="relative w-full h-48 md:h-64 rounded-[2.5rem] bg-cream/20 border-2 border-dashed border-primary/10 overflow-hidden group">
                      {bannerImage ? (
                        <>
                          <Image src={bannerImage} alt="Banner" fill className="object-cover" />
                          <div className="absolute inset-0 bg-primary/20 lg:bg-primary/40 lg:opacity-0 lg:group-hover:opacity-100 transition-all flex items-center justify-center opacity-100">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl">
                              <Camera className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary/20">
                          <Camera className="w-12 h-12" />
                          <p className="text-xs font-bold uppercase tracking-widest">{dict.studio_profile.select_banner}</p>
                        </div>
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
                                const MAX_SIZE = 2500;
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

                  {/* Brand Color */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading font-bold text-primary">{dict.studio_profile.signature_palette}</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                      {["#da7b5a", "#1a4332", "#4a90e2", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#1a1a1a"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBrandColor(color)}
                          className={cn(
                            "aspect-square rounded-2xl border-4 transition-all relative overflow-hidden active:scale-90",
                            brandColor === color ? "border-primary scale-110 shadow-xl" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {brandColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                              <Check className="w-6 h-6" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="p-6 md:p-8 bg-cream/20 rounded-3xl border border-primary/5 space-y-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h4 className="font-bold text-primary">{dict.studio_profile.preview_theme}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500" style={{ backgroundColor: brandColor }}>
                        {dict.studio_profile.button || "Primary Button"}
                      </div>
                      <div className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl border-2 flex items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500" style={{ borderColor: brandColor, color: brandColor }}>
                        {dict.studio_profile.outline || "Outline Style"}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="h-16 px-12 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                      {isSaving ? dict.studio_profile.syncing : dict.studio_profile.save_branding}
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </motion.form>
              ) : null}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
