import { motion } from "framer-motion";
import { Store, Loader2 } from "lucide-react";

export default function StudioLoading() {
  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-20 overflow-hidden">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-primary/5 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-primary/5 rounded-full animate-pulse" />
              <div className="h-12 w-64 bg-primary/5 rounded-2xl animate-pulse" />
            </div>
            <div className="h-14 w-40 bg-primary/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 space-y-8">
             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-white rounded-3xl border border-primary/5 animate-pulse" />
                ))}
             </div>
             {/* Large Chart Area */}
             <div className="h-[400px] bg-white rounded-[2.5rem] border border-primary/5 animate-pulse" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-8">
            <div className="h-96 bg-white rounded-[2.5rem] border border-primary/5 animate-pulse" />
            <div className="h-64 bg-white rounded-[2.5rem] border border-primary/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Center Spinner */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center pt-20">
         <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
         </div>
         <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary/40">Syncing with Artisan Hub</p>
      </div>
    </div>
  );
}
