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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface NewProductClientProps {
  artisanId: string;
}

export function NewProductClient({ artisanId }: NewProductClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Ceramics",
    images: ["", "", ""],
    canPersonalize: false,
    badge: "",
    stock: "1"
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    "Ceramics", "Jewelry", "Wedding", "Personalized", "Art & Collectibles", "Vintage", "Stationery"
  ];

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.price || !formData.images[0]) {
      setError("Please fill in all required fields (Name, Price, and at least one Image).");
      setIsLoading(false);
      return;
    }

    const res = await createProduct(artisanId, {
      ...formData,
      images: formData.images.filter(img => img !== "")
    });

    if (res.success) {
      window.location.href = "/studio";
    } else {
      setError(res.error || "Failed to create product.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <Link 
          href="/studio" 
          className="inline-flex items-center gap-2 text-primary/40 hover:text-primary text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Studio
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">List a New <span className="serif italic font-normal text-accent">Treasure</span></h1>
            <p className="text-charcoal/40 mt-1">Share your craftsmanship with the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main Info */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-primary">The Essentials</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Product Title *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Hand-Thrown Midnight Glaze Vase"
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Price (USD) *
                  </label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="95.00"
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-left flex items-center justify-between shadow-sm"
                  >
                    <span className={cn("font-medium", formData.category ? "text-primary" : "text-primary/50")}>
                      {formData.category || "Select Category"}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-primary/40 transition-transform", isCategoryOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-primary/10 rounded-[2rem] shadow-2xl p-4 space-y-1"
                      >
                        {categories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat });
                              setIsCategoryOpen(false);
                            }}
                            className={cn(
                              "w-full px-6 py-3 text-left rounded-xl transition-all font-bold text-sm",
                              formData.category === cat 
                                ? "bg-primary text-white" 
                                : "text-primary/60 hover:bg-primary/5"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                   Description *
                </label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell the story of this piece..."
                  className="w-full h-40 p-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-medium resize-none shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
              <ImageIcon className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-primary">Visual Gallery</h2>
            </div>
            <p className="text-sm text-charcoal/40 italic">Provide URLs to your high-resolution photographs.</p>

            <div className="grid md:grid-cols-3 gap-6">
              {formData.images.map((img, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="relative aspect-square rounded-2xl bg-cream/50 flex flex-col items-center justify-center overflow-hidden border border-dashed border-primary/20 group">
                    {img ? (
                      <Image src={img} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-primary/10" />
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
                              handleImageChange(idx, reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="px-4 py-2 bg-white text-primary text-[10px] font-black uppercase rounded-full shadow-lg">
                        {img ? "Change" : "Upload"}
                      </div>
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={img.startsWith('data:') ? 'Local Image uploaded' : img}
                    readOnly
                    className="w-full h-10 px-4 text-xs bg-white border border-primary/10 rounded-xl font-bold text-primary/40 shadow-sm"
                  />
                  {img && (
                    <button 
                      type="button"
                      onClick={() => handleImageChange(idx, "")}
                      className="text-[9px] font-black uppercase text-red-400 hover:text-red-500 ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Customization & Details */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-primary">Special Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start gap-4 p-6 bg-cream/20 rounded-[2rem] border border-primary/5">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    id="personalize"
                    checked={formData.canPersonalize}
                    onChange={(e) => setFormData({...formData, canPersonalize: e.target.checked})}
                    className="w-5 h-5 rounded border-primary/20 text-accent focus:ring-accent" 
                  />
                </div>
                <label htmlFor="personalize" className="cursor-pointer">
                  <p className="font-bold text-primary">Allow Personalization</p>
                  <p className="text-xs text-charcoal/50">Allow buyers to add bespoke engravings or details.</p>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-primary/40 uppercase tracking-widest">Promotion Badge</label>
                <input 
                  type="text" 
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  placeholder="e.g. Best Seller, New Arrival"
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-primary/40 uppercase tracking-widest">Initial Stock</label>
                <input 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="e.g. 10"
                  className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="p-6 bg-red-50 text-red-500 rounded-[2rem] text-center font-bold animate-pulse">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              disabled={isLoading}
              className="h-16 px-16 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 disabled:opacity-50"
            >
              {isLoading ? "Listing Treasure..." : "List Product in Gallery"}
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
