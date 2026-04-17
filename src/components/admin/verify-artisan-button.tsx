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
  dict
}: { 
  artisanId: string;
  currentStatus: boolean;
  status: ArtisanStatus;
  dict: any;
}) {
  const [isVerified, setIsVerified] = useState(currentStatus);
  const [status, setStatus] = useState<ArtisanStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVerification = async () => {
    setIsLoading(true);
    const res = await toggleArtisanVerification(artisanId, !isVerified);
    if (res.success) {
      setIsVerified(!isVerified);
      toast.success(!isVerified ? dict.admin.artisan_verified : dict.admin.artisan_unverified, {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    } else {
      toast.error(res.error || dict.admin.update_verification_failed, {
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
      toast.success(dict.admin.studio_status_updated.replace('{status}', newStatus), {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    } else {
      toast.error(res.error || dict.studio.update_failed, {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Approval Status Section */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">{dict.admin.studio_approval}</p>
        <div className="flex items-center gap-1.5 p-1 bg-primary/5 rounded-2xl w-fit">
          <button
            onClick={() => handleUpdateStatus("APPROVED")}
            disabled={isLoading || status === "APPROVED"}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
              status === "APPROVED" 
                ? "bg-white text-green-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <Check className="w-3 h-3" />
            {dict.admin.approve}
          </button>
          
          <button
            onClick={() => handleUpdateStatus("PENDING")}
            disabled={isLoading || status === "PENDING"}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
              status === "PENDING" 
                ? "bg-white text-amber-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <Clock className="w-3 h-3" />
            {dict.admin.pending}
          </button>

          <button
            onClick={() => handleUpdateStatus("REJECTED")}
            disabled={isLoading || status === "REJECTED"}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
              status === "REJECTED" 
                ? "bg-white text-red-600 shadow-sm" 
                : "text-primary/40 hover:text-primary"
            )}
          >
            <X className="w-3 h-3" />
            {dict.admin.reject}
          </button>
        </div>
      </div>

      {/* Verification Badge Section */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">{dict.admin.authentic_badge}</p>
        <button
          onClick={handleToggleVerification}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border w-fit shadow-sm",
            isVerified 
              ? "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" 
              : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
          )}
        >
          {isVerified ? (
            <>
              <ShieldCheck className="w-4 h-4 fill-blue-600 text-white" />
              {dict.admin.verified_artisan}
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              {dict.admin.standard_artisan}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

