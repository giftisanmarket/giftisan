"use client";

import { useState, useEffect, memo } from "react";
import { X, Sparkles, DollarSign, Tag, Type, Image as ImageIcon, CheckCircle2, Save, ChevronDown, Video, Loader2, ShieldCheck } from "lucide-react";
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_DURATION = 30; // 30 seconds

// --- Memoized Sub-Components for Performance ---

const EssentialsSection = memo(({ textData, setTextData, readOnly, dict }: any) => (
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
          value={textData.name}
          onChange={(e) => setTextData((prev: any) => ({...prev, name: e.target.value}))}
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
            value={textData.price}
            onChange={(e) => setTextData((prev: any) => ({...prev, price: e.target.value}))}
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
              value={textData.category} 
              onChange={(val: string) => setTextData((prev: any) => ({...prev, category: val}))} 
              disabled={readOnly}
              dict={dict}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.new_product.description_label}</label>
        <textarea 
          required
          value={textData.description}
          onChange={(e) => setTextData((prev: any) => ({...prev, description: e.target.value}))}
          disabled={readOnly}
          className={cn(
            "w-full h-32 p-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none shadow-sm",
            readOnly && "bg-cream/20 cursor-default"
          )}
        />
      </div>
    </div>
  </section>
));

EssentialsSection.displayName = "EssentialsSection";

const MediaSection = memo(({ images, resolutions, isCompressing, onImageChange, readOnly, dict }: any) => (
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
    
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {images.map((img: string, idx: number) => (
        <MediaSlot 
          key={idx} 
          idx={idx} 
          img={img} 
          resolution={resolutions[idx]} 
          isCompressing={isCompressing[idx]} 
          onImageChange={onImageChange} 
          readOnly={readOnly} 
          dict={dict} 
        />
      ))}
    </div>
  </section>
));

MediaSection.displayName = "MediaSection";

const MediaSlot = memo(({ idx, img, resolution, isCompressing, onImageChange, readOnly, dict }: any) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(dict.home.upload_rules.format_error);
      return;
    }

    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      toast.error(dict.home.upload_rules.image_size_error);
      return;
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      toast.error(dict.home.upload_rules.video_size_error);
      return;
    }

    onImageChange(idx, file, true); // true for "starting compression"
  };

  return (
    <div className="space-y-3">
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

        {resolution && (
          <div className="absolute top-4 start-4 z-20 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">
            {resolution}
          </div>
        )}

        {!readOnly && (
          <label className="absolute inset-0 z-30 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              className="hidden"
              onChange={handleFileChange}
            />
            {isCompressing ? (
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
             onClick={() => onImageChange(idx, null)}
             className="text-[9px] font-black uppercase text-red-400 hover:text-red-500"
           >
             {dict.new_product.remove}
           </button>
         )}
      </div>
    </div>
  );
});

MediaSlot.displayName = "MediaSlot";

const DetailsSection = memo(({ textData, setTextData, readOnly, dict }: any) => (
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
            value={textData.stock}
            onChange={(e) => setTextData((prev: any) => ({...prev, stock: e.target.value}))}
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
            checked={textData.canPersonalize}
            onChange={(e) => !readOnly && setTextData((prev: any) => ({...prev, canPersonalize: e.target.checked}))}
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
          value={textData.badge}
          onChange={(e) => setTextData((prev: any) => ({...prev, badge: e.target.value}))}
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
));

DetailsSection.displayName = "DetailsSection";

// --- Main Modal Component ---

export function EditProductModal({ product, isOpen, onClose, readOnly = false, dict }: EditProductModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState<Record<number, boolean>>({});
  
  const [textData, setTextData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    canPersonalize: product.canPersonalize,
    badge: product.badge || "",
    stock: (product.stock || 0).toString()
  });

  const [images, setImages] = useState<string[]>(
    product.images.length >= 10 ? [...product.images] : [...product.images, ...Array(10 - product.images.length).fill("")]
  );

  const [resolutions, setResolutions] = useState<Record<number, string>>({});
  const isRTL = typeof document !== 'undefined' && (document.dir === 'rtl' || document.documentElement.dir === 'rtl');

  useEffect(() => {
    images.forEach((img, idx) => {
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
  }, [images, resolutions]);

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

  const handleImageChange = async (index: number, file: File | null, isStarting: boolean = false) => {
    if (!file) {
      const newImages = [...images];
      newImages[index] = "";
      setImages(newImages);
      setResolutions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      return;
    }

    setIsCompressing(prev => ({ ...prev, [index]: true }));
    
    if (file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > MAX_VIDEO_DURATION) {
          toast.error(dict.home.upload_rules.video_duration_error);
          setIsCompressing(prev => ({ ...prev, [index]: false }));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const newImages = [...images];
          newImages[index] = reader.result as string;
          setImages(newImages);
          setResolutions(prev => ({ ...prev, [index]: `${videoElement.videoWidth}×${videoElement.videoHeight}` }));
          setIsCompressing(prev => ({ ...prev, [index]: false }));
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
          const MAX_RES = 2400;
          if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
          else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
          
          const newImages = [...images];
          newImages[index] = canvas.toDataURL('image/webp', 0.85);
          setImages(newImages);
          setResolutions(prev => ({ ...prev, [index]: `${width}×${height}` }));
          setIsCompressing(prev => ({ ...prev, [index]: false }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!textData.name || !textData.price || !images[0]) {
      toast.error(dict.new_product.validation_error);
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("name", textData.name);
    form.append("description", textData.description);
    form.append("price", textData.price.trim());
    form.append("category", textData.category);
    form.append("canPersonalize", textData.canPersonalize.toString());
    form.append("badge", textData.badge);
    form.append("stock", textData.stock.trim());
    
    images.forEach((img, i) => {
      if (img) form.append(`image-${i}`, img);
    });

    const res = await updateProduct(product.id, form);

    if (res.success) {
      toast.success(dict.edit_product.update_success || "Treasure updated successfully");
      router.refresh();
      onClose();
    } else {
      toast.error(res.error || dict.edit_product.update_failed || "Failed to update product.");
      setIsLoading(false);
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
                <EssentialsSection 
                  textData={textData} 
                  setTextData={setTextData} 
                  readOnly={readOnly} 
                  dict={dict} 
                />

                <MediaSection 
                  images={images} 
                  resolutions={resolutions} 
                  isCompressing={isCompressing} 
                  onImageChange={handleImageChange} 
                  readOnly={readOnly} 
                  dict={dict} 
                />

                <DetailsSection 
                  textData={textData} 
                  setTextData={setTextData} 
                  readOnly={readOnly} 
                  dict={dict} 
                />
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

const CategoryDropdown = memo(({ value, onChange, disabled = false, dict }: { value: string, onChange: (val: string) => void, disabled?: boolean, dict: any }) => {
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
});

CategoryDropdown.displayName = "CategoryDropdown";
