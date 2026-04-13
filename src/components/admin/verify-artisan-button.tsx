"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toggleArtisanVerification } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function VerifyArtisanButton({ artisanId, currentStatus }: { artisanId: string, currentStatus: boolean }) {
  const [isVerified, setIsVerified] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const res = await toggleArtisanVerification(artisanId, !isVerified);
    if (res.success) {
      setIsVerified(!isVerified);
    } else {
      alert(res.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
        isVerified 
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200" 
          : "bg-primary/5 text-primary/60 border-primary/10 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
      )}
    >
      {isVerified ? (
        <>
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          Not Verified
        </>
      )}
    </button>
  );
}
