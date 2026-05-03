"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, MousePointer2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrowthTabProps {
  dict: any;
}

export function GrowthTab({ dict }: GrowthTabProps) {
  return (
    <div className="space-y-12">
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 lg:p-16 border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden relative">
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 md:gap-12 mb-12 md:mb-16 text-center lg:text-start">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary mb-4 md:mb-8 leading-tight">{dict.studio.growth_title} <span className="serif italic font-normal text-accent">{dict.studio.growth_title_accent}</span></h2>
              <p className="text-base md:text-xl text-charcoal/60 leading-relaxed font-medium">
                {dict.studio.growth_desc}
              </p>
            </div>
            <div className="shrink-0 flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-cream flex items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: dict.studio.tier_local_legend,
                desc: dict.studio.tier_local_legend_desc,
                icon: Trophy,
                color: "bg-amber-500",
                active: true
              },
              {
                title: dict.studio.tier_regional_star,
                desc: dict.studio.tier_regional_star_desc,
                icon: MousePointer2,
                color: "bg-blue-500",
                active: false
              },
              {
                title: dict.studio.tier_global_master,
                desc: dict.studio.tier_global_master_desc,
                icon: Heart,
                color: "bg-purple-500",
                active: false
              }
            ].map((tier, i) => (
              <div key={i} className={cn(
                "p-8 rounded-[2rem] border transition-all relative overflow-hidden group",
                tier.active ? "bg-white border-primary shadow-2xl shadow-primary/10" : "bg-cream/20 border-primary/5 grayscale opacity-60"
              )}>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", tier.color)}>
                  <tier.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-2">{tier.title}</h3>
                <p className="text-sm text-charcoal/40 font-medium leading-relaxed">{tier.desc}</p>
                {tier.active && (
                  <div className="absolute top-4 end-4">
                    <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {dict.studio.active_tier}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
