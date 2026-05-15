"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
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
  Loader2,
  ShieldCheck,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface NewProductClientProps {
  artisanId: string;
  dict: any;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_DURATION = 30; // 30 seconds

const VariantRow = memo(({ v, i, variants, setVariants, dict }: any) => (
  <tr className="hover:bg-cream/20 transition-colors group">
    <td className="px-6 py-4">
      <div className="relative w-12 h-12 bg-cream rounded-xl overflow-hidden border border-primary/5 flex items-center justify-center group/img">
        {v.image ? (
          <img src={v.image} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-5 h-5 text-primary/20" />
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
                  let width = img.width;
                  let height = img.height;
                  const MAX_RES = 1080;
                  if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
                  else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
                  canvas.width = width; canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
                  
                  const newVariants = [...variants];
                  newVariants[i] = { ...newVariants[i], image: canvas.toDataURL('image/webp', 0.75) };
                  setVariants(newVariants);
                };
                img.src = reader.result as string;
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    </td>
    <td className="px-6 py-4 font-bold text-primary">{v.name}</td>
    <td className="px-6 py-4">
      <input 
        type="number" 
        value={v.price}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], price: e.target.value };
          setVariants(newVariants);
        }}
        className="w-24 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4">
      <div className="space-y-1">
        <input 
          type="number" 
          value={v.stock}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], stock: e.target.value };
            setVariants(newVariants);
          }}
          className={cn(
            "w-20 h-10 bg-white border rounded-xl px-3 focus:outline-none font-bold",
            parseInt(v.stock) < 5 ? "border-orange-300 focus:border-orange-500" : "border-primary/20 focus:border-accent"
          )}
        />
        {parseInt(v.stock) < 5 && (
          <p className="text-[8px] font-black uppercase text-orange-500 tracking-tighter">{dict.edit_product.low_stock}!</p>
        )}
      </div>
    </td>
    <td className="px-6 py-4">
      <input 
        type="text" 
        value={v.badge || ""}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], badge: e.target.value };
          setVariants(newVariants);
        }}
        placeholder="e.g. Rare"
        className="w-24 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4">
      <input 
        type="text" 
        value={v.sku}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], sku: e.target.value };
          setVariants(newVariants);
        }}
        placeholder={dict.checkout.optional}
        className="w-28 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4 text-end">
      <button 
        type="button"
        onClick={() => setVariants(variants.filter((_: any, idx: number) => idx !== i))}
        className="text-red-400 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </td>
  </tr>
));

VariantRow.displayName = "VariantRow";

const VariantCard = memo(({ v, i, variants, setVariants, dict }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm space-y-5">
    <div className="flex items-center gap-4">
      <div className="relative w-14 h-14 bg-cream rounded-xl overflow-hidden border border-primary/5 flex items-center justify-center shrink-0">
        {v.image ? (
          <img src={v.image} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-primary/10" />
        )}
        <input 
          type="file" 
          accept="image/*"
          className="absolute inset-0 opacity-0"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const img = new (window as any).Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_RES = 1080;
                  if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
                  else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
                  canvas.width = width; canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
                  
                  const newVariants = [...variants];
                  newVariants[i] = { ...newVariants[i], image: canvas.toDataURL('image/webp', 0.75) };
                  setVariants(newVariants);
                };
                img.src = reader.result as string;
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-primary truncate">{v.name}</p>
        <button 
          type="button"
          onClick={() => setVariants(variants.filter((_: any, idx: number) => idx !== i))}
          className="text-[10px] font-black uppercase text-red-400 mt-1"
        >
          {dict.common.remove}
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.new_product.price_label}</label>
        <input 
          type="number" 
          value={v.price}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], price: e.target.value };
            setVariants(newVariants);
          }}
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.new_product.initial_stock_label}</label>
        <input 
          type="number" 
          value={v.stock}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], stock: e.target.value };
            setVariants(newVariants);
          }}
          className={cn(
            "w-full h-10 bg-cream/30 border rounded-xl px-3 font-bold text-sm",
            parseInt(v.stock) < 5 ? "border-orange-300" : "border-primary/5"
          )}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.edit_product.variant_badge}</label>
        <input 
          type="text" 
          value={v.badge || ""}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], badge: e.target.value };
            setVariants(newVariants);
          }}
          placeholder="e.g. Rare"
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.edit_product.sku_label}</label>
        <input 
          type="text" 
          value={v.sku}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], sku: e.target.value };
            setVariants(newVariants);
          }}
          placeholder={dict.checkout.optional}
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
    </div>
  </div>
));

VariantCard.displayName = "VariantCard";

