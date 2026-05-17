"use client";

import { useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Lock, ChevronLeft, CreditCard, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { createOrder, validateCouponAction, getAllShippingMethods } from "@/lib/actions";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CheckoutClient({ dict }: { dict: any }) {
  // ⚙️ FEATURE FLAGS:
  const ENABLE_COUPONS = true;          // Keep this true to still show the promo input field
  const APPLY_COUPON_DISCOUNTS = true;  // Set this to true to fully calculate and apply discounts at checkout!

  const { cart, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<(keyof typeof shippingData)[]>([]);
  const router = useRouter();

  // Promo Coupon / Discount Code States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);

  // Localization detector (Frictionless check for /ar)
  const isAr = dict.profile?.delivered === "تم التوصيل" || dict.profile?.delivered === "تم الاستلام";
  const promoPlaceholder = isAr ? "كود الخصم (مثال: GIFT10)" : "Promo Code (e.g. GIFT10)";
  const promoApply = isAr ? "تطبيق" : "Apply";
  const promoRemove = isAr ? "إزالة" : "Remove";
  const promoDiscountLabel = isAr ? "خصم" : "Discount";

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "Egypt",
    phone: "",
    email: session?.user?.email || "",
    isGift: false,
    giftMessage: ""
  });

  // Smart-clear error state
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load Shipping Methods
  useEffect(() => {
    async function loadShipping() {
      const methods = await getAllShippingMethods();
      const activeMethods = methods.filter((m: any) => m.isActive);
      setShippingMethods(activeMethods);
      // Auto-select first method if available
      if (activeMethods.length > 0) {
        setSelectedMethod(activeMethods[0]);
      }
      setIsLoadingMethods(false);
    }
    loadShipping();
  }, []);

  const updateShippingField = (field: keyof typeof shippingData, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (validationErrors.includes(field)) {
      setValidationErrors(prev => prev.filter(f => f !== field));
    }
  };

  const handleApplyCoupon = async () => {
    if (!ENABLE_COUPONS || !couponCode.trim()) return;

    if (!APPLY_COUPON_DISCOUNTS) {
      setCouponError(isAr ? "أكواد الخصم معطلة مؤقتًا حاليًا." : "Promo codes are temporarily inactive.");
      setAppliedCoupon(null);
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await validateCouponAction(couponCode, totalPrice, cart);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponError("");
      } else {
        setCouponError(res.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError("Failed to apply coupon.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      setError(dict.checkout.error_signin);
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!(session.user as any).emailVerified) {
      setError(dict.checkout.error_verify);
      return;
    }

    const mandatoryFields: (keyof typeof shippingData)[] = ["firstName", "lastName", "address", "city", "phone"];
    const emptyFields = mandatoryFields.filter(field => !shippingData[field]);

    if (emptyFields.length > 0) {
      setError(dict.checkout.error_shipping);
      setValidationErrors(emptyFields);
      return;
    }

    const discountValue = ENABLE_COUPONS && APPLY_COUPON_DISCOUNTS && appliedCoupon ? appliedCoupon.appliedDiscount : 0;
    const shippingCost = selectedMethod?.price || 0;
    const finalPrice = Math.max(totalPrice - discountValue + shippingCost, 0);

    const res = await createOrder(session.user.id, finalPrice, cart, {
      ...shippingData,
      address: shippingData.address,
      couponId: ENABLE_COUPONS && APPLY_COUPON_DISCOUNTS && appliedCoupon ? appliedCoupon.id : null,
      discountApplied: discountValue,
      shippingMethodId: selectedMethod?.id,
      shippingCost: shippingCost
    });

    if (res.success) {
      setIsRedirecting(true);
      clearCart();
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        router.push("/checkout/success");
      }
    } else {
      setError(res.error || "An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isRedirecting) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar dict={dict} />
        <div className="container mx-auto px-4 py-32 text-center space-y-6">
          <h1 className="text-4xl font-heading font-bold text-primary">{dict.cart.cart_empty}</h1>
          <p className="text-charcoal/60">{dict.checkout.empty_checkout_desc}</p>
          <Link href="/" className="px-8 py-4 bg-primary text-white font-bold rounded-full flex items-center justify-center mx-auto w-fit leading-none">
            {dict.checkout.continue_shopping}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pb-20">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="flex items-center gap-2 mb-6 md:mb-8 group cursor-pointer w-fit" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">{dict.checkout.back_to_studio}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Order Summary: Shown FIRST on mobile, sticky on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 order-first lg:order-last">
            <section className="bg-primary text-white rounded-[2rem] md:rounded-[2.5rem] px-5 py-8 md:p-10 shadow-2xl shadow-primary/20">
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent-light" />
                {dict.checkout.order_summary}
              </h2>

              <div className="space-y-4 md:space-y-5 mb-8 max-h-[300px] md:max-h-[400px] overflow-y-auto pe-2 custom-scrollbar no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id + (item.personalization || "")} className="animate-in slide-in-from-end-4 duration-300">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg shadow-black/20">
                        <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs md:text-sm line-clamp-1">{item.name}</h4>
                        {item.variantName && <p className="text-accent-light text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{item.variantName}</p>}
                        <p className="text-white/60 text-[9px] md:text-xs font-medium uppercase tracking-widest">{dict.checkout.qty}: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap">EGP {item.price * item.quantity}</p>
                    </div>
                    {item.personalization && (
                      <div className="ms-16 md:ms-20 mt-1 ps-3 border-l-2 border-accent/30 bg-white/5 py-1.5 px-3 rounded-lg">
                        <p className="text-[8px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">{dict.cart.bespoke_detail}:</p>
                        <p className="text-[10px] md:text-[11px] text-accent-light italic leading-tight">"{item.personalization}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Promo Coupon Module */}
              {ENABLE_COUPONS && (
                <div className="pt-6 pb-2 border-t border-white/10 mt-6 animate-in fade-in duration-300">
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      placeholder={promoPlaceholder}
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        if (couponError) setCouponError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      disabled={appliedCoupon !== null}
                      className="flex-1 py-3 px-4 bg-white/10 text-white placeholder:text-white/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-light text-sm font-medium transition-all disabled:opacity-50 uppercase tracking-wider"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode("");
                        }}
                        className="px-4 py-3 bg-white/15 text-white/80 font-bold rounded-xl text-xs hover:bg-white/20 hover:text-white transition-all whitespace-nowrap"
                      >
                        {promoRemove}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-5 py-3 bg-white text-primary hover:bg-cream disabled:bg-white/20 disabled:text-white/40 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all whitespace-nowrap"
                      >
                        {isValidatingCoupon ? "..." : promoApply}
                      </button>
                    )}
                  </div>

                  {couponError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-accent-light text-[10px] font-bold mt-2 ps-1 uppercase tracking-wider"
                    >
                      ⚠️ {couponError}
                    </motion.p>
                  )}

                  {appliedCoupon && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold mt-3"
                    >
                      <span className="flex items-center gap-1.5">
                        🎉 {isAr ? "تم تطبيق الكود" : "Code"} {appliedCoupon.code} {isAr ? "بنجاح" : "applied"} (-{dict.product.currency} {appliedCoupon.appliedDiscount})
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="space-y-3 md:space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/70 text-[10px] md:text-sm uppercase font-bold tracking-widest">
                  <span>{dict.cart.subtotal}</span>
                  <span>{dict.product.currency} {totalPrice}.00</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-300 text-[10px] md:text-sm uppercase font-bold tracking-widest animate-in fade-in duration-300">
                    <span>{promoDiscountLabel} ({appliedCoupon.code})</span>
                    <span>-{dict.product.currency} {appliedCoupon.appliedDiscount}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-white/70 text-[10px] md:text-sm uppercase font-bold tracking-widest">
                  <span>{selectedMethod?.name || dict.checkout.cairo_shipping}</span>
                  <span className="text-accent-light">
                    {selectedMethod?.price === 0 ? dict.checkout.free : `${dict.product.currency} ${selectedMethod?.price || 0}`}
                  </span>
                </div>
                <div className="flex justify-between font-heading font-bold pt-4 border-t border-white/10">
                  <span className="text-lg md:text-xl">{dict.checkout.total}</span>
                  <span className="text-2xl md:text-3xl">
                    {dict.product.currency} {Math.max(totalPrice - (appliedCoupon?.appliedDiscount || 0) + (selectedMethod?.price || 0), 0)}.00
                  </span>
                </div>
              </div>

              <div className="mt-8 md:mt-10 space-y-6">
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full py-4 md:py-5 bg-white text-primary font-bold rounded-xl md:rounded-2xl hover:bg-cream transition-all flex items-center justify-center shadow-xl text-base md:text-lg group disabled:opacity-50 active:scale-95 duration-200"
                >
                  {isProcessing ? dict.checkout.processing : dict.checkout.place_order}
                  <CheckCircle2 className="w-5 h-5 ms-2 text-accent" />
                </button>

                <p className="text-[9px] md:text-[11px] text-center text-white/60 leading-relaxed max-w-sm mx-auto italic">
                  {dict.checkout.prelaunch_manual_desc}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <div className="flex items-center gap-2.5 text-[10px] md:text-xs text-white/40">
                  <ShieldCheck className="w-4 h-4 text-accent/40 shrink-0" />
                  <span className="whitespace-nowrap">{dict.checkout.secure_ssl}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] md:text-xs text-white/40">
                  <Truck className="w-4 h-4 text-accent/40 shrink-0" />
                  <span className="whitespace-nowrap">{dict.checkout.sustainable_packaging}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Checkout Form: Shown SECOND on mobile */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 order-last lg:order-first">
            <motion.section 
              animate={validationErrors.length > 0 ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.4 } } : {}}
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] px-5 py-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 md:mb-8">{dict.checkout.shipping_gallery}</h2>
              <form className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.first_name}</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={shippingData.firstName}
                      onChange={(e) => updateShippingField("firstName", e.target.value)}
                      className={cn(
                        "w-full py-4 px-6 bg-white border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-primary/20 text-sm md:text-base",
                        validationErrors.includes("firstName") 
                          ? "border-accent ring-2 ring-accent/10" 
                          : "border-primary/20 focus:ring-accent/20 focus:border-accent"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.last_name}</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={shippingData.lastName}
                      onChange={(e) => updateShippingField("lastName", e.target.value)}
                      className={cn(
                        "w-full py-4 px-6 bg-white border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-primary/20 text-sm md:text-base",
                        validationErrors.includes("lastName") 
                          ? "border-accent ring-2 ring-accent/10" 
                          : "border-primary/20 focus:ring-accent/20 focus:border-accent"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.shipping_address}</label>
                  <input
                    type="text"
                    placeholder={dict.checkout.street_placeholder}
                    value={shippingData.address}
                    onChange={(e) => updateShippingField("address", e.target.value)}
                    className={cn(
                      "w-full py-4 px-6 bg-white border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-primary/20 text-sm md:text-base",
                      validationErrors.includes("address") 
                        ? "border-accent ring-2 ring-accent/10" 
                        : "border-primary/20 focus:ring-accent/20 focus:border-accent"
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.city}</label>
                    <input
                      type="text"
                      placeholder="Cairo"
                      value={shippingData.city}
                      onChange={(e) => updateShippingField("city", e.target.value)}
                      className={cn(
                        "w-full py-4 px-6 bg-white border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-primary/20 text-sm md:text-base",
                        validationErrors.includes("city") 
                          ? "border-accent ring-2 ring-accent/10" 
                          : "border-primary/20 focus:ring-accent/20 focus:border-accent"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.postal_code} ({dict.checkout.optional})</label>
                    <input
                      type="text"
                      placeholder="11511"
                      value={shippingData.zip}
                      onChange={(e) => updateShippingField("zip", e.target.value)}
                      className="w-full py-4 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.phone_number}</label>
                  <input
                    type="tel"
                    placeholder="+20 100 000 0000"
                    value={shippingData.phone}
                    onChange={(e) => updateShippingField("phone", e.target.value)}
                    className={cn(
                      "w-full h-14 px-6 bg-white border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-primary/20 text-sm md:text-base",
                      validationErrors.includes("phone") 
                        ? "border-accent ring-2 ring-accent/10" 
                        : "border-primary/20 focus:ring-accent/20 focus:border-accent"
                    )}
                  />
                </div>

                <div className="pt-8 border-t border-primary/5">
                  <h3 className="text-xl font-heading font-bold text-primary mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-accent" />
                    {dict.checkout.shipping_method}
                  </h3>
                  
                  {isLoadingMethods ? (
                    <div className="flex items-center gap-2 text-charcoal/40 text-sm animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {dict.checkout.loading_regions}
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {shippingMethods.map((method) => (
                        <div 
                          key={method.id}
                          onClick={() => setSelectedMethod(method)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                            selectedMethod?.id === method.id 
                              ? "border-accent bg-accent/5" 
                              : "border-primary/5 bg-white hover:border-primary/10"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedMethod?.id === method.id ? "border-accent bg-accent" : "border-primary/20"
                            )}>
                              {selectedMethod?.id === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary">{method.name}</p>
                              {method.estimatedDays && <p className="text-[10px] text-charcoal/40 uppercase font-black tracking-widest">{method.estimatedDays}</p>}
                            </div>
                          </div>
                          <p className="font-bold text-sm text-primary">
                            {method.price === 0 ? dict.checkout.free : `${dict.product.currency} ${method.price}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8 space-y-6 border-t border-primary/5">
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setShippingData(prev => ({ ...prev, isGift: !prev.isGift }))}>
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                      shippingData.isGift ? "bg-accent border-accent shadow-lg shadow-accent/20" : "border-primary/20 bg-white"
                    )}>
                      {shippingData.isGift && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm md:text-base font-bold text-primary">{dict.checkout.mark_as_gift}</h4>
                    </div>
                  </div>

                  {shippingData.isGift && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.checkout.gift_message_label}</label>
                      <textarea
                        placeholder={dict.checkout.gift_message_placeholder}
                        value={shippingData.giftMessage}
                        onChange={(e) => updateShippingField("giftMessage", e.target.value)}
                        className="w-full h-32 p-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base resize-none"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <p className="text-[10px] text-charcoal/30 flex items-center gap-2 italic">
                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                    {dict.checkout.artisan_confirmed_desc}
                  </p>
                </div>
              </form>
            </motion.section>

          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 start-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-4 bg-accent text-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 font-bold text-center text-sm">
          {error}
        </div>
      )}
    </main>
  );
}

