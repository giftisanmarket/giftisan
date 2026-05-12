"use client";

import { useState } from "react";
import { DollarSign, Save, X, Percent } from "lucide-react";
import { updateArtisanCommission } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface CommissionManagerProps {
  artisanId: string;
  currentRate: number;
  dict: any;
}

export function CommissionManager({ artisanId, currentRate, dict }: CommissionManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rate, setRate] = useState(currentRate * 100); // Display as percentage
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    const result = await updateArtisanCommission(artisanId, rate / 100);

    if (result.success) {
      toast.success("Commission rate updated!", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update commission");
    }
    setIsLoading(false);
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/5 bg-cream/10 hover:bg-primary/5 transition-all"
      >
        <Percent className="w-3 h-3 text-primary/40 group-hover:text-accent transition-colors" />
        <span className="text-[10px] font-black text-primary">
          {(currentRate * 100).toFixed(0)}%
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
      <div className="relative">
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-16 h-8 px-2 pe-6 rounded-lg border border-accent/30 bg-white text-xs font-bold text-primary focus:outline-none focus:border-accent"
          min="0"
          max="100"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-charcoal/40">%</span>
      </div>
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Save className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setRate(currentRate * 100);
        }}
        className="w-8 h-8 rounded-lg bg-charcoal/5 text-charcoal flex items-center justify-center hover:bg-charcoal/10 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
