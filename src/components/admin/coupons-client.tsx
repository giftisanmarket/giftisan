"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, 
  Plus, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  ToggleLeft, 
  ToggleRight, 
  Percent, 
  DollarSign, 
  Award,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleCouponStatusAction, createCouponAction } from "@/lib/actions";

interface CouponsClientProps {
  initialCoupons: any[];
  stats: {
    totalCoupons: number;
    activeCoupons: number;
    totalRedemptions: number;
  };
  dict: any;
  lang: string;
}

export function CouponsClient({ initialCoupons, stats: initialStats, dict, lang }: CouponsClientProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [stats, setStats] = useState(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create Coupon Form States
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    maxUses: ""
  });

  const isAr = lang === "ar";

  // Form label overrides
  const labels = {
    title: isAr ? "إدارة الكوبونات" : "Coupon Campaigns",
    accentTitle: isAr ? "الترويجية" : "Promotions",
    desc: isAr ? "تحكم في أكواد الخصم والفعاليات والعروض الترويجية لمنصتك." : "Configure promo keys, activation toggles, and track redemptions across your platform.",
    totalCoupons: isAr ? "إجمالي الكوبونات" : "Total Coupons",
    activeCoupons: isAr ? "الكوبونات النشطة" : "Active Coupons",
    redemptions: isAr ? "مرات الاستخدام" : "Total Redemptions",
    createBtn: isAr ? "إنشاء كود خصم" : "Create Coupon",
    codeCol: isAr ? "الكود" : "Code",
    typeCol: isAr ? "النوع والقيمة" : "Type & Value",
    rulesCol: isAr ? "قواعد التطبيق" : "Fulfillment Rules",
    usedCol: isAr ? "الاستخدامات" : "Redemptions",
    statusCol: isAr ? "الحالة" : "Status",
    percentage: isAr ? "نسبة مئوية" : "Percentage",
    fixed: isAr ? "قيمة ثابتة" : "Fixed Amount",
    noCoupons: isAr ? "لا توجد أكواد حاليًا" : "No coupons created yet.",
    minOrder: isAr ? "حد أدنى للطلب" : "Min Order",
    maxCap: isAr ? "أقصى خصم" : "Max Discount Cap",
    maxUses: isAr ? "أقصى استخدام" : "Max Uses",
    any: isAr ? "أي مبلغ" : "No Limit",
    unlimited: isAr ? "بلا حد" : "Unlimited"
  };

  const handleToggleStatus = async (couponId: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;
    
    // Optimistic UI update
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: targetStatus } : c));
    setStats(prev => ({
      ...prev,
      activeCoupons: prev.activeCoupons + (targetStatus ? 1 : -1)
    }));

    try {
      const res = await toggleCouponStatusAction(couponId, targetStatus);
      if (!res.success) {
        // Rollback on error
        setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: currentStatus } : c));
        setStats(prev => ({
          ...prev,
          activeCoupons: prev.activeCoupons + (currentStatus ? 1 : -1)
        }));
        showToast("error", isAr ? "فشل تحديث حالة الكوبون." : "Failed to update coupon status.");
      } else {
        showToast("success", isAr ? "تم تحديث الكوبون بنجاح!" : "Coupon status updated successfully!");
      }
    } catch (err) {
      // Rollback on error
      setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: currentStatus } : c));
      setStats(prev => ({
        ...prev,
        activeCoupons: prev.activeCoupons + (currentStatus ? 1 : -1)
      }));
      showToast("error", isAr ? "حدث خطأ غير متوقع." : "An unexpected error occurred.");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(false);
    setErrorMessage("");

    if (!formData.code || !formData.code.trim()) {
      setErrorMessage(isAr ? "كود الخصم مطلوب" : "Coupon code is required");
      return;
    }

    const val = Number(formData.discountValue);
    if (isNaN(val) || val <= 0) {
      setErrorMessage(isAr ? "القيمة يجب أن تكون رقمًا أكبر من الصفر" : "Discount value must be a valid number greater than zero");
      return;
    }

    if (formData.discountType === "PERCENTAGE" && val > 100) {
      setErrorMessage(isAr ? "خصم النسبة المئوية لا يمكن أن يتجاوز 100%" : "Percentage discount cannot exceed 100%");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCouponAction({
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: val,
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        maxUses: formData.maxUses ? Number(formData.maxUses) : undefined
      });

      if (res.success && res.coupon) {
        // Safely serialize created coupon date for state representation
        const newC = {
          ...res.coupon,
          createdAt: new Date().toISOString()
        };
        setCoupons(prev => [newC, ...prev]);
        setStats(prev => ({
          ...prev,
          totalCoupons: prev.totalCoupons + 1,
          activeCoupons: prev.activeCoupons + 1
        }));
        
        setIsModalOpen(false);
        // Reset form data
        setFormData({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          minOrderAmount: "",
          maxDiscount: "",
          maxUses: ""
        });
        showToast("success", isAr ? "تم إنشاء الكود الجديد بنجاح!" : "New coupon created successfully!");
      } else {
        setErrorMessage(res.error || (isAr ? "فشل إنشاء الكود" : "Failed to create coupon."));
      }
    } catch (err: any) {
      setErrorMessage(err.message || (isAr ? "حدث خطأ أثناء الاتصال بالخادم" : "An error occurred."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const statCards = [
    { label: labels.totalCoupons, value: stats.totalCoupons, icon: Tag, color: "bg-primary" },
    { label: labels.activeCoupons, value: stats.activeCoupons, icon: Award, color: "bg-emerald-500" },
    { label: labels.redemptions, value: stats.totalRedemptions, icon: Hash, color: "bg-accent" },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Toast Notification Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl font-bold flex items-center gap-2 text-sm"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
        {errorMessage && !isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-600 text-white rounded-xl shadow-2xl font-bold flex items-center gap-2 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            {labels.title} <span className="serif italic text-accent font-normal">{labels.accentTitle}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-xl">{labels.desc}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 h-12 bg-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-accent/90 active:scale-95 shadow-md shadow-accent/20 transition-all shrink-0 w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>{labels.createBtn}</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-2xl md:text-3xl font-black text-primary font-heading leading-none">{card.value}</p>
            </div>
            <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white", card.color)}>
              <card.icon className="w-5 h-5 md:w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Coupon List Table */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={cn("w-full min-w-[800px] lg:min-w-full text-start", isAr ? "text-right" : "text-left" )}>
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{labels.codeCol}</th>
                <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{labels.typeCol}</th>
                <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{labels.rulesCol}</th>
                <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{labels.usedCol}</th>
                <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{labels.statusCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-charcoal/40 font-bold text-sm">
                    {labels.noCoupons}
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-cream/30 transition-colors">
                    {/* Code */}
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                          coupon.isActive ? "bg-emerald-50 text-emerald-600" : "bg-primary/5 text-primary/30"
                        )}>
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-mono text-xs md:text-sm font-black text-primary uppercase tracking-wide leading-none">{coupon.code}</p>
                          <p className="text-[8px] md:text-[9px] text-charcoal/30 font-bold uppercase tracking-widest mt-1">
                            {new Date(coupon.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type & Value */}
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-1.5">
                        {coupon.discountType === "PERCENTAGE" ? (
                          <div className="flex items-center gap-1 text-primary">
                            <Percent className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="text-sm font-black">{coupon.discountValue}%</span>
                            <span className="text-[10px] text-charcoal/40 font-medium">({labels.percentage})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-primary">
                            <span className="text-sm font-black">{dict.product.currency} {coupon.discountValue}</span>
                            <span className="text-[10px] text-charcoal/40 font-medium">({labels.fixed})</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Rules */}
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="space-y-1 text-xs text-charcoal/70 font-bold">
                        {coupon.minOrderAmount ? (
                          <p className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{labels.minOrder}:</span>
                            <span className="text-primary font-black">{dict.product.currency} {coupon.minOrderAmount}</span>
                          </p>
                        ) : (
                          <p className="text-charcoal/30 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
                            <span>{labels.minOrder}: {labels.any}</span>
                          </p>
                        )}
                        {coupon.discountType === "PERCENTAGE" && coupon.maxDiscount && (
                          <p className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{labels.maxCap}:</span>
                            <span className="text-primary font-black">{dict.product.currency} {coupon.maxDiscount}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Usage */}
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                          {coupon.usedCount}
                        </span>
                        <span className="text-[10px] text-charcoal/30 font-medium uppercase tracking-widest">
                          / {coupon.maxUses ? coupon.maxUses : labels.unlimited}
                        </span>
                      </div>
                    </td>

                    {/* Active Toggle Switch */}
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <button 
                        type="button"
                        onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                        className={cn(
                          "focus:outline-none transition-colors duration-300 rounded-full",
                          coupon.isActive ? "text-emerald-500" : "text-primary/10"
                        )}
                      >
                        {coupon.isActive ? (
                          <ToggleRight className="w-12 h-12" />
                        ) : (
                          <ToggleLeft className="w-12 h-12" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] border border-primary/5 shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-heading font-black text-primary">
                  {isAr ? "إنشاء كود خصم جديد" : "Create New Coupon"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="space-y-4 md:space-y-5">
                {/* Coupon Code */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">{isAr ? "كود الخصم" : "Coupon Code"}</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.G. GIFT15"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full h-11 px-4 bg-primary/5 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm font-bold uppercase tracking-wide"
                  />
                </div>

                {/* Discount Type Grid Selector */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">{isAr ? "نوع الخصم" : "Discount Type"}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, discountType: "PERCENTAGE" }))}
                      className={cn(
                        "h-11 rounded-xl font-bold text-xs uppercase tracking-widest border flex items-center justify-center gap-1.5 transition-all active:scale-95",
                        formData.discountType === "PERCENTAGE" 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-primary/5 text-primary/60 hover:border-primary/10"
                      )}
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>{labels.percentage}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, discountType: "FIXED" }))}
                      className={cn(
                        "h-11 rounded-xl font-bold text-xs uppercase tracking-widest border flex items-center justify-center gap-1.5 transition-all active:scale-95",
                        formData.discountType === "FIXED" 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-primary/5 text-primary/60 hover:border-primary/10"
                      )}
                    >
                      <span className="font-heading font-black">{dict.product.currency}</span>
                      <span>{labels.fixed}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Discount Value */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">
                      {formData.discountType === "PERCENTAGE" ? (isAr ? "نسبة الخصم (%)" : "Discount Rate (%)") : (isAr ? "مبلغ الخصم" : "Discount Value")}
                    </label>
                    <input 
                      type="number"
                      required
                      placeholder={formData.discountType === "PERCENTAGE" ? "15" : "100"}
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                      className="w-full h-11 px-4 bg-primary/5 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm font-bold"
                    />
                  </div>

                  {/* Min Order Subtotal */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">{isAr ? "الحد الأدنى للطلب" : "Min Order (EGP)"}</label>
                    <input 
                      type="number"
                      placeholder="e.g. 200"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                      className="w-full h-11 px-4 bg-primary/5 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Max Discount (Only shown for Percentage discounts) */}
                  <div className={cn(formData.discountType !== "PERCENTAGE" && "opacity-40 pointer-events-none")}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">{isAr ? "أقصى مبلغ خصم" : "Max Discount Cap"}</label>
                    <input 
                      type="number"
                      disabled={formData.discountType !== "PERCENTAGE"}
                      placeholder="e.g. 500"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                      className="w-full h-11 px-4 bg-primary/5 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm font-bold"
                    />
                  </div>

                  {/* Max Uses Limit */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1.5">{isAr ? "الحد الأقصى للاستخدام" : "Max Redemptions"}</label>
                    <input 
                      type="number"
                      placeholder="e.g. 100"
                      value={formData.maxUses}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                      className="w-full h-11 px-4 bg-primary/5 border border-primary/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 h-11 bg-primary/5 text-primary/60 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-primary/10 transition-colors"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 h-11 bg-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 transition-all shadow-md active:scale-95"
                  >
                    {isSubmitting ? "..." : (isAr ? "إنشاء" : "Create")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
