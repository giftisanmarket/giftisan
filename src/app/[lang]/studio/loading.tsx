"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles, MousePointer2, Heart, Percent, BarChart3, Info } from "lucide-react";

export default function StudioLoading() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream/30 pb-32">
      {/* Premium Header Skeleton */}
      <div className="bg-white border-b border-primary/5 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/5 rounded-xl animate-pulse" />
                 <div className="h-4 w-32 bg-primary/5 rounded-full animate-pulse" />
              </div>
              <div className="h-16 w-80 md:w-[500px] bg-primary/5 rounded-3xl animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-12 w-12 rounded-2xl bg-primary/5 animate-pulse hidden md:block" />
               ))}
               <div className="h-14 w-40 bg-primary/5 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20"
      >
        <div className="space-y-12">
          {/* Stats Grid - 4 Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map(i => (
              <motion.div variants={item} key={i} className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-3 w-20 bg-primary/5 rounded-full animate-pulse" />
                  <div className="h-8 w-24 bg-primary/5 rounded-xl animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pro Insights & Analysis */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div variants={item} className="h-64 bg-primary rounded-[3rem] border border-primary/5 animate-pulse shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 end-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </motion.div>
            <motion.div variants={item} className="h-64 bg-white rounded-[3rem] border border-primary/5 animate-pulse shadow-xl" />
          </div>

          {/* Main Chart Area */}
          <motion.div variants={item} className="bg-white rounded-[3rem] p-12 border border-primary/5 shadow-2xl shadow-primary/5 space-y-10">
            <div className="flex justify-between items-center">
               <div className="space-y-3">
                  <div className="h-8 w-64 bg-primary/5 rounded-xl animate-pulse" />
                  <div className="h-4 w-48 bg-primary/5 rounded-full animate-pulse" />
               </div>
               <div className="h-10 w-32 bg-accent/5 rounded-full animate-pulse" />
            </div>
            <div className="h-[350px] w-full bg-cream/20 rounded-[2rem] border border-primary/5 animate-pulse relative">
               <div className="absolute inset-0 flex items-end px-12 pb-8 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 bg-primary/5 rounded-t-lg animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={item} className="bg-white rounded-[3rem] p-12 border border-primary/5 shadow-2xl shadow-primary/5 space-y-10">
             <div className="h-8 w-48 bg-primary/5 rounded-xl animate-pulse" />
             <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-[2rem] border border-primary/5">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 animate-pulse shrink-0" />
                     <div className="flex-1 space-y-3">
                        <div className="h-4 w-40 bg-primary/5 rounded-full animate-pulse" />
                        <div className="h-3 w-64 bg-primary/5 rounded-full animate-pulse" />
                     </div>
                     <div className="w-20 h-4 bg-primary/5 rounded-full animate-pulse shrink-0" />
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Center Spinner - Iconic Experience */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center pt-20 z-50">
         <div className="relative">
            <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 animate-bounce">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
         </div>
         <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse">Syncing Artisan Hub</p>
      </div>
    </div>
  );
}
