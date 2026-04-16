"use client";

import { useState } from "react";
import { User, Palette, Bell, Shield, Camera, Save, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { FaInstagram, FaTiktok, FaPinterestP, FaFacebook, FaGlobe, FaLocationDot, FaEnvelope } from "react-icons/fa6";
import { updateArtisanProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function StudioSettingsClient({ artisan }: { artisan: any }) {
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
  const [activeSettingsTab, setActiveSettingsTab] = useState("Studio Profile");
  const [slug, setSlug] = useState(artisan.slug || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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
      bannerImage
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
    { icon: User, label: "Studio Profile" },
    { icon: Palette, label: "Brand Styling" },
    { icon: Bell, label: "Orders & News" },
    { icon: Shield, label: "Verification" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-6">
          <Link href="/studio" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Studio
          </Link>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] w-fit">
              Artisan Portal
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary italic serif leading-tight">Studio <span className="not-italic">Settings</span></h1>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-4 left-4 md:left-auto md:right-10 md:bottom-10 z-[200] px-6 md:px-10 py-4 md:py-5 bg-white text-green-600 rounded-3xl md:rounded-[2rem] font-bold flex items-center gap-4 shadow-2xl border border-green-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">Studio Updated</p>
              <p className="text-[10px] text-green-600/60 mt-1 uppercase font-bold">Your branding is now live.</p>
            </div>
          </motion.div>
        )}

        {errorStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-4 left-4 md:left-auto md:right-10 md:bottom-10 z-[200] px-6 md:px-10 py-4 md:py-5 bg-white text-red-600 rounded-3xl md:rounded-[2rem] font-bold flex items-center gap-4 shadow-2xl border border-red-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">Update Failed</p>
              <p className="text-[10px] text-red-600/60 mt-1 uppercase font-bold max-w-xs">{errorStatus}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-[240px_1fr] gap-6 md:gap-12">
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide sticky top-0 md:relative z-10 bg-cream md:bg-transparent py-2 md:py-0">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSettingsTab(item.label)}
              className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all whitespace-nowrap md:whitespace-normal group shrink-0 active:scale-95 ${activeSettingsTab === item.label
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-charcoal/40 hover:bg-primary/5 hover:text-primary bg-white border border-primary/5 md:border-transparent md:bg-transparent"
                }`}
            >
              <item.icon className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", activeSettingsTab === item.label ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-xs md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeSettingsTab === "Brand Styling" ? (
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
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">Signature <span className="serif italic">Palette</span></h3>
                    <p className="text-charcoal/40 text-xs">Choose a brand color for your studio profile accents.</p>

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
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">Studio <span className="serif italic">Banner</span></h3>
                    <p className="text-charcoal/40 text-xs">Upload a banner image that reflects your craft.</p>

                    <div
                      className="relative w-full h-28 md:h-48 rounded-xl md:rounded-[2rem] bg-cream/30 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-center group hover:border-accent/40 transition-all cursor-pointer overflow-hidden active:scale-[0.99]"
                    >
                      {bannerImage ? (
                        <>
                          <Image src={bannerImage} alt="Banner" fill className="object-cover" />
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-primary/20 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-4">Select Banner</p>
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
                            reader.onloadend = () => setBannerImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-cream/30 rounded-[1.5rem] md:rounded-[2rem] border border-primary/5 space-y-4">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                      Preview Theme
                    </h4>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded-full text-white flex items-center justify-center text-[8px] md:text-[10px] font-black uppercase" style={{ backgroundColor: brandColor }}>Button</div>
                      <div className="h-8 flex-1 rounded-full border flex items-center justify-center text-[8px] md:text-[10px] font-black uppercase" style={{ borderColor: brandColor, color: brandColor }}>Outline</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-primary/5 flex">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto md:px-12 h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-xl md:shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 text-base active:scale-95"
                  >
                    {isSaving ? "Syncing..." : "Save Vision"}
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            ) : activeSettingsTab === "Studio Profile" ? (
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
                      <label className="absolute inset-0 flex items-center justify-center bg-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer border-4 border-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setAvatar(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-primary">{studioName || "Your Studio"}</h3>
                      <p className="text-charcoal/40 font-bold text-[10px] uppercase tracking-widest">Studio Avatar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Studio Name</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"><User className="w-4 h-4" /></span>
                        <input
                          type="text"
                          value={studioName || ""}
                          onChange={(e) => setStudioName(e.target.value)}
                          className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                          placeholder="Your Studio Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4 flex items-center gap-2">
                        Studio URL Slug
                        <span className="text-[8px] font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full">Permanent Link</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"><FaGlobe className="w-4 h-4" /></span>
                        <input
                          type="text"
                          value={slug || ""}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, "-"))}
                          className="w-full h-16 pl-12 pr-8 rounded-2xl bg-white border-2 border-primary/5 focus:border-accent transition-all font-bold text-accent placeholder:text-primary/20"
                          placeholder="your-custom-slug"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-charcoal/40 ml-4">
                        Your public link: <span className="text-primary italic">giftisan.com/artisans/{slug || "your-path"}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Artisan Bio</label>
                      <textarea
                        value={bio || ""}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full h-32 p-8 rounded-[2rem] bg-cream/30 border border-primary/5 transition-all font-medium text-primary focus:outline-none focus:border-accent resize-none placeholder:text-primary/40"
                        placeholder="Tell your story..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Studio Location</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"><FaLocationDot className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={location || ""}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-14 md:h-16 pl-12 pr-8 rounded-xl md:rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40 text-sm md:text-base"
                            placeholder="e.g. Cairo, Egypt"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Primary Email</label>
                        <div className="w-full h-14 md:h-16 pl-12 pr-8 flex items-center rounded-xl md:rounded-2xl bg-primary/5 border border-primary/5 text-primary/40 font-bold cursor-not-allowed overflow-hidden relative text-sm md:text-base">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20"><FaEnvelope className="w-4 h-4" /></span>
                          <span className="truncate w-full">{artisan.user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Instagram Username</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"><FaInstagram className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={instagram || ""}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                            placeholder="your.handle"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Portfolio / Website</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"><FaGlobe className="w-4 h-4" /></span>
                          <input
                            type="url"
                            value={website || ""}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                            placeholder="https://yourpage.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">TikTok Handle</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaTiktok className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={tiktok || ""}
                            onChange={(e) => setTiktok(e.target.value)}
                            className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                            placeholder="your.tiktok"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Facebook Profile</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaFacebook className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={facebook || ""}
                            onChange={(e) => setFacebook(e.target.value)}
                            className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                            placeholder="your.facebook"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Pinterest Username</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 text-sm font-bold self-center"><FaPinterestP className="w-4 h-4" /></span>
                          <input
                            type="text"
                            value={pinterest || ""}
                            onChange={(e) => setPinterest(e.target.value)}
                            className="w-full h-16 pl-12 pr-8 rounded-2xl bg-cream/30 border border-primary/5 transition-all font-bold text-primary focus:outline-none focus:border-accent placeholder:text-primary/40"
                            placeholder="your.pinterest"
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
                    {isSaving ? "Syncing..." : "Save Studio Branding"}
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
                  {activeSettingsTab === "Brand Styling" && <Palette className="w-12 h-12" />}
                  {activeSettingsTab === "Orders & News" && <Bell className="w-12 h-12" />}
                  {activeSettingsTab === "Verification" && <Shield className="w-12 h-12" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-bold text-primary">Coming Soon</h3>
                  <p className="text-charcoal/40 max-w-sm">We're building premium {activeSettingsTab.toLowerCase()} tools to help you grow your artisan brand.</p>
                </div>
                <button
                  onClick={() => setActiveSettingsTab("Studio Profile")}
                  className="px-8 h-12 bg-primary/5 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  Back to Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
