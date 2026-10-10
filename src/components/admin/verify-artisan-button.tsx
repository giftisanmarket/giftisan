"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Clock, Check, X } from "lucide-react";
import { toggleArtisanVerification, updateArtisanStatus } from "@/lib/actions";
import { cn } from "@/lib/utils";

import { toast } from "react-hot-toast";

type ArtisanStatus = "PENDING" | "APPROVED" | "REJECTED";

export function VerifyArtisanButton({ 
  artisanId, 
  currentStatus, 
  status: initialStatus,
  dict,
  className
}: { 
  artisanId: string;
  currentStatus: boolean;
  status: ArtisanStatus;
  dict: any;
  className?: string;
}) {
  const [isVerified, setIsVerified] = useState(currentStatus);
  const [status, setStatus] = useState<ArtisanStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVerification = async () => {
    setIsLoading(true);
    const res = await toggleArtisanVerification(artisanId, !isVerified);
    if (res.success) {
      setIsVerified(!isVerified);
      toast.success(!isVerified ? dict.admin?.artisan_verified || "Artisan verified" : dict.admin?.artisan_unverified || "Artisan unverified", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    } else {
      toast.error(res.error || dict.admin?.update_verification_failed || "Update failed", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (newStatus: ArtisanStatus) => {
    setIsLoading(true);
    const res = await updateArtisanStatus(artisanId, newStatus);
    if (res.success) {
      setStatus(newStatus);
      const statusLabel = 
        newStatus === "APPROVED" ? (dict.admin?.approve || "Approved") :
        newStatus === "PENDING" ? (dict.admin?.pending || "Pending") :
        (dict.admin?.reject || "Rejected");

      const successMsg = dict.admin?.studio_status_updated 
        ? dict.admin.studio_status_updated.replace('{status}', statusLabel)
        : `Shop status updated to ${statusLabel}`;

      toast.success(successMsg, {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    } else {
      toast.error(res.error || dict.studio?.update_failed || "Update failed", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {/* Approval Status Section */}
      <div className="flex flex-col gap-1.5 w-full">
        <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">
          {dict.admin?.studio_approval || "Shop Approval"}
        </p>
        <div className="grid grid-cols-3 gap-1 p-1 bg-primary/5 rounded-2xl w-full max-w-sm">
          <button
            type="button"
            onClick={() => handleUpdateStatus("APPROVED")}
            disabled={isLoading || status === "APPROVED"}
            className={cn(
              "px-2 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-w-0 cursor-pointer",
              status === "APPROVED" 
                ? "bg-white text-green-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <Check className="w-3 h-3 shrink-0" />
            <span className="truncate">{dict.admin?.approve || "Approve"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleUpdateStatus("PENDING")}
            disabled={isLoading || status === "PENDING"}
            className={cn(
              "px-2 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-w-0 cursor-pointer",
              status === "PENDING" 
                ? "bg-white text-amber-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{dict.admin?.pending || "Pending"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleUpdateStatus("REJECTED")}
            disabled={isLoading || status === "REJECTED"}
            className={cn(
              "px-2 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 min-w-0 cursor-pointer",
              status === "REJECTED" 
                ? "bg-white text-red-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <X className="w-3 h-3 shrink-0" />
            <span className="truncate">{dict.admin?.reject || "Freeze"}</span>
          </button>
        </div>
      </div>

      {/* Verification Badge Section */}
      <div className="flex flex-col gap-1.5 w-full">
        <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">
          {dict.admin?.authentic_badge || "Authentic Badge"}
        </p>
        <button
          type="button"
          onClick={handleToggleVerification}
          disabled={isLoading}
          className={cn(
            "flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border w-full sm:w-fit shadow-sm cursor-pointer",
            isVerified 
              ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" 
              : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
          )}
        >
          {isVerified ? (
            <>
              <ShieldCheck className="w-4 h-4 fill-blue-600 text-white shrink-0" />
              <span className="truncate">{dict.admin?.verified_artisan || "Verified Artisan"}</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="truncate">{dict.admin?.standard_artisan || "Standard Artisan"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

