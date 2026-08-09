"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Tag, Trash2, Ticket, Percent, Banknote, Calendar, MousePointer2, Trophy, Heart, Sparkles } from "lucide-react";
import { createCouponAction, deleteArtisanCoupon } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface GrowthTabProps {
  dict: any;
  coupons: any[];
  sales: any[];
}

export function GrowthTab({ dict, coupons, sales }: GrowthTabProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSales = sales.length;
  
  const tiers = [
    { 
      title: dict.studio.tier_local_legend, 
      desc: dict.studio.tier_local_legend_desc, 
      icon: Trophy, 
      color: "bg-amber-500", 
      threshold: 5,
      active: totalSales >= 5,
      upcoming: totalSales < 5
    },
    { 
      title: dict.studio.tier_regional_star, 
      desc: dict.studio.tier_regional_star_desc, 
      icon: MousePointer2, 
      color: "bg-blue-500", 
      threshold: 20,
      active: totalSales >= 20,
      upcoming: totalSales >= 5 && totalSales < 20
    },
    { 
      title: dict.studio.tier_global_master, 
      desc: dict.studio.tier_global_master_desc, 
      icon: Heart, 
      color: "bg-purple-500", 
      threshold: 50,
      active: totalSales >= 50,
      upcoming: totalSales >= 20 && totalSales < 50
    }
  ];

  const currentTier = [...tiers].reverse().find(t => t.active) || { title: "Artisan Beginner", threshold: 5 };
  const nextTier = tiers.find(t => t.threshold > totalSales);
  const progress = nextTier ? (totalSales / nextTier.threshold) * 100 : 100;

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 0,
    minOrderAmount: 0,
    maxUses: 0
  });

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createCouponAction(newCoupon);
    if (res.success) {
      toast.success("Coupon created successfully!");
      setIsCreating(false);
      setNewCoupon({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minOrderAmount: 0,
        maxUses: 0
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to create coupon");
    }
    setIsSubmitting(false);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const res = await deleteArtisanCoupon(id);
    if (res.success) {
      toast.success("Coupon deleted");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-12">
      {/* Studio Tiers (Existing) */}
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 lg:p-16 border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden relative">
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-center xl:items-start gap-6 md:gap-10 mb-8 md:mb-12 text-center xl:text-start">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-3 md:mb-6 leading-tight">{dict.studio.growth_title} <span className="serif italic font-normal text-accent">{dict.studio.growth_title_accent}</span></h2>
              <p className="text-sm md:text-lg text-charcoal/60 leading-relaxed font-medium">
                {dict.studio.growth_desc}
              </p>
            </div>

            {nextTier && (
              <div className="w-full xl:w-auto xl:min-w-[300px] bg-cream/30 p-5 md:p-7 rounded-[2rem] border border-primary/5">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Next Milestone</p>
                    <p className="font-bold text-primary">{nextTier.title}</p>
                  </div>
                  <p className="text-2xl font-heading font-bold text-accent">{totalSales}<span className="text-xs text-primary/20">/{nextTier.threshold}</span></p>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden border border-primary/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-accent shadow-[0_0_20px_rgba(218,123,90,0.4)]"
                  />
                </div>
                <p className="text-[10px] font-bold text-center mt-4 text-primary/40 uppercase tracking-widest">
                  {nextTier.threshold - totalSales} more sales to level up!
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {tiers.map((tier, i) => (
              <div key={i} className={cn(
                "p-6 md:p-8 rounded-[2rem] border transition-all relative overflow-hidden group",
                tier.active ? "bg-white border-primary shadow-2xl shadow-primary/10" : 
                tier.upcoming ? "bg-cream/20 border-accent/20 border-dashed opacity-100" :
                "bg-cream/20 border-primary/5 grayscale opacity-60"
              )}>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", 
                  tier.active ? tier.color : "bg-primary/10 text-primary/40"
                )}>
                  <tier.icon className="w-7 h-7" />
                </div>
                <h3 className={cn(
                  "text-xl font-heading font-bold mb-2",
                  tier.active ? "text-primary" : "text-primary/40"
                )}>{tier.title}</h3>
                <p className="text-sm text-charcoal/40 font-medium leading-relaxed">{tier.desc}</p>
                {tier.active && (
                  <div className="absolute top-4 end-4">
                    <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {dict.studio.active_tier}
                    </div>
                  </div>
                )}
                {tier.upcoming && (
                  <div className="absolute top-4 end-4">
                    <div className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/20">
                      In Sight
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coupon Management — Coming Soon */}
      <div className="relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 z-20 rounded-[2rem] md:rounded-[3.5rem] backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center gap-4 pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary/40" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/30 mb-1">{dict.studio_profile.coming_soon}</p>
              <p className="text-xl font-heading font-bold text-primary/50">{(dict.studio.studio_promos || "Studio Promos")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 lg:p-16 border border-primary/5 shadow-2xl shadow-primary/5 relative overflow-hidden select-none pointer-events-none opacity-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary">
              {(dict.studio.studio_promos || "Studio Promos").split(' ')[0]} <span className="serif italic font-normal text-accent">{(dict.studio.studio_promos || "").split(' ')[1] || ""}</span>
            </h2>
            <p className="text-charcoal/40 font-medium mt-2">{dict.studio.studio_promos_desc}</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="h-14 px-8 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all flex items-center gap-3 shadow-xl active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {dict.studio.create_coupon}
          </button>
        </div>

        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 md:p-8 bg-cream/30 rounded-[2.5rem] border border-primary/5"
          >
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">Coupon Code</label>
                <div className="relative">
                  <Tag className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                  <input
                    required
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="E.G. HANDMADE20"
                    className="w-full h-14 ps-14 pe-6 rounded-2xl bg-white border border-primary/5 focus:border-accent outline-none font-bold text-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">Discount Type</label>
                <div className="flex bg-white rounded-2xl p-1 border border-primary/5 h-14">
                  <button
                    type="button"
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: "PERCENTAGE" })}
                    className={cn(
                      "flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      newCoupon.discountType === "PERCENTAGE" ? "bg-primary text-white shadow-lg" : "text-primary/40 hover:text-primary"
                    )}
                  >
                    Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: "FIXED" })}
                    className={cn(
                      "flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      newCoupon.discountType === "FIXED" ? "bg-primary text-white shadow-lg" : "text-primary/40 hover:text-primary"
                    )}
                  >
                    Fixed Amount
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">
                  {newCoupon.discountType === "PERCENTAGE" ? "Discount %" : "Discount Amount (EGP)"}
                </label>
                <div className="relative">
                  {newCoupon.discountType === "PERCENTAGE" ? (
                    <Percent className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                  ) : (
                    <Banknote className="absolute start-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                  )}
                  <input
                    required
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full h-14 ps-14 pe-6 rounded-2xl bg-white border border-primary/5 focus:border-accent outline-none font-bold text-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">Min. Order (Optional)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                  className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/5 focus:border-accent outline-none font-bold text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">Max Uses (0 for Unlimited)</label>
                <input
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                  className="w-full h-14 px-6 rounded-2xl bg-white border border-primary/5 focus:border-accent outline-none font-bold text-primary"
                />
              </div>

              <div className="flex items-end gap-3 lg:col-span-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 flex-1 bg-accent text-white font-bold rounded-2xl hover:bg-accent-light transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Creating..." : "Save Coupon"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="h-14 px-6 bg-white border border-primary/5 text-primary/40 font-bold rounded-2xl hover:text-primary transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-cream/10 rounded-3xl border-2 border-dashed border-primary/5">
              <Ticket className="w-12 h-12 text-primary/10 mx-auto mb-4" />
              <p className="text-charcoal/40 font-medium italic">{dict.studio.no_coupons}</p>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white p-6 md:p-8 rounded-3xl border border-primary/5 shadow-lg hover:shadow-xl transition-all group relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-accent" />
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-2 text-primary/10 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black text-primary tracking-tight mb-2">{coupon.code}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-heading font-bold text-accent">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `${dict.product.currency} ${coupon.discountValue}`}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">OFF</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-primary/5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-primary/30">Usage</span>
                    <span className="text-primary">{coupon.usedCount} {coupon.maxUses > 0 ? `/ ${coupon.maxUses}` : "uses"}</span>
                  </div>
                  {coupon.minOrderAmount > 0 && (
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-primary/30">Min. Order</span>
                      <span className="text-primary">{dict.product.currency} {coupon.minOrderAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
