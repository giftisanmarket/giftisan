"use client";

import { useCart } from "@/context/cart-context";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BespokeImage } from "./bespoke-image";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();
  const hasUnavailableItems = cart.some(item => (item.stock || 0) <= 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-cream shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-primary/10 flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-primary/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-primary/20" />
                  </div>
                  <p className="text-charcoal/40 font-medium text-lg">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Start Gifting →
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id + (item.personalization || "")} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border border-primary/5">
                      <BespokeImage src={item.images[0]} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-heading font-bold text-primary leading-tight line-clamp-1">{item.name}</h3>
                        <div className="text-right">
                          <p className="font-bold text-primary">${item.price * item.quantity}</p>
                          {(item.stock || 0) <= 0 && (
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter bg-red-50 px-1.5 py-0.5 rounded-sm">Sold Out</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">{item.artisan.name}</p>
                      {item.personalization && (
                        <div className="bg-primary/5 border border-primary/5 rounded-lg p-2 mt-2">
                          <p className="text-[10px] text-primary/40 uppercase font-black tracking-tighter mb-1">Bespoke Detail:</p>
                          <p className="text-[11px] text-primary italic leading-tight">"{item.personalization}"</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-primary/20 rounded-full h-9 px-3 gap-4 bg-white/50">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.personalization)}
                            className="p-1 text-primary hover:text-accent transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center text-primary leading-none">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.personalization)}
                            className="p-1 text-primary hover:text-accent transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.personalization)}
                          className="text-xs font-bold text-charcoal/40 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-primary/10 bg-white/50 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-charcoal/60 font-medium">Subtotal</span>
                  <span className="font-heading font-bold text-primary text-2xl">${totalPrice}.00</span>
                </div>
                <p className="text-xs text-charcoal/40 text-center">Shipping & taxes calculated at checkout</p>
                <Link 
                  href={hasUnavailableItems ? "#" : "/checkout"}
                  onClick={(e) => {
                    if (hasUnavailableItems) {
                      e.preventDefault();
                      return;
                    }
                    setIsCartOpen(false);
                  }}
                  className={cn(
                    "w-full h-14 font-bold rounded-full transition-all shadow-xl flex items-center justify-center",
                    hasUnavailableItems 
                      ? "bg-charcoal/10 text-charcoal/40 !cursor-not-allowed shadow-none pointer-events-auto" 
                      : "bg-primary text-white hover:bg-primary-light shadow-primary/20"
                  )}
                >
                  {hasUnavailableItems ? "Please Review Sold Out Items" : "Proceed to Checkout"}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