const VariationsSection = memo(({ dict, options, setOptions, variants, setVariants, basePrice }: any) => {
  const [newOptionName, setNewOptionName] = useState("");

  const addOption = () => {
    if (newOptionName.trim()) {
      setOptions([...options, { name: newOptionName.trim(), values: [] }]);
      setNewOptionName("");
    }
  };

  const addValue = (optIdx: number, val: string) => {
    if (!val.trim()) return;
    const newOptions = [...options];
    if (!newOptions[optIdx].values.includes(val.trim())) {
      newOptions[optIdx].values.push(val.trim());
      setOptions(newOptions);
    }
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const newOptions = [...options];
    newOptions[optIdx].values.splice(valIdx, 1);
    setOptions(newOptions);
  };

  const generateVariants = () => {
    const combos = options.reduce((acc: any[], opt: any) => {
      if (opt.values.length === 0) return acc;
      const nextCombos: any[] = [];
      opt.values.forEach((val: string) => {
        if (acc.length === 0) {
          nextCombos.push({ [opt.name]: val });
        } else {
          acc.forEach((combo: any) => {
            nextCombos.push({ ...combo, [opt.name]: val });
          });
        }
      });
      return nextCombos;
    }, [] as any[]);

    const newVariants = combos.map((combo: any) => {
      const name = Object.values(combo).join(" / ");
      return {
        name,
        price: basePrice,
        stock: "0",
        sku: "",
        options: combo
      };
    });
    setVariants(newVariants);
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
        <Tag className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-heading font-bold text-primary">{dict.edit_product.variations}</h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <input 
            type="text" 
            placeholder={dict.edit_product.option_name_placeholder}
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            className="flex-1 py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:border-accent font-bold shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOption();
              }
            }}
          />
          <button 
            type="button"
            onClick={addOption}
            className="h-14 px-8 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            {dict.edit_product.add_option}
          </button>
        </div>
        <p className="text-[10px] font-bold text-accent/60 uppercase tracking-widest px-2">{dict.edit_product.enter_to_add}</p>

        <div className="space-y-4">
          {options.map((opt: any, optIdx: number) => (
            <div key={optIdx} className="p-6 bg-cream/30 rounded-2xl border border-primary/5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">{opt.name}</h4>
                <button 
                  type="button" 
                  onClick={() => setOptions(options.filter((_: any, i: number) => i !== optIdx))}
                  className="text-[10px] font-bold text-red-500 uppercase hover:text-red-600"
                >
                  {dict.common.remove}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val: string, valIdx: number) => (
                  <span key={valIdx} className="px-3 py-1 bg-white border border-primary/10 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-in zoom-in-50">
                    {val}
                    <button type="button" onClick={() => removeValue(optIdx, valIdx)} className="text-red-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder={dict.edit_product.add_value}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addValue(optIdx, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="bg-transparent border-none focus:outline-none text-xs font-bold min-w-[120px] placeholder:text-primary/20"
                />
                <span className="text-[9px] font-bold text-accent/40 uppercase tracking-tighter">{dict.edit_product.enter_to_add}</span>
              </div>
            </div>
          ))}
        </div>

        {options.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="button"
              onClick={generateVariants}
              className="flex-1 py-4 border-2 border-dashed border-accent/20 text-accent font-black uppercase tracking-widest rounded-2xl hover:bg-accent/5 transition-all active:scale-[0.99] text-[10px] md:text-sm"
            >
              {dict.edit_product.generate_variants}
            </button>
            {variants.length > 0 && (
              <button 
                type="button"
                onClick={() => {
                  const newVariants = variants.map((v: any) => ({ ...v, price: basePrice }));
                  setVariants(newVariants);
                  toast.success(dict.edit_product.prices_synced);
                }}
                className="px-8 py-4 bg-cream text-primary border border-primary/10 font-bold rounded-2xl hover:bg-cream/50 transition-all flex items-center justify-center gap-2 text-xs md:text-base"
              >
                <DollarSign className="w-5 h-5 text-accent" />
                {dict.edit_product.apply_base_price}
              </button>
            )}
          </div>
        )}

        {variants.length > 0 && (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-[2rem] border border-primary/10 shadow-inner">
              <table className="w-full text-start text-xs">
                <thead className="bg-primary/5 text-primary/40 font-black uppercase tracking-tighter">
                  <tr>
                    <th className="px-6 py-4 text-start w-12"></th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.variant_name}</th>
                    <th className="px-6 py-4 text-start">{dict.new_product.price_label}</th>
                    <th className="px-6 py-4 text-start">{dict.new_product.initial_stock_label}</th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.variant_badge}</th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.sku_label}</th>
                    <th className="px-4 py-4 text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {variants.map((v: any, i: number) => (
                    <VariantRow key={i} v={v} i={i} variants={variants} setVariants={setVariants} dict={dict} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {variants.map((v: any, i: number) => (
                <VariantCard key={i} v={v} i={i} variants={variants} setVariants={setVariants} dict={dict} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

VariationsSection.displayName = "VariationsSection";

export function NewProductClient({ artisanId, dict }: NewProductClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const [options, setOptions] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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

  const handleImageChange = useCallback((index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev: any) => ({ ...prev, images: newImages }));
    if (!value) {
      setResolutions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  }, [formData.images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.price || !formData.images[0]) {
      toast.error(dict.new_product.validation_error);
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

    form.append("variants", JSON.stringify(variants));

    try {
      const res = await createProduct(artisanId, form);

      if (res.success) {
        toast.success(dict.new_product.success_message || "Treasure listed successfully!");
        window.location.href = "/studio";
      } else {
        toast.error(res.error || "Failed to create product.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(dict.common?.error || "A connection error occurred. Please check your signal.");
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
                  className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
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
                    className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
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

          <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-5 md:pb-6 border-b border-primary/5">
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">{dict.new_product.media_gallery}</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-xs md:text-sm text-charcoal/40 italic">{dict.new_product.media_desc}</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full w-fit">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-accent">{dict.new_product.optimal_size}</span>
                </div>
              </div>
              
              {/* No Logos Warning */}
              <div className="flex items-center gap-3 px-5 py-3 bg-red-50/50 border border-red-100 rounded-2xl">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-red-600 uppercase tracking-wide">
                    {dict.home.upload_rules.no_logos_note}
                  </p>
                  <p className="text-[9px] md:text-[10px] text-red-400 font-medium">
                    {dict.home.upload_rules.clean_media_note}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {formData.images.map((img, idx) => (
                <div key={idx} className="space-y-3 md:space-y-4">
                  <div className="relative aspect-square rounded-[1.5rem] md:rounded-2xl bg-cream/50 flex flex-col items-center justify-center overflow-hidden border border-dashed border-primary/20 group">
                    {img ? (
                      img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i) ? (
                        <video src={img} className="w-full h-full object-cover" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
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

                    <label className="absolute inset-0 z-30 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all active:scale-[0.98]">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          // Rule 1: Format Validation
                          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
                          if (!allowedTypes.includes(file.type)) {
                            toast.error(dict.home.upload_rules.format_error);
                            return;
                          }

                          // Rule 2: Size Validation
                          if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
                            toast.error(dict.home.upload_rules.image_size_error);
                            return;
                          }
                          if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
                            toast.error(dict.home.upload_rules.video_size_error);
                            return;
                          }

                          setIsCompressing(prev => ({ ...prev, [idx]: true }));
                          
                          if (file.type.startsWith('video/')) {
                            // Rule 3: Video Duration Validation
                            const videoElement = document.createElement('video');
                            videoElement.preload = 'metadata';
                            videoElement.onloadedmetadata = () => {
                              window.URL.revokeObjectURL(videoElement.src);
                              if (videoElement.duration > MAX_VIDEO_DURATION) {
                                toast.error(dict.home.upload_rules.video_duration_error);
                                setIsCompressing(prev => ({ ...prev, [idx]: false }));
                                return;
                              }

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleImageChange(idx, reader.result as string);
                                setResolutions(prev => ({ ...prev, [idx]: `${videoElement.videoWidth}×${videoElement.videoHeight}` }));
                                setIsCompressing(prev => ({ ...prev, [idx]: false }));
                              };
                              reader.readAsDataURL(file);
                            };
                            videoElement.src = URL.createObjectURL(file);
                          } else {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new (window as any).Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;
                                const MAX_RES = 1280;
                                if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
                                else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
                                canvas.width = width; canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
                                handleImageChange(idx, canvas.toDataURL('image/webp', 0.75));
                                setResolutions(prev => ({ ...prev, [idx]: `${width}×${height}` }));
                                setIsCompressing(prev => ({ ...prev, [idx]: false }));
                              };
                              img.src = reader.result as string;
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
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] md:text-[10px] font-black uppercase rounded-full shadow-lg">
                          <div className="flex items-center gap-2">
                             <Upload className="w-3 h-3 md:w-4 md:h-4" />
                             {img ? dict.new_product.change : dict.new_product.upload}
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary/20">
                        {idx === 0 ? dict.new_product.main_cover : dict.new_product.angle.replace('{count}', (idx + 1).toString())}
                      </span>
                      {img && (
                        <button type="button" onClick={() => handleImageChange(idx, "")} className="text-[8px] md:text-[9px] font-black uppercase text-red-400 hover:text-red-500 active:scale-90">
                          {dict.new_product.remove}
                        </button>
                      )}
                    </div>
                    <p className="text-[7px] text-charcoal/30 font-bold uppercase tracking-tighter">
                      {idx % 2 === 0 ? dict.home.upload_rules.resolution_note : dict.home.upload_rules.video_note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <VariationsSection 
            options={options}
            setOptions={setOptions}
            variants={variants}
            setVariants={setVariants}
            basePrice={formData.price}
            dict={dict}
          />

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
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="col-span-full space-y-2 overflow-hidden">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.personalization_prompt_label}</label>
                    <textarea value={formData.personalizationPrompt} onChange={(e) => setFormData({ ...formData, personalizationPrompt: e.target.value })} placeholder={dict.new_product.personalization_prompt_placeholder} className="w-full h-24 p-5 bg-accent/5 border border-accent/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-medium resize-none text-sm" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.promo_badge_label}</label>
                <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder={dict.new_product.promo_badge_placeholder} className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.initial_stock_label}</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder={dict.new_product.initial_stock_placeholder} className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm" />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <button type="submit" disabled={isLoading} className="py-5 w-full md:w-auto md:px-16 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 duration-200">
              {isLoading ? dict.new_product.listing_treasure : dict.new_product.list_product_btn}
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
