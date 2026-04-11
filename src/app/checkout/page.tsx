"use client";

import { useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Lock, ChevronLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const handlePurchase = () => {
    // In a real app, we would process payment here
    clearCart();
    router.push("/checkout/success");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center space-y-6">
          <h1 className="text-4xl font-heading font-bold text-primary">Your cart is empty</h1>
          <p className="text-charcoal/60">Add some artisanal treasures to begin your checkout journey.</p>
          <Link href="/" className="inline-block px-8 h-14 bg-primary text-white font-bold rounded-full flex items-center justify-center mx-auto w-fit">
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
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5">
              <h2 className="text-3xl font-heading font-bold text-primary mb-8">Shipping Information</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">First Name</label>
                    <input type="text" placeholder="e.g. Jane" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Last Name</label>
                    <input type="text" placeholder="e.g. Doe" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest">Shipping Address</label>
                  <input type="text" placeholder="Street address and apartment number" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">City</label>
                    <input type="text" placeholder="London" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Postal Code</label>
                    <input type="text" placeholder="E1 6AN" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-primary">Payment Details</h2>
                <div className="flex gap-2">
                  <CreditCard className="w-6 h-6 text-primary/20" />
                  <Lock className="w-6 h-6 text-primary/20" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-widest">Card Number</label>
                  <div className="relative">
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                      <div className="w-8 h-5 bg-primary/10 rounded"></div>
                      <div className="w-8 h-5 bg-accent/10 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">CVV</label>
                    <input type="text" placeholder="***" className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/20" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 sticky top-32">
            <section className="bg-primary text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-primary/20">
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
                      <p className="font-bold">${item.price * item.quantity}</p>
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
                  <span>${totalPrice}.00</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping (Artisan Direct)</span>
                  <span className="text-accent-light font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-heading font-bold pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-3xl">${totalPrice}.00</span>
                </div>
              </div>

              <button 
                onClick={handlePurchase}
                className="w-full h-16 bg-white text-primary font-bold rounded-full mt-10 hover:bg-cream transition-all flex items-center justify-center shadow-xl text-lg group"
              >
                Complete Purchase
                <CheckCircle2 className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

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
