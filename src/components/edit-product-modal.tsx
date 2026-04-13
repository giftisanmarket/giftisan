"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, DollarSign, Tag, Type, Image as ImageIcon, CheckCircle2, Save } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await updateProduct(product.id, {
      ...formData,
      price: formData.price.trim(),
      stock: formData.stock.trim(),
      images: formData.images.filter(img => img !== "")
    });

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
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Essentials */}
                <section className="bg-white rounded-[2rem] p-8 border border-primary/5 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-primary/5">
                    <Type className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-heading font-bold text-primary">The Essentials</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Product Title *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
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
                          className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Category</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                        >
                          {["Ceramics", "Jewelry", "Wedding", "Personalized", "Art & Collectibles", "Vintage", "Stationery"].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full h-32 p-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Visuals */}
                <section className="bg-white rounded-[2rem] p-8 border border-primary/5 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-primary/5">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-heading font-bold text-primary">Visual Gallery</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="relative aspect-square rounded-[1.5rem] bg-cream/30 overflow-hidden border border-primary/10 group shadow-inner">
                          {img ? (
                            <Image src={img} alt="Preview" fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                               <ImageIcon className="w-8 h-8 text-primary/10" />
                            </div>
                          )}
                          <label className="absolute inset-0 z-10 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center bg-primary/20 backdrop-blur-sm transition-all">
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
                                    };
                                    img.src = reader.result;
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
                <section className="bg-white rounded-[2rem] p-8 border border-primary/5 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-primary/5">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-heading font-bold text-primary">Fulfillment & Badges</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Current Stock</label>
                        <input 
                          type="number" 
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          className="w-full h-12 px-5 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
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
            <div className="p-8 bg-white border-t border-primary/5 flex justify-end gap-4">
              <button 
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
