"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  DollarSign,
  Tag,
  Type,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  Video,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface NewProductClientProps {
  artisanId: string;
  dict: any;
}

export function NewProductClient({ artisanId, dict }: NewProductClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "ceramics",
    images: ["", "", "", "", "", "", "", "", "", ""],
    canPersonalize: false,
    personalizationPrompt: "",
    badge: "",
    stock: "1"
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState<Record<number, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [resolutions, setResolutions] = useState<Record<number, string>>({});

  // Detect resolutions for existing media
  useEffect(() => {
    formData.images.forEach((img, idx) => {
      if (img && !resolutions[idx]) {
        if (img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i)) {
          const video = document.createElement('video');
          video.src = img;
          video.onloadedmetadata = () => {
            setResolutions(prev => ({ ...prev, [idx]: `${video.videoWidth}×${video.videoHeight}` }));
          };
        } else {
          const i = new (window as any).Image();
          i.onload = () => {
            setResolutions(prev => ({ ...prev, [idx]: `${i.width}×${i.height}` }));
          };
          i.src = img;
        }
      }
    });
  }, [formData.images, resolutions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { id: "ceramics", label: dict.common.categories_list?.["ceramics"] || dict.common.ceramics },
    { id: "jewelry", label: dict.common.categories_list?.["jewelry"] || dict.common.jewelry },
    { id: "gift-boxes-sets", label: dict.common.categories_list?.["gift-boxes-sets"] || "Gift Boxes & Sets" },
    { id: "textiles", label: dict.common.categories_list?.["textiles"] || dict.common.textiles },
    { id: "woodwork", label: dict.common.categories_list?.["woodwork"] || dict.common.woodwork },
    { id: "leatherwork", label: dict.common.categories_list?.["leatherwork"] || dict.common.leatherwork },
    { id: "culinary-arts", label: dict.common.categories_list?.["culinary-arts"] || "Culinary Arts" },
    { id: "beauty-apothecary", label: dict.common.categories_list?.["beauty-apothecary"] || "Beauty & Apothecary" },
    { id: "metalwork", label: dict.common.categories_list?.["metalwork"] || dict.common.metalwork },
    { id: "glasswork", label: dict.common.categories_list?.["glasswork"] || dict.common.glasswork },
    { id: "basketry", label: dict.common.categories_list?.["basketry"] || dict.common.basketry },
    { id: "fashion", label: dict.common.categories_list?.["fashion"] || dict.common.fashion },
    { id: "wedding", label: dict.common.categories_list?.["wedding"] || dict.common.wedding },
    { id: "personalized", label: dict.common.categories_list?.["personalized"] || dict.common.personalized },
    { id: "art-collectibles", label: dict.common.categories_list?.["art-collectibles"] || dict.common.art_collectibles },
    { id: "vintage", label: dict.common.categories_list?.["vintage"] || dict.common.vintage },
    { id: "stationery", label: dict.common.categories_list?.["stationery"] || dict.common.stationery }
  ];

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
    if (!value) {
      setResolutions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.price || !formData.images[0]) {
      setError(dict.new_product.validation_error);
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price.trim());
    form.append("category", formData.category);
    form.append("canPersonalize", formData.canPersonalize.toString());
    form.append("personalizationPrompt", formData.personalizationPrompt);
    form.append("badge", formData.badge);
    form.append("stock", formData.stock.trim());

    formData.images.forEach((img, i) => {
      if (img) form.append(`image-${i}`, img);
    });

    const res = await createProduct(artisanId, form);

    if (res.success) {
      window.location.href = "/studio";
    } else {
      setError(res.error || "Failed to create product.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-primary/40 hover:text-primary text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {dict.studio_profile.back_to_studio}
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              {dict.new_product.list_new_treasure}{" "}
              <span className="serif italic font-normal text-accent">{dict.new_product.treasure_accent}</span>
            </h1>
            <p className="text-charcoal/40 mt-1">{dict.new_product.share_craftsmanship}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main Info */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-primary">{dict.new_product.the_essentials}</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> {dict.new_product.product_title_label}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={dict.new_product.product_title_placeholder}
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> {dict.new_product.price_label}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={dict.new_product.price_placeholder}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" /> {dict.new_product.category_label}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-start flex items-center justify-between shadow-sm"
                  >
                    <span className={cn("font-medium", formData.category ? "text-primary" : "text-primary/50")}>
                      {categories.find(c => c.id === formData.category)?.label || dict.new_product.select_category}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-primary/40 transition-transform", isCategoryOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 top-full start-0 end-0 mt-2 bg-white border border-primary/10 rounded-[2rem] shadow-2xl p-4 space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10"
                      >
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat.id });
                              setIsCategoryOpen(false);
                            }}
                            className={cn(
                              "w-full px-5 md:px-6 py-2.5 md:py-3 text-start rounded-xl transition-all font-bold text-xs md:text-sm active:scale-[0.98]",
                              formData.category === cat.id
                                ? "bg-primary text-white shadow-lg"
                                : "text-primary/60 hover:bg-primary/5"
                            )}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                  {dict.new_product.description_label}
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={dict.new_product.description_placeholder}
                  className="w-full h-32 md:h-40 p-5 md:p-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-medium resize-none shadow-sm text-sm md:text-base"
                />
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-5 md:pb-6 border-b border-primary/5">
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">{dict.new_product.media_gallery}</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs md:text-sm text-charcoal/40 italic">{dict.new_product.media_desc}</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full w-fit">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-accent">{dict.new_product.optimal_size}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {formData.images.map((img, idx) => (
                <div key={idx} className="space-y-3 md:space-y-4">
                  <div className="relative aspect-square rounded-[1.5rem] md:rounded-2xl bg-cream/50 flex flex-col items-center justify-center overflow-hidden border border-dashed border-primary/20 group">
                    {img ? (
                      img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i) ? (
                        <video
                          src={img}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => e.currentTarget.pause()}
                        />
                      ) : (
                        <Image src={img} alt="Preview" fill className="object-cover" />
                      )
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 md:w-8 md:h-8 text-primary/10" />
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary/20">Optimal 1080px</span>
                      </div>
                    )}

                    {resolutions[idx] && (
                      <div className="absolute top-3 start-3 md:top-4 md:start-4 z-20 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[7px] md:text-[8px] font-black text-white uppercase tracking-tighter">
                        {resolutions[idx]}
                      </div>
                    )}

                    {img && (img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i)) && (
                      <div className="absolute top-3 end-3 md:top-4 md:end-4 z-20 w-5 h-5 md:w-6 md:h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                        <Video className="w-2.5 h-2.5 md:w-3 h-3 text-white" />
                      </div>
                    )}

                    <label className="absolute inset-0 z-30 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all active:scale-[0.98]">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsCompressing(prev => ({ ...prev, [idx]: true }));
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const dataUrl = reader.result as string;

                              if (file.type.startsWith('video/')) {
                                // Handle Video
                                handleImageChange(idx, dataUrl);
                                const video = document.createElement('video');
                                video.src = dataUrl;
                                video.onloadedmetadata = () => {
                                  setResolutions(prev => ({ ...prev, [idx]: `${video.videoWidth}×${video.videoHeight}` }));
                                };
                                setIsCompressing(prev => ({ ...prev, [idx]: false }));
                              } else {
                                // Handle Image
                                const img = new (window as any).Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  let width = img.width;
                                  let height = img.height;

                                  const MAX_SIZE = 2400;
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

                                  const compressedDataUrl = canvas.toDataURL('image/webp', 0.9);
                                  handleImageChange(idx, compressedDataUrl);
                                  setResolutions(prev => ({ ...prev, [idx]: `${width}×${height}` }));
                                  setIsCompressing(prev => ({ ...prev, [idx]: false }));
                                };
                                img.src = dataUrl;
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {isCompressing[idx] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-white text-primary text-[9px] md:text-[10px] font-black uppercase rounded-full shadow-lg">
                          {img ? dict.new_product.change : dict.new_product.upload}
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary/20">
                      {idx === 0 ? dict.new_product.main_cover : dict.new_product.angle.replace('{count}', (idx + 1).toString())}
                    </span>
                    {img && (
                      <button
                        type="button"
                        onClick={() => handleImageChange(idx, "")}
                        className="text-[8px] md:text-[9px] font-black uppercase text-red-400 hover:text-red-500 active:scale-90"
                      >
                        {dict.new_product.remove}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customization & Details */}
          <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-5 md:pb-6 border-b border-primary/5">
              <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-accent" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">{dict.new_product.special_details}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="flex items-start gap-4 p-5 md:p-6 bg-cream/20 rounded-2xl md:rounded-[2rem] border border-primary/5">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    id="personalize"
                    checked={formData.canPersonalize}
                    onChange={(e) => setFormData({ ...formData, canPersonalize: e.target.checked })}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-primary/20 text-accent focus:ring-accent"
                  />
                </div>
                <label htmlFor="personalize" className="cursor-pointer">
                  <p className="font-bold text-primary text-sm md:text-base">{dict.new_product.allow_personalization}</p>
                  <p className="text-[10px] md:text-xs text-charcoal/50">{dict.new_product.personalization_desc}</p>
                </label>
              </div>

              <AnimatePresence>
                {formData.canPersonalize && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="col-span-full space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.personalization_prompt_label}</label>
                    <textarea
                      value={formData.personalizationPrompt}
                      onChange={(e) => setFormData({ ...formData, personalizationPrompt: e.target.value })}
                      placeholder={dict.new_product.personalization_prompt_placeholder}
                      className="w-full h-24 p-5 bg-accent/5 border border-accent/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-medium resize-none text-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.promo_badge_label}</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder={dict.new_product.promo_badge_placeholder}
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.initial_stock_label}</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder={dict.new_product.initial_stock_placeholder}
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="p-5 md:p-6 bg-red-50 text-red-500 rounded-2xl md:rounded-[2rem] text-center font-bold animate-pulse text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="h-16 w-full md:w-auto md:px-16 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 duration-200"
            >
              {isLoading ? dict.new_product.listing_treasure : dict.new_product.list_product_btn}
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

