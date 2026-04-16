"use client";

import { useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Lock, ChevronLeft, CreditCard, CheckCircle2, Sparkles, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { createOrder } from "@/lib/actions";
import { useState, useEffect } from "react";

export function CheckoutClient() {
  const { cart, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "Egypt",
    phone: "",
    email: session?.user?.email || ""
  });

  // Smart-clear error state
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const updateShippingField = (field: keyof typeof shippingData, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      setError("Please sign in to complete your purchase.");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!(session.user as any).emailVerified) {
      setError("Please verify your email address to complete your purchase. Check your inbox for the link!");
      return;
    }

    if (!shippingData.address || !shippingData.city) {
      setError("Please fill in all shipping details.");
      return;
    }

    setIsProcessing(true);
    setError("");

    const res = await createOrder(session.user.id, totalPrice, cart, {
      ...shippingData,
      address: `${shippingData.firstName} ${shippingData.lastName}\n${shippingData.address}`
    });

    if (res.success) {
      clearCart();
      router.push("/checkout/success");
    } else {
      setError(res.error || "An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center space-y-6">
          <h1 className="text-4xl font-heading font-bold text-primary">Your cart is empty</h1>
          <p className="text-charcoal/60">Add some artisanal treasures to begin your checkout journey.</p>
          <Link href="/" className="px-8 h-14 bg-primary text-white font-bold rounded-full flex items-center justify-center mx-auto w-fit leading-none">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pb-20">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="flex items-center gap-2 mb-6 md:mb-8 group cursor-pointer w-fit" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Back to Studio</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Order Summary: Shown FIRST on mobile, sticky on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 order-first lg:order-last">
            <section className="bg-primary text-white rounded-[2rem] md:rounded-[2.5rem] px-5 py-8 md:p-10 shadow-2xl shadow-primary/20">
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent-light" />
                Order Summary
              </h2>

              <div className="space-y-4 md:space-y-5 mb-8 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id + (item.personalization || "")} className="animate-in slide-in-from-right-4 duration-300">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg shadow-black/20">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs md:text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-white/60 text-[9px] md:text-xs font-medium uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm md:text-base whitespace-nowrap">EGP {item.price * item.quantity}</p>
                    </div>
                    {item.personalization && (
                      <div className="ml-16 md:ml-20 mt-1 pl-3 border-l-2 border-accent/30 bg-white/5 py-1.5 px-3 rounded-lg">
                        <p className="text-[8px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Bespoke Detail:</p>
                        <p className="text-[10px] md:text-[11px] text-accent-light italic leading-tight">"{item.personalization}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/70 text-[10px] md:text-sm uppercase font-bold tracking-widest">
                  <span>Subtotal</span>
                  <span>EGP {totalPrice}.00</span>
                </div>
                <div className="flex justify-between text-white/70 text-[10px] md:text-sm uppercase font-bold tracking-widest">
                  <span>Cairo Direct Shipping</span>
                  <span className="text-accent-light">FREE</span>
                </div>
                <div className="flex justify-between font-heading font-bold pt-4 border-t border-white/10">
                  <span className="text-lg md:text-xl">Total</span>
                  <span className="text-2xl md:text-3xl">EGP {totalPrice}.00</span>
                </div>
              </div>

              <div className="mt-8 md:mt-10 space-y-6">
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full h-14 md:h-16 bg-white text-primary font-bold rounded-xl md:rounded-2xl hover:bg-cream transition-all flex items-center justify-center shadow-xl text-base md:text-lg group disabled:opacity-50 active:scale-95 duration-200"
                >
                  {isProcessing ? "Processing..." : "Place Pre-Launch Order"}
                  <CheckCircle2 className="w-5 h-5 ml-2 text-accent" />
                </button>

                <p className="text-[9px] md:text-[11px] text-center text-white/60 leading-relaxed max-w-sm mx-auto italic">
                  Complete your order to send your shipping details to the artisan's <span className="text-accent underline">Studio</span>.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-white/40">
                  <ShieldCheck className="w-4 h-4 text-accent/40" />
                  <span>Secure SSL Encrypted Connection</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-white/40">
                  <Truck className="w-4 h-4 text-accent/40" />
                  <span>Sustainable Packaging Guaranteed</span>
                </div>
              </div>
            </section>
          </div>

          {/* Checkout Form: Shown SECOND on mobile */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 order-last lg:order-first">
            <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] px-5 py-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 md:mb-8">Shipping Gallery</h2>
              <form className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={shippingData.firstName}
                      onChange={(e) => updateShippingField("firstName", e.target.value)}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={shippingData.lastName}
                      onChange={(e) => updateShippingField("lastName", e.target.value)}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">Shipping Address</label>
                  <input
                    type="text"
                    placeholder="Street address and apartment number"
                    value={shippingData.address}
                    onChange={(e) => updateShippingField("address", e.target.value)}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      placeholder="Cairo"
                      value={shippingData.city}
                      onChange={(e) => updateShippingField("city", e.target.value)}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">Postal Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="11511"
                      value={shippingData.zip}
                      onChange={(e) => updateShippingField("zip", e.target.value)}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+20 100 000 0000"
                    value={shippingData.phone}
                    onChange={(e) => updateShippingField("phone", e.target.value)}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20 text-sm md:text-base"
                  />
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <p className="text-[10px] text-charcoal/30 flex items-center gap-2 italic">
                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                    Artisans will begin crafting your treasure once confirmed.
                  </p>
                </div>
              </form>
            </section>

            {/* Pre-Launch Protocol Alert */}
            <div className="bg-accent/5 border-2 border-dashed border-accent/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-primary mb-2">Pre-Launch Gallery Mode</h3>
              <p className="text-[11px] md:text-sm text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                Giftisan is in an exclusive profile-building phase. <span className="text-primary font-bold">Secure payments will be activated soon.</span> Expect manual confirmation from artisans for now!
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-4 bg-accent text-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 font-bold text-center text-sm">
          {error}
        </div>
      )}
    </main>
  );
}
