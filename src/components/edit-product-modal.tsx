"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, DollarSign, Tag, Type, Image as ImageIcon, CheckCircle2, Save, ChevronDown, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    images: product.images.length >= 3 ? [...product.images] : [...product.images, ...Array(3 - product.images.length).fill("")],
    canPersonalize: product.canPersonalize,
    badge: product.badge || "",
    stock: (product.stock || 0).toString()
  });
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
      router.refresh(); // Use router refresh instead of hard reload
      onClose();
    } else {
      setError(res.error || "Failed to update product.");
      setIsLoading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
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
          >
            {/* Header */}
            <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary">Edit <span className="serif italic font-normal text-accent">Treasure</span></h2>
                <p className="text-charcoal/40 text-sm mt-1">Refine your handcrafted masterpiece details</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-12 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-14">
                {/* Essentials */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/5">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">Core Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Product Title *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Price (USD)</label>
                        <input 
                          type="number" 
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Category</label>
                        <CategoryDropdown 
                            value={formData.category} 
                            onChange={(val) => setFormData({...formData, category: val})} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full h-32 p-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none shadow-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* Visuals */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/5">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">Media Gallery</h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-xs text-charcoal/40 italic">Showcase your masterpiece with high-res photos and cinematic videos.</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full">
                       <Sparkles className="w-3 h-3 text-accent" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-accent">Optimal: 1080×1080 | Max: 100MB</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
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
                            <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">
                              {resolutions[idx]}
                            </div>
                          )}

                          {img && (img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i)) && (
                            <div className="absolute top-4 right-4 z-20 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                          )}

                          <label className="absolute inset-0 z-30 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all">
                            <input 
                              type="file" 
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
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
                                    } else {
                                      // Handle Image
                                      const img = new (window as any).Image();
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        let width = img.width;
                                        let height = img.height;
                                        
                                        const MAX_SIZE = 1200;
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
                                        ctx?.drawImage(img, 0, 0, width, height);
                                        
                                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                        handleImageChange(idx, compressedDataUrl);
                                        setResolutions(prev => ({ ...prev, [idx]: `${width}×${height}` }));
                                      };
                                      img.src = dataUrl;
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="px-4 py-2 bg-white text-primary text-[9px] font-black uppercase rounded-full shadow-lg">
                              {img ? "Change" : "Upload"}
                            </div>
                          </label>
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary/20">
                             Slot {idx + 1}
                           </span>
                           {img && (
                             <button 
                               type="button"
                               onClick={() => handleImageChange(idx, "")}
                               className="text-[9px] font-black uppercase text-red-400 hover:text-red-500"
                             >
                               Remove
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
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40">Inventory & Meta</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Current Stock</label>
                        <input 
                          type="number" 
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          className="w-full h-12 px-5 bg-white border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary shadow-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-cream/10 rounded-xl border border-primary/5">
                        <input 
                          type="checkbox" 
                          id="edit-personalize"
                          checked={formData.canPersonalize}
                          onChange={(e) => setFormData({...formData, canPersonalize: e.target.checked})}
                          className="w-4 h-4 rounded text-accent focus:ring-accent"
                        />
                        <label htmlFor="edit-personalize" className="text-xs font-bold text-primary cursor-pointer">
                          Allow Personalization
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Promotion Badge</label>
                      <input 
                        type="text" 
                        value={formData.badge}
                        onChange={(e) => setFormData({...formData, badge: e.target.value})}
                        placeholder="e.g. Best Seller"
                        className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
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
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 h-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Saving Changes..." : "Save Changes"}
                <Save className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CategoryDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = ["Ceramics", "Jewelry", "Wedding", "Personalized", "Art & Collectibles", "Vintage", "Stationery"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary flex items-center justify-between group shadow-sm"
      >
        <span className="truncate">{value}</span>
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
              className="absolute left-0 right-0 top-full bg-white border border-primary/10 rounded-2xl shadow-2xl z-[120] py-2 overflow-hidden overflow-y-auto max-h-[200px] custom-scrollbar border-b-4 border-b-accent/20"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-5 py-3 text-left text-[13px] font-bold transition-all",
                    value === cat 
                        ? "bg-primary text-white" 
                        : "text-primary hover:bg-cream/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

