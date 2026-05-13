"use client";

import { motion } from "framer-motion";
import { Loader2, Settings, User, Camera } from "lucide-react";
import { useParams } from "next/navigation";

export default function StudioSettingsLoading() {
  const params = useParams();
  const lang = params?.lang || "en";

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
    <div className="min-h-screen bg-cream/30 pb-32 overflow-x-hidden">
      <div className="bg-white border-b border-primary/5 pt-28 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-12">
          <div className="flex items-center gap-4 md:gap-6">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/5 rounded-xl md:rounded-2xl animate-pulse flex items-center justify-center">
                <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary/10" />
             </div>
             <div className="space-y-2 md:space-y-3">
                <div className="h-8 md:h-10 w-48 md:w-64 bg-primary/5 rounded-lg md:rounded-xl animate-pulse" />
                <div className="h-2 md:h-3 w-32 md:w-40 bg-primary/5 rounded-full animate-pulse" />
             </div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-4 md:px-12 py-8 md:py-16"
      >
        <div className="space-y-8 md:space-y-10">
          {/* Profile Section Skeleton */}
          <motion.div variants={item} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-xl space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
               <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-cream/50 border-2 border-dashed border-primary/5 flex items-center justify-center animate-pulse">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-primary/10" />
                  <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl shadow-lg border border-primary/5 flex items-center justify-center">
                     <Camera className="w-4 h-4 md:w-5 md:h-5 text-primary/20" />
                  </div>
               </div>
               <div className="flex-1 space-y-4 md:space-y-6 w-full">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                     <div className="space-y-2 md:space-y-3">
                        <div className="h-2 md:h-3 w-16 md:w-24 bg-primary/5 rounded-full animate-pulse" />
                        <div className="h-12 md:h-14 w-full bg-cream/50 rounded-xl animate-pulse" />
                     </div>
                     <div className="space-y-2 md:space-y-3">
                        <div className="h-2 md:h-3 w-12 md:w-20 bg-primary/5 rounded-full animate-pulse" />
                        <div className="h-12 md:h-14 w-full bg-cream/50 rounded-xl animate-pulse" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
               <div className="h-2 md:h-3 w-20 md:w-24 bg-primary/5 rounded-full animate-pulse" />
               <div className="h-24 md:h-32 w-full bg-cream/50 rounded-xl md:rounded-2xl animate-pulse" />
            </div>
          </motion.div>

          {/* Social Links Skeleton */}
          <motion.div variants={item} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-primary/5 shadow-xl space-y-6 md:space-y-8">
             <div className="h-5 md:h-6 w-32 md:w-48 bg-primary/5 rounded-lg md:rounded-xl animate-pulse" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 md:h-14 w-full bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
                ))}
             </div>
          </motion.div>

          <motion.div variants={item} className="h-14 md:h-16 w-full bg-accent/20 rounded-xl md:rounded-2xl animate-pulse" />
        </div>
      </motion.div>

      {/* Syncing Overlay */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center z-50">
         <div className="w-20 h-20 md:w-24 md:h-24 bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/20">
             <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin" strokeWidth={1.5} />
         </div>
         <p className="mt-6 md:mt-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse text-center px-4">
           {lang === "ar" ? "جاري الوصول إلى إعدادات الأستوديو..." : "Accessing Studio Controls"}
         </p>
      </div>
    </div>
  );
}
