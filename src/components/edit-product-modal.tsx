"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, DollarSign, Tag, Type, Image as ImageIcon, CheckCircle2, Save, ChevronDown, Video, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
  dict: any;
}

export function EditProductModal({ product, isOpen, onClose, readOnly = false, dict }: EditProductModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    images: product.images.length >= 10 ? [...product.images] : [...product.images, ...Array(10 - product.images.length).fill("")],
    canPersonalize: product.canPersonalize,
    badge: product.badge || "",
    stock: (product.stock || 0).toString()
  });
  const [resolutions, setResolutions] = useState<Record<number, string>>({});
  const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';

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

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price.trim());
    form.append("category", formData.category);
    form.append("canPersonalize", formData.canPersonalize.toString());
    form.append("badge", formData.badge);
    form.append("stock", formData.stock.trim());
    
    formData.images.forEach((img, i) => {
      if (img) form.append(`image-${i}`, img);
    });

    const res = await updateProduct(product.id, form);

    if (res.success) {
      toast.success(dict.edit_product.update_success || "Treasure updated successfully");
      router.refresh(); // Use router refresh instead of hard reload
      onClose();
    } else {
      setError(res.error || dict.edit_product.update_failed || "Failed to update product.");
      setIsLoading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
    // Clear resolution if image is removed
    if (!value) {
      setResolutions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-cream rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-white">
              <div>
                <h2 className={cn("text-3xl font-heading font-bold text-primary", isRTL && "font-black")}>
                  {dict.edit_product.edit_treasure} <span className="serif italic font-normal text-accent">{dict.edit_product.treasure_accent || "Treasure"}</span>
                </h2>
                <p className="text-charcoal/40 text-sm mt-1">{dict.edit_product.refine_details}</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-12 custom-scrollbar">
              {product.status === "REJECTED" && product.rejectionReason && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] flex items-start gap-6 mb-12"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-red-900 mb-1">{dict.edit_product.feedback_title}</h3>
                    <p className="text-red-700/80 text-sm italic font-medium leading-relaxed">"{product.rejectionReason}"</p>
                    <p className="text-red-900/40 text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                       <CheckCircle2 className="w-3 h-3" /> {dict.edit_product.feedback_desc}
                    </p>
                  </div>
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-14">
                {/* Essentials */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/5">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">{dict.edit_product.core_details}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.product_title_label}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={readOnly}
                        className={cn(
                          "w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm",
                          readOnly && "bg-cream/20 cursor-default"
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.price_label}</label>
                        <input 
                          type="number" 
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          disabled={readOnly}
                          className={cn(
                            "w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm",
                            readOnly && "bg-cream/20 cursor-default"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.category_label}</label>
                        <CategoryDropdown 
                            value={formData.category} 
                            onChange={(val) => setFormData({...formData, category: val})} 
                            disabled={readOnly}
                            dict={dict}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.description_label}</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        disabled={readOnly}
                        className={cn(
                          "w-full h-32 p-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none shadow-sm",
                          readOnly && "bg-cream/20 cursor-default"
                        )}
                      />
                    </div>
                  </div>
                </section>

                {/* Visuals */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/5">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">{dict.new_product.media_gallery}</h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-xs text-charcoal/40 italic">{dict.new_product.media_desc}</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full">
                       <Sparkles className="w-3 h-3 text-accent" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-accent">{dict.new_product.optimal_size}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="relative aspect-square rounded-[1.5rem] bg-cream/30 overflow-hidden border border-primary/10 group shadow-inner">
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                               <ImageIcon className="w-8 h-8 text-primary/10" />
                               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/20">Optimal 1080px</span>
                            </div>
                          )}

                          {resolutions[idx] && (
                            <div className="absolute top-4 start-4 z-20 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">
                              {resolutions[idx]}
                            </div>
                          )}

                          {img && (img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i)) && (
                            <div className="absolute top-4 end-4 z-20 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                          )}

                          {!readOnly && (
                            <label className="absolute inset-0 z-30 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all">
                              <input 
                                type="file" 
                                accept="image/*,video/*"
                                className="hidden"
                                id={`image-${idx}`}
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
                                <div className="px-4 py-2 bg-white text-primary text-[9px] font-black uppercase rounded-full shadow-lg">
                                  {img ? dict.new_product.change : dict.new_product.upload}
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary/20">
                             Slot {idx + 1}
                           </span>
                           {img && !readOnly && (
                             <button 
                               type="button"
                               onClick={() => handleImageChange(idx, "")}
                               className="text-[9px] font-black uppercase text-red-400 hover:text-red-500"
                             >
                               {dict.new_product.remove}
                             </button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Stock & Customization */}
                <section className="space-y-8 pb-10">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/5">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">{dict.new_product.special_details}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.initial_stock_label}</label>
                        <input 
                          type="number" 
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          disabled={readOnly}
                          className={cn(
                            "w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm",
                            readOnly && "bg-cream/20 cursor-default"
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-cream/10 rounded-xl border border-primary/5">
                        <input 
                          type="checkbox" 
                          id="edit-personalize"
                          disabled={readOnly}
                          checked={formData.canPersonalize}
                          onChange={(e) => !readOnly && setFormData({...formData, canPersonalize: e.target.checked})}
                          className="w-4 h-4 rounded text-accent focus:ring-accent"
                        />
                        <label htmlFor="edit-personalize" className="text-xs font-bold text-primary cursor-pointer">
                          {dict.new_product.allow_personalization}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.promo_badge_label}</label>
                      <input 
                        type="text" 
                        value={formData.badge}
                        onChange={(e) => setFormData({...formData, badge: e.target.value})}
                        placeholder="e.g. Best Seller"
                        disabled={readOnly}
                        className={cn(
                          "w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary",
                          readOnly && "cursor-default"
                        )}
                      />
                    </div>
                  </div>
                </section>

                {error && <p className="text-red-500 text-center font-bold text-sm">{error}</p>}
              </form>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/50 backdrop-blur-xl border-t border-primary/5 flex justify-end gap-6">
                  <button 
                type="button"
                onClick={onClose}
                className="px-8 h-12 text-primary font-bold hover:bg-primary/5 rounded-full transition-all"
              >
                {dict.common.cancel}
              </button>
              {readOnly ? (
                <button 
                  onClick={onClose}
                  className="px-12 h-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20"
                >
                  {dict.common.done || "Done Reviewing"}
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={cn(
                    "px-10 h-12 font-bold rounded-full transition-all shadow-xl flex items-center gap-2 disabled:opacity-50",
                    product.status === "REJECTED" 
                      ? "bg-accent text-white hover:bg-accent-light shadow-accent/20" 
                      : "bg-primary text-white hover:bg-primary-light shadow-primary/20"
                  )}
                >
                  {isLoading 
                    ? dict.edit_product.saving_changes 
                    : (product.status === "REJECTED" ? dict.edit_product.resolve_and_resubmit : dict.profile.save_changes)}
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CategoryDropdown({ value, onChange, disabled = false, dict }: { value: string, onChange: (val: string) => void, disabled?: boolean, dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    { id: "ceramics", label: dict.common.ceramics },
    { id: "jewelry", label: dict.common.jewelry },
    { id: "gift-boxes-sets", label: dict.common.categories_list?.["gift-boxes-sets"] || "Gift Boxes & Sets" },
    { id: "textiles", label: dict.common.textiles },
    { id: "woodwork", label: dict.common.woodwork },
    { id: "leatherwork", label: dict.common.leatherwork },
    { id: "culinary-arts", label: dict.common.categories_list?.["culinary-arts"] || "Culinary Arts" },
    { id: "beauty-apothecary", label: dict.common.categories_list?.["beauty-apothecary"] || "Beauty & Apothecary" },
    { id: "metalwork", label: dict.common.metalwork },
    { id: "glasswork", label: dict.common.glasswork },
    { id: "basketry", label: dict.common.basketry },
    { id: "fashion", label: dict.common.fashion },
    { id: "wedding", label: dict.common.wedding },
    { id: "personalized", label: dict.common.personalized },
    { id: "art-collectibles", label: dict.common.art_collectibles },
    { id: "vintage", label: dict.common.vintage },
    { id: "stationery", label: dict.common.stationery }
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary flex items-center justify-between group shadow-sm",
          disabled && "cursor-default"
        )}
      >
        <span className="truncate">
          {categories.find(c => c.id === value)?.label || value}
        </span>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
        >
            <ChevronDown className="w-4 h-4 text-primary/40 group-hover:text-accent transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[110]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute start-0 end-0 top-full bg-white border border-primary/10 rounded-2xl shadow-2xl z-[120] py-2 overflow-y-auto max-h-72 scrollbar-thin scrollbar-thumb-primary/10 border-b-4 border-b-accent/20"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onChange(cat.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-5 py-3 text-start text-[13px] font-bold transition-all",
                    value === cat.id 
                        ? "bg-primary text-white" 
                        : "text-primary hover:bg-cream/50"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


