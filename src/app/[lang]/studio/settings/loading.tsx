"use client";

import { motion } from "framer-motion";
import { Loader2, Settings, User, Camera } from "lucide-react";

export default function StudioSettingsLoading() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream/30 pb-32">
      <div className="bg-white border-b border-primary/5 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-primary/5 rounded-2xl animate-pulse flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary/10" />
             </div>
             <div className="space-y-3">
                <div className="h-10 w-64 bg-primary/5 rounded-xl animate-pulse" />
                <div className="h-3 w-40 bg-primary/5 rounded-full animate-pulse" />
             </div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 py-12 md:py-16"
      >
        <div className="space-y-10">
          {/* Profile Section Skeleton */}
          <motion.div variants={item} className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="relative w-32 h-32 rounded-[2.5rem] bg-cream/50 border-2 border-dashed border-primary/5 flex items-center justify-center animate-pulse">
                  <User className="w-12 h-12 text-primary/10" />
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-primary/5 flex items-center justify-center">
                     <Camera className="w-5 h-5 text-primary/20" />
                  </div>
               </div>
               <div className="flex-1 space-y-6 w-full">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <div className="h-3 w-24 bg-primary/5 rounded-full animate-pulse" />
                        <div className="h-14 w-full bg-cream/50 rounded-xl animate-pulse" />
                     </div>
                     <div className="space-y-3">
                        <div className="h-3 w-20 bg-primary/5 rounded-full animate-pulse" />
                        <div className="h-14 w-full bg-cream/50 rounded-xl animate-pulse" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="h-3 w-24 bg-primary/5 rounded-full animate-pulse" />
               <div className="h-32 w-full bg-cream/50 rounded-2xl animate-pulse" />
            </div>
          </motion.div>

          {/* Social Links Skeleton */}
          <motion.div variants={item} className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl space-y-8">
             <div className="h-6 w-48 bg-primary/5 rounded-xl animate-pulse" />
             <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-14 w-full bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
                ))}
             </div>
          </motion.div>

          <motion.div variants={item} className="h-16 w-full bg-accent/20 rounded-2xl animate-pulse" />
        </div>
      </motion.div>

      {/* Syncing Overlay */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center pt-20 z-50">
         <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/20">
             <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1.5} />
         </div>
         <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse">Accessing Studio Controls</p>
      </div>
    </div>
  );
}
