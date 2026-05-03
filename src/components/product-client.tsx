"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { Heart, Share2, Star, Truck, ShieldCheck, Clock, MapPin, ArrowRight, CheckCircle2, Sparkles, Camera, ImagePlus, X, Video, Radio, MessageSquare, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { ContactArtisanButton } from "@/components/contact-artisan-button";
import { addReview, trackProductView } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { BespokeImage } from "./bespoke-image";
import Image from "next/image";
import { toast } from "react-hot-toast";

export function ProductClient({ product, relatedProducts, dict, lang, isAdmin, isOwner }: { product: any, relatedProducts: any[], dict: any, lang: string, isAdmin?: boolean, isOwner?: boolean }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(0);
  const [personalization, setPersonalization] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "artisan" | "reviews">("details");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [personalizationError, setPersonalizationError] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const personalizationRef = useRef<HTMLTextAreaElement>(null);

  // Extract unique options from variants
  const options = product.variants?.reduce((acc: any[], v: any) => {
    if (v.options) {
      // Safety: Handle both object and stringified JSON
      const vOptions = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
      Object.entries(vOptions).forEach(([name, value]) => {
        const existing = acc.find(o => o.name === name);
        if (existing) {
          if (!existing.values.includes(value)) existing.values.push(value as string);
        } else {
          acc.push({ name, values: [value as string] });
        }
      });
    }
    return acc;
  }, []) || [];

  useEffect(() => {
    if (options.length > 0 && Object.keys(selectedOptions).length === 0) {
      const initial: Record<string, string> = {};
      options.forEach((opt: any) => {
        initial[opt.name] = opt.values[0];
      });
      setSelectedOptions(initial);
    }
  }, [options]);

  useEffect(() => {
    if (product.variants?.length > 0) {
      const match = product.variants.find((v: any) => {
        const vOptions = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
        return Object.entries(selectedOptions).every(([name, val]) => vOptions[name] === val);
      });
      setSelectedVariant(match || null);
    }
  }, [selectedOptions, product.variants]);

  const isOptionValueAvailable = (optionName: string, value: string) => {
    if (!product.variants || product.variants.length === 0) return true;
    
    // Check if there is any variant that matches the currently selected options 
    // PLUS the value we are checking for this specific option
    return product.variants.some((v: any) => {
      const vOptions = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
      
      // We only care about matching the other selected options
      const matchesOtherSelections = Object.entries(selectedOptions).every(([name, val]) => {
        if (name === optionName) return true; // Skip the one we are checking
        return vOptions[name] === val;
      });

      return matchesOtherSelections && vOptions[optionName] === value && v.stock > 0;
    });
  };

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  useEffect(() => {
    if (product.id) {
      trackProductView(product.id);
    }
  }, [product.id]);
  
  const isVideo = (url: string) => {
    if (!url) return false;
    return url.includes('video/upload') || url.match(/\.(mp4|webm|ogg|mov|quicktime)/i) || url.startsWith('data:video');
  };
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new (window as any).Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 1000;
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
          
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.8);
          setReviewImages(prev => [...prev, compressedDataUrl].slice(0, 4));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    const res = await addReview({
      productId: product.id,
      userId: session.user.id as string,
      rating: newReview.rating,
      comment: newReview.comment,
      images: reviewImages
    });

    if (res.success) {
      toast.success(dict.product.review_posted_success, {
        icon: <Sparkles className="w-5 h-5 text-accent" />,
      });
      setNewReview({ rating: 5, comment: "" });
      setReviewImages([]);
      router.refresh();
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      toast.error(res.error || "Failed to post review", {
        icon: <X className="w-5 h-5 text-red-500" />,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Giftisan treasure`,
      text: `I found this incredible '${product.name}' by ${product.artisan.studioName || product.artisan.user.name} on Giftisan. Check it out!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(dict.product.share_copied, {
          icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <main className="min-h-screen bg-cream pb-20 overflow-x-hidden">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Status Banner for Owner/Admin */}
        {product.status !== "APPROVED" && (isAdmin || isOwner) && (
          <div className={cn(
            "mb-12 p-6 md:p-8 rounded-[2rem] border-2 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8",
            product.status === "REJECTED" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
          )}>
            <div className={cn(
              "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg",
              product.status === "REJECTED" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
            )}>
              {product.status === "REJECTED" ? <XCircle className="w-6 h-6 md:w-8 md:h-8" /> : <Clock className="w-6 h-6 md:w-8 md:h-8" />}
            </div>
            <div className="flex-1 text-center md:text-start">
              <h3 className={cn(
                "text-xl md:text-2xl font-heading font-black mb-2 tracking-tight",
                product.status === "REJECTED" ? "text-red-700" : "text-amber-700"
              )}>
                {product.status === "REJECTED" ? dict.admin.rejected : dict.admin.pending}
              </h3>
              <p className="text-sm md:text-base text-charcoal/60 leading-relaxed font-bold">
                {product.status === "REJECTED" 
                  ? (lang === 'ar' ? "تم رفض هذا الكنز. يرجى مراجعة تفاصيل المنتج أو التواصل مع الإدارة." : "This treasure has been rejected. Please review the details or contact support.")
                  : (lang === 'ar' ? "هذا الكنز قيد المراجعة حالياً ولن يظهر للجمهور حتى يتم قبوله." : "This treasure is currently under review and won't be visible to the public until approved.")
                }
              </p>
            </div>
            {isAdmin && (
               <Link href="/admin/products" className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl hover:bg-primary-light transition-all">
                 {dict.admin.overview}
               </Link>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 min-w-0">
          {/* Image Gallery */}
          <div className="space-y-6 min-w-0">
            <div className="relative group">
              <motion.div
                key={selectedVariant?.image || selectedImage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={() => {
                  setLightboxIndex(selectedImage);
                  setIsLightboxOpen(true);
                }}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-transparent cursor-zoom-in"
              >
                {isVideo(selectedVariant?.image || product.images[selectedImage]) ? (
                  <video
                    src={selectedVariant?.image || product.images[selectedImage]}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <BespokeImage
                    src={selectedVariant?.image || product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </motion.div>

              {/* Slider Controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
                    }}
                    className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-primary xl:opacity-0 xl:group-hover:opacity-100 opacity-100 transition-all hover:bg-white z-10"
                  >
                    <ArrowRight className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-primary xl:opacity-0 xl:group-hover:opacity-100 opacity-100 transition-all hover:bg-white z-10"
                  >
                    <ArrowRight className="w-6 h-6 rtl:rotate-180 ltr:rotate-0" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_: any, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          selectedImage === i ? "bg-primary w-4" : "bg-primary/20"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scrollbar-hide" dir="ltr">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 md:w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  {isVideo(img) ? (
                    <div className="relative w-full h-full">
                      <video src={img} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                              <Video className="w-4 h-4 text-white" />
                          </div>
                      </div>
                    </div>
                  ) : (
                    <BespokeImage src={img} alt="" fill className="object-contain" sizes="96px" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">{dict.common.categories_list?.[product.category.toLowerCase()] || product.category}</p>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4 leading-tight break-words">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-charcoal/40 font-medium">({product.reviews?.length || 0} {dict.product.reviews})</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleShare}
                  className="p-3 border border-primary/10 rounded-full hover:bg-white transition-all text-primary group"
                >
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Variant Badge Display */}
            <AnimatePresence mode="wait">
              {selectedVariant?.badge && (
                <motion.div
                  key={selectedVariant.badge}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit"
                >
                  <Sparkles className="w-3 h-3" />
                  {selectedVariant.badge}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-8">
              <p className="text-3xl font-heading font-bold text-primary">
                {dict.product.currency} {displayPrice}.00
              </p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  (displayStock || 0) > 5 ? "bg-green-500" : (displayStock || 0) > 0 ? "bg-orange-500" : "bg-red-500"
                )} />
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  (displayStock || 0) > 0 ? "text-primary/60" : "text-red-500"
                )}>
                  {(displayStock || 0) > 0 ? (
                    (displayStock || 0) < 5 
                      ? `${dict.product.in_stock.replace('{count}', displayStock.toString())} — ${dict.edit_product.low_stock_alert}` 
                      : dict.product.in_stock.replace('{count}', displayStock.toString())
                  ) : dict.product.sold_out}
                </span>
              </div>
            </div>

            {/* Options Selection */}
            {options.length > 0 && (
              <div className="space-y-6 mb-8">
                {options.map((opt: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                      {opt.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val: string, j: number) => (
                        <button
                          key={j}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                          disabled={!isOptionValueAvailable(opt.name, val)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all relative overflow-hidden",
                            selectedOptions[opt.name] === val 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                              : "bg-white text-primary border-primary/10 hover:border-accent",
                            !isOptionValueAvailable(opt.name, val) && "opacity-20 cursor-not-allowed pointer-events-auto grayscale"
                          )}
                        >
                          {val}
                          {!isOptionValueAvailable(opt.name, val) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-[1px] bg-primary/20 -rotate-45" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-lg text-charcoal/70 leading-relaxed mb-8 border-l-4 border-accent/20 ps-6 py-2 break-words">
              {product.description}
            </p>

            {/* Artisan Quick Bio */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
              <Link
                href={`/artisans/${product.artisan.slug || product.artisan.user.name.toLowerCase().replace(/ /g, "-")}`}
                className="flex items-center gap-4 p-5 md:p-6 bg-white rounded-3xl border border-primary/5 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all flex-1 active:scale-[0.98]"
              >
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-cream shrink-0">
                  <BespokeImage type="artisan" id={product.artisan.id} src={product.artisan.avatar} alt={product.artisan.user.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[8px] md:text-xs font-bold text-accent uppercase tracking-tighter">{dict.product.handcrafted_by}</p>
                    {product.artisan.isVerified && <CheckCircle2 className="w-3 h-3 text-accent" />}
                  </div>
                  <h3 className="text-lg md:text-xl font-heading font-bold text-primary truncate">{product.artisan.studioName || product.artisan.user.name}</h3>
                  <p className="text-xs text-charcoal/60 truncate">{dict.product.operating_out_of} {product.artisan.location}</p>
                </div>
              </Link>

              <div className="px-0">
                <ContactArtisanButton
                  artisanId={product.artisan.id}
                  artisanName={product.artisan.studioName || product.artisan.user.name}
                  productId={product.id}
                  productName={product.name}
                  artisanUserId={product.artisan.user.id}
                  dict={dict}
                />
              </div>
            </div>

            {product.canPersonalize && (
              <motion.div 
                animate={personalizationError ? { x: [-5, 5, -5, 5, 0] } : {}}
                className={cn(
                  "bg-white/50 border rounded-2xl p-6 mb-8 transition-colors",
                  personalizationError ? "border-red-400 bg-red-50/30" : "border-primary/10"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-bold text-primary">
                    {dict.product.personalize_treasure}
                  </h3>
                </div>
                <p className="text-xs text-charcoal/50 mb-4">{product.personalizationPrompt || dict.product.personalization_desc || "Our artisans will hand-emboss your text onto this piece."}</p>
                <textarea
                  ref={personalizationRef}
                  placeholder={dict.product.personalize_placeholder}
                  className={cn(
                    "w-full bg-white border rounded-xl p-4 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:border-accent min-h-[100px] resize-none transition-all placeholder:text-primary/40 shadow-inner",
                    personalizationError ? "border-red-400 focus:ring-red-200" : "border-primary/20 focus:ring-accent/20"
                  )}
                  value={personalization}
                  onChange={(e) => {
                    setPersonalization(e.target.value);
                    if (personalizationError) setPersonalizationError(false);
                  }}
                  required
                />
              </motion.div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (product.canPersonalize && !personalization.trim()) {
                      setPersonalizationError(true);
                      personalizationRef.current?.focus();
                      toast.error(lang === 'ar' ? "يرجى إدخال تفاصيل التخصيص أولاً" : "Please provide personalization details first");
                      return;
                    }
                    if (options.length > 0 && !selectedVariant) {
                       toast.error("Please select a variation first");
                       return;
                    }
                    
                    const productToCart = {
                      ...product,
                      price: displayPrice,
                      image: selectedVariant?.image || product.images[0],
                      stock: displayStock,
                      variantId: selectedVariant?.id || null,
                      variantName: selectedVariant?.name || null
                    };
                    addToCart(productToCart, personalization.trim());
                  }}
                  disabled={(displayStock || 0) <= 0}
                  className={cn(
                    "flex-1 h-16 bg-primary text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                    (displayStock || 0) > 0 
                      ? "hover:bg-primary-light shadow-primary/20" 
                      : "bg-charcoal/20 shadow-none !cursor-not-allowed pointer-events-auto"
                  )}
                >
                  {(displayStock || 0) > 0 ? `${dict.product.add_to_cart} — ${dict.product.currency} ${displayPrice}` : dict.product.sold_out}
                </button>
                <button
                  onClick={() => toggleFavorite(product)}
                  className={cn(
                    "w-16 h-16 border rounded-2xl transition-all flex items-center justify-center shrink-0 active:scale-95",
                    isFavorite(product.id)
                      ? "border-red-100 bg-red-50 text-red-500 shadow-inner"
                      : "border-primary/10 text-primary hover:bg-white"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isFavorite(product.id) && "fill-current")} />
                </button>
              </div>
              <button 
                onClick={() => {
                  if (product.canPersonalize && !personalization.trim()) {
                    setPersonalizationError(true);
                    personalizationRef.current?.focus();
                    toast.error(lang === 'ar' ? "يرجى إدخال تفاصيل التخصيص أولاً" : "Please provide personalization details first");
                    return;
                  }
                  if (options.length > 0 && !selectedVariant) {
                    toast.error("Please select a variation first");
                    return;
                  }

                  const productToCart = {
                    ...product,
                    price: displayPrice,
                    image: selectedVariant?.image || product.images[0],
                    stock: displayStock,
                    variantId: selectedVariant?.id || null,
                    variantName: selectedVariant?.name || null
                  };
                  addToCart(productToCart, personalization.trim(), true);
                  window.location.href = "/checkout";
                }}
                disabled={(displayStock || 0) <= 0}
                className={cn(
                  "w-full h-16 bg-white border-2 border-primary text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95",
                  (displayStock || 0) > 0 
                  ? "hover:bg-primary/5 shadow-xl shadow-primary/5" 
                  : "opacity-30 grayscale !cursor-not-allowed pointer-events-auto"
                )}
              >
                {(displayStock || 0) > 0 ? dict.product.buy_now : dict.product.sold_out}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, text: dict.product.benefit_fast_shipping },
                { icon: ShieldCheck, text: dict.product.benefit_carbon_neutral },
                { icon: Clock, text: dict.product.benefit_returns },
                { icon: Star, text: dict.product.benefit_gift_wrap },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-charcoal/60">
                  <item.icon className="w-5 h-5 text-accent/60" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deep Detail Tabs */}
        <section className="mt-24">
          <div className="border-b border-primary/10 flex gap-8 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "pb-4 font-bold transition-all border-b-2",
                activeTab === "details" ? "border-primary text-primary" : "border-transparent text-charcoal/40 hover:text-primary"
              )}
            >
              {dict.product.details}
            </button>
            <button
              onClick={() => setActiveTab("artisan")}
              className={cn(
                "pb-4 font-bold transition-all border-b-2",
                activeTab === "artisan" ? "border-primary text-primary" : "border-transparent text-charcoal/40 hover:text-primary"
              )}
            >
              {dict.product.artisan_story}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "pb-4 font-bold transition-all border-b-2",
                activeTab === "reviews" ? "border-primary text-primary" : "border-transparent text-charcoal/40 hover:text-primary"
              )}
            >
              {dict.product.reviews} ({product.reviews?.length || 0})
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[200px]"
          >
            {activeTab === "details" && (
              <div className="grid md:grid-cols-2 gap-16">
                <div className="prose prose-stone leading-relaxed text-charcoal/70">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">{dict.product.story_behind}</h3>
                  <p>
                    {dict.product.handcrafted_by} {product.artisan.studioName || product.artisan.user.name} {dict.product.operating_out_of.toLowerCase()} {product.artisan.location}, {dict.product.details_text_1 || "this treasure represents the pinnacle of artisanal craftsmanship. Every detail has been carefully considered to ensure a one-of-a-kind experience."}
                  </p>
                  <ul className="mt-8 space-y-4 list-disc ps-5">
                    <li>{dict.product.details_category}: {dict.common.categories_list?.[product.category.toLowerCase()] || product.category}</li>
                    <li>{dict.product.details_handcrafted_by}: {product.artisan.studioName || product.artisan.user.name}</li>
                    <li>{dict.product.details_personalization}: {product.canPersonalize ? dict.product.details_available : dict.product.details_not_available}</li>
                    <li>{dict.product.details_stock}: {product.stock > 0 ? dict.product.details_in_stock : dict.product.details_limited}</li>
                    <li>{dict.product.details_eco}</li>
                  </ul>
                </div>
                <div className="relative aspect-video rounded-3xl overflow-hidden group">
                  {product.artisan.bannerImage ? (
                    <BespokeImage 
                      src={product.artisan.bannerImage} 
                      alt="" 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                  
                  <div className="absolute bottom-6 start-6 end-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl">
                        <BespokeImage type="artisan" id={product.artisan.id} src={product.artisan.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent-light mb-0.5">The Studio</p>
                        <h4 className="font-heading font-bold text-lg leading-none">{product.artisan.studioName || product.artisan.user.name}</h4>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/artisans/${product.artisan.slug || product.artisan.user.name.toLowerCase().replace(/ /g, "-")}`}
                      className="px-6 h-10 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl"
                    >
                      {dict.product.visit_studio}
                    </Link>
                  </div>
                  
                  {/* Decorative badge */}
                  <div className="absolute top-6 end-6">
                    <div className="glass px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-white/40 backdrop-blur-md border border-white/40">
                      {dict.product.studio_hub}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "artisan" && (
              <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-start">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl shrink-0">
                    <BespokeImage type="artisan" id={product.artisan.id} src={product.artisan.avatar} alt={product.artisan.studioName || product.artisan.user.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <h3 className="text-4xl font-heading font-bold text-primary leading-tight">{product.artisan.studioName || product.artisan.user.name}</h3>
                        {product.artisan.isVerified && <CheckCircle2 className="w-6 h-6 text-accent" />}
                      </div>
                      <p className="text-accent font-black uppercase tracking-[0.2em] text-[10px]">
                        {dict.product.master_artisan || "Master Artisan"}: {product.artisan.user.name}
                      </p>
                    </div>
                    <p className="text-lg text-charcoal/70 italic leading-relaxed">
                      "{product.artisan.bio}"
                    </p>
                    <div className="flex items-center gap-2 text-charcoal/40 font-medium justify-center md:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>{dict.product.operating_out_of} {product.artisan.location}</span>
                    </div>
                    <Link
                      href={`/artisans/${product.artisan.slug || product.artisan.user.name.toLowerCase().replace(/ /g, "-")}`}
                      className="inline-flex items-center gap-2 px-8 h-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all"
                    >
                      {dict.product.visit_studio_gallery}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid lg:grid-cols-12 gap-16 items-start">
                {/* Review List */}
                <div className="lg:col-span-7 space-y-8">
                  {product.reviews?.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <p className="text-2xl font-heading font-bold text-primary/20 italic">{dict.product.no_reviews_text}</p>
                      {!session && <p className="text-charcoal/40 text-sm">{dict.product.signin_to_share}</p>}
                    </div>
                  ) : (
                    product.reviews.map((review: any) => (
                      <div key={review.id} className="pb-8 border-b border-primary/5 last:border-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/5 shadow-sm">
                              <BespokeImage src={review.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.name}`} alt={review.user.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">{review.user.name}</p>
                              <p className="text-[10px] text-charcoal/40 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3 translate-y-1", i < review.rating ? "fill-current" : "text-primary/10")} />
                            ))}
                          </div>
                        </div>
                        <p className="text-charcoal/70 leading-relaxed italic mb-4">"{review.comment}"</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {review.images.map((img: string, i: number) => (
                              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-primary/5 flex-shrink-0">
                                <BespokeImage src={img} alt="Review" fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Sidebar */}
                <div className="lg:col-span-5">
                  {session ? (
                    <div className="sticky top-32 bg-white rounded-[2rem] p-8 border border-primary/5 shadow-2xl shadow-primary/5">
                      <h4 className="text-xl font-heading font-bold text-primary mb-6">{dict.product.leave_review}</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-primary/40 uppercase tracking-widest">{dict.product.your_rating}</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="group"
                              >
                                <Star
                                  className={cn(
                                    "w-6 h-6 transition-all",
                                    newReview.rating >= star ? "fill-accent text-accent scale-110" : "text-primary/10 group-hover:text-accent/30"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-primary/40 uppercase tracking-widest">{dict.product.your_experience}</label>
                          <textarea
                            required
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder={dict.product.experience_placeholder}
                            className="w-full h-32 p-4 bg-cream/30 border border-primary/10 rounded-xl focus:outline-none focus:border-accent transition-all text-sm font-bold text-primary placeholder:text-primary/40 resize-none shadow-inner"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black text-primary/40 uppercase tracking-widest">{dict.product.add_photo} ({dict.common.optional || "Optional"})</label>
                          <div className="flex flex-wrap gap-3">
                            {reviewImages.map((img, i) => (
                              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                                <Image src={img} alt="Preview" fill className="object-cover" />
                                <button 
                                  type="button" 
                                  onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-1 end-1 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            {reviewImages.length < 4 && (
                              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center cursor-pointer hover:border-accent/40 text-primary/30 hover:text-accent transition-all group bg-cream/20">
                                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] font-black uppercase mt-1">{dict.product.add_photo}</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                              </label>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                          {isSubmitting ? dict.product.posting_discovery : dict.product.post_review}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="sticky top-32 bg-primary text-white rounded-[2rem] p-10 shadow-2xl shadow-primary/20 text-center">
                      <h4 className="text-xl font-heading font-bold mb-4">{dict.product.sharing_story}</h4>
                      <p className="text-white/60 text-sm mb-8 leading-relaxed">{dict.product.signin_to_share}</p>
                      <Link href="/login" className="inline-block px-10 h-12 bg-white text-primary font-bold rounded-full shadow-lg">{dict.common.sign_in}</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary italic serif">{dict.product.related_products}</h2>
                <p className="text-charcoal/60 mt-2">{dict.product.related_desc}</p>
              </div>
              <Link href={`/category/${product.category.toLowerCase()}`} className="text-primary font-bold hover:underline decoration-accent decoration-2 underline-offset-4">
                {dict.product.shop_collection}
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug || p.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl shadow-primary/5 border border-primary/5 bg-transparent">
                    <BespokeImage
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {p.badge && (
                      <div className="absolute top-4 start-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl border border-primary/5">
                        {p.badge}
                      </div>
                    )}
                    <div className="absolute top-4 end-4 p-3 rounded-full bg-white/90 backdrop-blur text-primary lg:opacity-0 lg:group-hover:opacity-100 opacity-100 hover:bg-white transition-all scale-90 lg:group-hover:scale-100">
                      <Heart className={cn("w-5 h-5", isFavorite(p.id) && "fill-current text-red-500")} />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{p.artisan.studioName || p.artisan.user.name}</p>
                  <h3 className="text-xl font-heading font-bold text-primary group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-heading font-bold text-primary mt-2">{dict.product.currency} {p.price}.00</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-pointer"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-8 end-8 text-white/60 hover:text-white transition-colors z-50 p-2"
            >
              <X className="w-10 h-10" />
            </button>

            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
               {/* Navigation Arrows */}
               {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // In RTL, Start is Right, so this moves "Previous"
                        if (lang === 'ar') {
                          setLightboxIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                        } else {
                          setLightboxIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                        }
                      }}
                      className="absolute start-0 md:-start-20 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-50"
                    >
                      {/* Points Away from content: Right in AR, Left in EN */}
                      <ArrowRight className={cn("w-8 h-8", lang === 'ar' ? "" : "rotate-180")} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // In RTL, End is Left, so this moves "Next"
                        setLightboxIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
                      }}
                      className="absolute end-0 md:-end-20 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-50"
                    >
                      {/* Points Away from content: Left in AR, Right in EN */}
                      <ArrowRight className={cn("w-8 h-8", lang === 'ar' ? "rotate-180" : "")} />
                    </button>
                  </>
               )}

               <motion.div
                 key={lightboxIndex}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
                 className="relative w-full h-full flex items-center justify-center"
               >
                  {isVideo(product.images[lightboxIndex]) ? (
                    <video 
                      src={product.images[lightboxIndex]} 
                      className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl" 
                      autoPlay 
                      loop
                      muted
                      playsInline
                    />
                 ) : (
                    <div className="relative w-full h-full">
                      <Image 
                        src={product.images[lightboxIndex]} 
                        alt={product.name} 
                        fill 
                        className="object-contain" 
                        priority
                      />
                    </div>
                 )}
               </motion.div>

               {/* Counter */}
               <div className="absolute bottom-0 start-1/2 -translate-x-1/2 text-white/40 font-bold tracking-[0.3em] uppercase text-xs">
                  {lightboxIndex + 1} / {product.images.length}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 start-0 end-0 z-[55] md:hidden bg-white/80 backdrop-blur-xl border-t border-primary/5 p-4 safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-charcoal/40 mb-0.5">{dict.common.price || "Price"}</p>
            <p className="text-lg font-heading font-bold text-primary leading-none">{dict.product.currency} {product.price}</p>
          </div>
          <button
            onClick={() => addToCart(product, personalization)}
            disabled={(product.stock || 0) <= 0}
            className={cn(
              "flex-[2.5] h-14 bg-primary text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-xs",
              (product.stock || 0) > 0 ? "shadow-primary/20" : "opacity-30 grayscale"
            )}
          >
            {(product.stock || 0) > 0 ? dict.product.add_to_cart : dict.product.sold_out}
          </button>
        </div>
      </div>
    </main>
  );
}

