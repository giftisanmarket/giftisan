"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, MessageSquare, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { cn } from "@/lib/utils";

interface SuccessClientProps {
  dict: any;
  lang: string;
  order?: any;
}

export function SuccessClient({ dict, lang, order }: SuccessClientProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <main className="min-h-screen bg-cream overflow-hidden">
      <Navbar dict={dict} />
      
      {/* Celebration Confetti (Subtle) */}
      {windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
          recycle={false}
          colors={["#064E3B", "#D97706", "#FDFCF0", "#0D9488"]}
          opacity={0.6}
        />
      )}

      <div className="container mx-auto px-6 pt-24 md:pt-40 pb-20 flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20"
        >
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-2xl px-2 mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-heading font-bold text-primary mb-6 tracking-tight leading-tight">
            {dict.checkout.success_title}
          </h1>
          <p className="text-charcoal/60 text-base md:text-xl leading-relaxed max-w-xl mx-auto">
            {dict.checkout.success_desc}
          </p>
        </motion.div>

        {/* Dynamic Digital Receipt */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-3xl bg-white rounded-[2.5rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden mb-12"
          >
            {/* Header of Receipt */}
            <div className="bg-cream/30 px-6 md:px-10 py-6 border-b border-primary/5 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">{dict.profile.reference}</p>
                <h2 className="text-lg md:text-xl font-mono font-bold text-primary uppercase tracking-tight">#{order.id.slice(0, 8)}</h2>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">{dict.profile.placed_on}</p>
                  <p className="text-sm md:text-base font-bold text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="pl-4 border-l border-primary/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">{dict.admin.status || "Status"}</p>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border block text-center",
                    order.status === "PROCESSING" ? "bg-green-50 text-green-600 border-green-200" :
                    order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                    "bg-red-50 text-red-600 border-red-200"
                  )}>
                    {order.status === "PROCESSING" ? (dict.admin.approved || "Paid") : 
                     order.status === "PENDING" ? (dict.profile.pending || "Pending") : 
                     order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8">
              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/40">{dict.admin.global_products || "Items"}</h3>
                <div className="divide-y divide-primary/5">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-cream shrink-0 border border-primary/5">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                              <Package className="w-5 h-5 text-primary/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-bold text-primary line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-charcoal/50">
                            {dict.profile.qty}: {item.quantity} × {dict.product.currency} {item.price}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm md:text-base font-black text-primary font-mono shrink-0">
                        {dict.product.currency} {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Totals Grid */}
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-primary/5">
                {/* Shipping info */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary/40">{dict.checkout.shipping_address}</h3>
                  <div className="text-sm text-charcoal/70 leading-relaxed font-bold">
                    <p className="text-primary font-black mb-1">{order.clientName}</p>
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingCountry || "EG"}</p>
                    <p className="font-mono text-xs mt-2 text-charcoal/50">📞 {order.clientPhone}</p>
                  </div>
                </div>

                {/* Price Summary */}
                {(() => {
                  const isAr = lang === "ar";
                  const subtotal = order.totalAmount + (order.discountApplied || 0);
                  return (
                    <div className="bg-cream/20 p-6 rounded-2xl border border-primary/5 space-y-3 h-fit">
                      <div className="flex justify-between text-xs text-charcoal/60 font-medium">
                        <span>{dict.cart.subtotal}</span>
                        <span className="font-mono">{dict.product.currency} {subtotal}</span>
                      </div>
                      {order.discountApplied > 0 && (
                        <div className="flex justify-between text-xs text-emerald-600 font-bold">
                          <span>{isAr ? "خصم كوبون" : "Promo Discount"}</span>
                          <span className="font-mono">-{dict.product.currency} {order.discountApplied}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-charcoal/60 font-medium">
                        <span>{dict.checkout.cairo_shipping}</span>
                        <span className="text-green-600 font-bold uppercase tracking-wider">{dict.checkout.free}</span>
                      </div>
                      <div className="pt-3 border-t border-primary/5 flex justify-between text-base font-black text-primary">
                        <span>{dict.checkout.total}</span>
                        <span className="font-mono">{dict.product.currency} {order.totalAmount}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Tracker Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 text-left w-full max-w-3xl"
        >
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">{dict.checkout.artisan_prep_title}</h3>
              <p className="text-xs md:text-sm text-charcoal/50 leading-relaxed mt-1">{dict.checkout.artisan_prep_desc}</p>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">{dict.checkout.direct_dialogue_title}</h3>
              <p className="text-xs md:text-sm text-charcoal/50 leading-relaxed mt-1">{dict.checkout.direct_dialogue_desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          <Link 
            href={`/${lang}`} 
            className="h-16 px-12 bg-primary text-white font-bold rounded-full hover:bg-brand transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group w-full sm:w-auto active:scale-95 text-sm md:text-base text-center"
          >
            {dict.checkout.continue_discovery}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
          <Link 
            href={`/${lang}/favorites`} 
            className="h-16 px-12 bg-white border border-primary/10 text-primary font-bold rounded-full hover:bg-primary/5 transition-all w-full sm:w-auto flex items-center justify-center active:scale-95 text-sm md:text-base text-center"
          >
            {dict.checkout.view_favorites}
          </Link>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
      </div>
    </main>
  );
}
