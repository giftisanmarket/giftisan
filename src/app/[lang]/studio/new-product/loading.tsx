"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles, Image as ImageIcon, Plus } from "lucide-react";

export default function NewProductLoading() {
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
      <div className="bg-white border-b border-primary/5 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-4">
             <div className="h-4 w-32 bg-primary/5 rounded-full animate-pulse" />
             <div className="h-12 w-64 md:w-96 bg-primary/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 py-12 md:py-16"
      >
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Side: Form Skeleton */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div variants={item} className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-xl space-y-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="space-y-4">
                    <div className="h-3 w-24 bg-primary/5 rounded-full animate-pulse" />
                    <div className="h-14 w-full bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
                 </div>
               ))}
               <div className="grid grid-cols-2 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-4">
                       <div className="h-3 w-20 bg-primary/5 rounded-full animate-pulse" />
                       <div className="h-14 w-full bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
                    </div>
                  ))}
               </div>
            </motion.div>

            <motion.div variants={item} className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-xl space-y-6">
               <div className="h-5 w-40 bg-primary/5 rounded-full animate-pulse" />
               <div className="h-32 w-full bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
            </motion.div>
          </div>

          {/* Right Side: Image Upload Skeleton */}
          <div className="lg:col-span-5 space-y-8">
             <motion.div variants={item} className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-xl space-y-8">
                <div className="h-5 w-32 bg-primary/5 rounded-full animate-pulse" />
                <div className="aspect-square w-full bg-cream/50 rounded-3xl border-2 border-dashed border-primary/5 flex items-center justify-center animate-pulse">
                   <ImageIcon className="w-12 h-12 text-primary/10" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="aspect-square bg-cream/50 rounded-xl border border-primary/5 animate-pulse" />
                   ))}
                </div>
             </motion.div>
             
             <motion.div variants={item} className="h-16 w-full bg-accent rounded-2xl animate-pulse shadow-lg shadow-accent/20" />
          </div>
        </div>
      </motion.div>

      {/* Syncing Overlay */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center pt-20 z-50">
         <div className="w-20 h-20 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/20">
             <Plus className="w-10 h-10 text-primary animate-pulse" />
         </div>
         <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Preparing Workshop</p>
      </div>
    </div>
  );
}
