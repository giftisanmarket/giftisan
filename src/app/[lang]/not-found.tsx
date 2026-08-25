"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Compass, ArrowLeft, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const isAr = lang === "ar";

  return (
    <main className="min-h-screen bg-cream flex flex-col justify-between relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10 pt-28 md:pt-36 pb-16">
        <div className="relative mb-8 md:mb-10">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-primary/5 shadow-2xl shadow-primary/10 transition-transform hover:scale-105 duration-500">
            <Compass className="w-14 h-14 md:w-18 md:h-18 text-accent animate-spin-slow" />
          </div>
          <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
            <span className="font-heading font-black text-xs md:text-sm">404</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-primary mb-4 md:mb-6 tracking-tight">
          {isAr ? (
            <>
              تائه في <br />
              <span className="serif italic text-accent font-normal">المعرض.</span>
            </>
          ) : (
            <>
              Lost in the <br />
              <span className="serif italic text-accent font-normal">Gallery.</span>
            </>
          )}
        </h1>

        <p className="text-charcoal/60 max-w-lg mx-auto mb-8 md:mb-10 text-sm sm:text-base md:text-lg leading-relaxed font-medium px-2">
          {isAr
            ? "الصفحة أو القطعة الفنية التي تبحث عنها غير موجودة أو تم نقلها إلى تشكيلة أخرى."
            : "The product or page you're looking for seems to have vanished from the vault. It might have been claimed already, or moved to a new collection."}
        </p>

        {/* Responsive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full max-w-md px-4 sm:px-0">
          <Link 
            href={`/${lang}`}
            className="w-full sm:w-auto min-w-[190px] px-8 h-12 md:h-14 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2.5 active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 rtl:rotate-180 shrink-0" />
            <span>{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
          </Link>
          <Link 
            href={`/${lang}/products`}
            className="w-full sm:w-auto min-w-[190px] px-8 h-12 md:h-14 bg-white text-primary border border-primary/10 font-bold rounded-xl md:rounded-2xl hover:bg-cream hover:border-primary/20 transition-all shadow-md shadow-primary/5 flex items-center justify-center gap-2.5 active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent shrink-0" />
            <span>{isAr ? "استكشف المنتجات" : "Explore Products"}</span>
          </Link>
        </div>
      </div>

      <footer className="py-6 md:py-8 border-t border-primary/5 text-center relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/30">
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
