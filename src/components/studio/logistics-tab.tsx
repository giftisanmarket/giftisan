"use client";

import { motion } from "framer-motion";
import { Sparkles, Coins, Banknote, Wallet, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogisticsTabProps {
  dict: any;
  handleJoinWaitlist: () => void;
  isJoiningWaitlist: boolean;
  hasJoinedWaitlist: boolean;
}

export function LogisticsTab({
  dict,
  handleJoinWaitlist,
  isJoiningWaitlist,
  hasJoinedWaitlist
}: LogisticsTabProps) {
  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 lg:p-20 border border-primary/5 shadow-2xl shadow-primary/5 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto py-8 md:py-12">
        <div className="text-center space-y-6 md:space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 text-accent text-[9px] md:text-[11px] font-black uppercase tracking-widest border border-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> {dict.studio.logistics_phase_2}
          </div>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-heading font-bold text-primary mb-6 md:mb-10 leading-[1.1]">
            {dict.studio.fulfillment_handsfree} <span className="serif italic font-normal text-accent">{dict.studio.fulfillment_handsfree_accent}</span>
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-charcoal/40 max-w-2xl mx-auto leading-relaxed font-medium">
            {dict.studio.logistics_desc.split('**').map((text: string, i: number) =>
              i % 2 === 1 ? <strong key={i} className="text-primary font-bold">{text}</strong> : text
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-start my-12 md:my-20">
          {[
            { label: dict.studio.direct_payments, icon: Coins, desc: dict.studio.egp_intl },
            { label: dict.studio.smart_shipping, icon: Banknote, desc: dict.studio.one_click_labels },
            { label: dict.studio.insured_transit, icon: Wallet, desc: dict.studio.peace_of_mind },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-cream/30 rounded-3xl border border-primary/5 opacity-60 flex flex-col items-center text-center md:items-start md:text-start">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-base font-bold text-primary mb-1">{item.label}</p>
              <p className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest leading-loose">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-10 md:p-16 bg-primary text-white rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <p className="font-bold text-xl md:text-3xl">{dict.studio.beta_test_title}</p>
              <p className="text-white/40 text-sm md:text-lg font-medium">{dict.studio.beta_test_desc}</p>
            </div>
            <button
              onClick={handleJoinWaitlist}
              disabled={isJoiningWaitlist || hasJoinedWaitlist}
              className={cn(
                "w-full sm:w-auto px-12 h-14 md:h-16 font-bold rounded-xl md:rounded-full transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl",
                hasJoinedWaitlist
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-white text-primary hover:bg-cream active:scale-95 duration-200"
              )}
            >
              {hasJoinedWaitlist ? (
                <>
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> {dict.studio.already_joined}
                </>
              ) : (
                <>
                  {isJoiningWaitlist ? dict.studio.joining : dict.studio.reserve_spot}
                </>
              )}
            </button>
          </div>
          <div className="absolute bottom-0 end-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
