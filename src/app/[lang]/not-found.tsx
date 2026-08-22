"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Compass, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      
      <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10 py-20">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] flex items-center justify-center border border-primary/5 shadow-2xl shadow-primary/10 transition-transform hover:scale-110 duration-500">
            <Compass className="w-16 h-16 md:w-20 md:h-20 text-accent animate-spin-slow" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
            <span className="font-heading font-black">404</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading font-black text-primary mb-6 tracking-tighter">
          Lost in the <br />
          <span className="serif italic text-accent font-normal">Gallery.</span>
        </h1>

        <p className="text-charcoal/60 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
          The product you're looking for seems to have vanished from the vault. It might have been claimed already, or moved to a new collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Link 
            href="/"
            className="w-full sm:w-auto px-10 h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <Link 
            href="/products"
            className="w-full sm:w-auto px-10 h-16 bg-white text-primary border border-primary/10 font-bold rounded-2xl hover:bg-cream transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            Explore Products
          </Link>
        </div>
      </div>

      <footer className="py-12 border-t border-primary/5 text-center relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/20">
          Giftisan • Every Story is a Product
        </p>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </main>
  );
}
