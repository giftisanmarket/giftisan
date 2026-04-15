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
import { useState } from "react";

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
    city: "Cairo",
    zip: "11511",
    country: "Egypt",
    phone: "",
    email: session?.user?.email || ""
  });

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      setError("Please sign in to complete your purchase.");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!shippingData.address || !shippingData.city || !shippingData.zip) {
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

      <div className="container mx-auto px-4 pt-32">
        <div className="flex items-center gap-2 mb-8 group cursor-pointer w-fit" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Back to Studio</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white rounded-[2.5rem] px-5 py-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5">
              <h2 className="text-3xl font-heading font-bold text-primary mb-8">Shipping Information</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">First Name</label>
                    <input 
                      type="text" 
                      placeholder=" Jane" 
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Last Name</label>
                    <input 
                      type="text" 
                      placeholder=" Doe" 
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest">Shipping Address</label>
                  <input 
                    type="text" 
                    placeholder="Street address and apartment number" 
                    value={shippingData.address}
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">City</label>
                    <input 
                      type="text" 
                      placeholder="London" 
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="11511" 
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({...shippingData, zip: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+44 7700 900000" 
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <p className="text-[10px] text-charcoal/30 flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent rounded-full" />
                    Our artisans will begin crafting your treasure as soon as the order is confirmed.
                  </p>
                </div>
              </form>
            </section>

            {/* Space for future payment implementation */}
            <div className="bg-accent/5 border-2 border-dashed border-accent/20 rounded-[2.5rem] p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-bold text-primary mb-2">Pre-Launch Gallery Mode</h3>
              <p className="text-sm text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                Giftisan is currently in an exclusive profile-building phase. <span className="text-primary font-bold">Standard shipping and secure payments will be activated soon.</span> For now, you can explore treasures and join our "Inner Circle" newsletter for launch alerts!
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 sticky top-32">
            <section className="bg-primary text-white rounded-[2.5rem] px-6 py-8 md:p-10 shadow-2xl shadow-primary/20">
              <h2 className="text-2xl font-heading font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id + (item.personalization || "")}>
                    <div className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">EGP {item.price * item.quantity}</p>
                    </div>
                    {item.personalization && (
                      <div className="ml-20 mt-1 pl-3 border-l-2 border-accent/30">
                        <p className="text-[10px] text-white/40 uppercase font-black">Bespoke Detail:</p>
                        <p className="text-[11px] text-accent-light italic">"{item.personalization}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>EGP {totalPrice}.00</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping (Cairo Direct)</span>
                  <span className="text-accent-light font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Estimated Tax</span>
                  <span>EGP 0.00</span>
                </div>
                <div className="flex justify-between text-xl font-heading font-bold pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-3xl">EGP {totalPrice}.00</span>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <button 
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full h-16 bg-white text-primary font-bold rounded-full hover:bg-cream transition-all flex items-center justify-center shadow-xl text-lg group disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Place Pre-Launch Order"}
                  <CheckCircle2 className="w-5 h-5 ml-2 text-accent" />
                </button>

                <p className="text-[11px] text-center text-white/60 leading-relaxed max-w-sm mx-auto">
                  By clicking above, your shipping details will be sent directly to the artisan's <span className="text-accent underline">Studio Dashboard</span>. They will then contact you to arrange manual payment and delivery.
                </p>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <span className="relative px-4 bg-primary text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Alternative</span>
                </div>

                <Link 
                  href="/#newsletter"
                  className="w-full h-12 bg-white/5 text-white/60 font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 text-xs"
                >
                  Join the Waitlist instead
                  <Sparkles className="w-3 h-3 text-accent" />
                </Link>
              </div>

              {error && (
                <p className="mt-4 text-sm font-bold text-accent-light text-center animate-pulse">
                  {error}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <ShieldCheck className="w-4 h-4 text-accent-light" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <Truck className="w-4 h-4 text-accent-light" />
                  <span>Eco-friendly Shipping Guaranteed</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
