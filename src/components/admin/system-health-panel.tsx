"use client";

import { useState } from "react";
import { ShieldCheck, RefreshCw, ArrowUpRight, AlertTriangle, XCircle } from "lucide-react";

interface SystemHealthPanelProps {
  dict: any;
  isAr?: boolean;
}

interface ServiceStatus {
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  details?: string;
}

export function SystemHealthPanel({ dict, isAr }: SystemHealthPanelProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [services, setServices] = useState<Record<string, ServiceStatus>>({
    auth: { status: "operational", latencyMs: 0 },
    database: { status: "operational", latencyMs: 0 },
    storage: { status: "operational", latencyMs: 0 },
  });

  const runHealthCheck = async () => {
    if (isTesting) return;
    setIsTesting(true);
    try {
      const res = await fetch("/api/admin/health-check");
      if (res.ok) {
        const data = await res.json();
        if (data.services) {
          setServices(data.services);
        }
        setLastChecked(
          new Date().toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (error) {
      console.error("Failed to run health check:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = (serviceKey: string) => {
    const service = services[serviceKey] || { status: "operational", latencyMs: 0 };
    const statusText =
      service.status === "operational"
        ? dict.admin.operational || "Operational"
        : service.status === "degraded"
        ? dict.admin.degraded || "Degraded"
        : dict.admin.down || "Offline";

    if (service.status === "operational") {
      return (
        <span className="text-[8px] md:text-[9px] font-black text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 whitespace-nowrap flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {statusText}
          {service.latencyMs > 0 && (
            <span className="text-emerald-400/60 text-[8px] ml-1">({service.latencyMs}ms)</span>
          )}
        </span>
      );
    }

    if (service.status === "degraded") {
      return (
        <span className="text-[8px] md:text-[9px] font-black text-amber-400 px-2.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 whitespace-nowrap flex items-center gap-1.5">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
          {statusText}
          {service.latencyMs > 0 && (
            <span className="text-amber-400/60 text-[8px] ml-1">({service.latencyMs}ms)</span>
          )}
        </span>
      );
    }

    return (
      <span className="text-[8px] md:text-[9px] font-black text-red-400 px-2.5 py-1 bg-red-500/10 rounded-full border border-red-500/20 whitespace-nowrap flex items-center gap-1.5">
        <XCircle className="w-2.5 h-2.5 text-red-400" />
        {statusText}
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-primary px-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {dict.admin.system_health}
        </div>
        {lastChecked && (
          <span className="text-[10px] md:text-xs text-muted-foreground font-medium">
            {dict.admin.last_checked || "Last Checked"}: {lastChecked}
          </span>
        )}
      </h2>

      <div className="bg-primary text-white p-8 rounded-[2rem] shadow-2xl shadow-primary/20 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-white/10" />

        {/* AUTH SERVICE */}
        <div className="space-y-2 relative z-10">
          <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">
            {dict.admin.auth_service}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm md:text-base shrink-0">NextAuth Edge</span>
            {getStatusBadge("auth")}
          </div>
        </div>

        {/* DATABASE */}
        <div className="space-y-2 relative z-10">
          <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">
            {dict.admin.database || "Database"}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm md:text-base shrink-0">Prisma / SQL</span>
            {getStatusBadge("database")}
          </div>
        </div>

        {/* STORAGE */}
        <div className="space-y-2 relative z-10">
          <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">
            {dict.admin.storage}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-sm md:text-base shrink-0">Global CDN</span>
            {getStatusBadge("storage")}
          </div>
        </div>

        {/* TEST BUTTON */}
        <button
          onClick={runHealthCheck}
          disabled={isTesting}
          className="w-full h-12 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-xs md:text-sm border border-white/5 active:scale-95 relative z-10 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-accent" />
              {dict.admin.testing || "Testing System..."}
            </>
          ) : (
            <>
              {dict.admin.infrastructure_test} <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
