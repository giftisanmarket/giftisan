"use client";

import { Loader2, Store } from "lucide-react";
import { useParams } from "next/navigation";

export default function Loading() {
  const params = useParams();
  const lang = params?.lang || "en";

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-primary/5">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Store className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="mt-8 space-y-2 text-center">
        <h2 className="text-xl font-heading font-bold text-primary animate-pulse">
          {lang === "ar" ? "دخول ورشة العمل" : "Entering the Workshop"}
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
          {lang === "ar" ? "جاري مزامنة بيانات العارض..." : "Syncing Artisan Credentials"}
        </p>
      </div>
    </main>
  );
}
