"use client";

import { motion } from "framer-motion";
import { Store, Loader2, Sparkles } from "lucide-react";

export default function StudioLoading() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 overflow-hidden">
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

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-12 max-w-7xl"
      >
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 space-y-8">
             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div variants={item} key={i} className="h-32 bg-white rounded-3xl border border-primary/5 animate-pulse shadow-sm" />
                ))}
             </div>
             {/* Large Chart Area */}
             <motion.div variants={item} className="h-[400px] bg-white rounded-[2.5rem] border border-primary/5 animate-pulse shadow-sm" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div variants={item} className="h-96 bg-white rounded-[2.5rem] border border-primary/5 animate-pulse shadow-sm" />
            <motion.div variants={item} className="h-64 bg-white rounded-[2.5rem] border border-primary/5 animate-pulse shadow-sm" />
          </div>
        </div>
      </motion.div>

      {/* Center Spinner */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center pt-20 z-50">
         <div className="relative">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-primary/5">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
         </div>
         <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 animate-pulse">Syncing Artisan Hub</p>
      </div>
    </div>
  );
}
