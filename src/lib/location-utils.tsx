import React from "react";
import { MapPin, ExternalLink } from "lucide-react";

export function parseAddressWithGps(addressText: string | null | undefined) {
  if (!addressText) return { cleanAddress: "", gpsUrl: null };

  const gpsMatch = addressText.match(/\[GPS Pin: (https:\/\/[^\]]+)\]/);
  const gpsUrl = gpsMatch ? gpsMatch[1] : null;
  const cleanAddress = addressText.replace(/\[GPS Pin: https:\/\/[^\]]+\]/, '').trim();

  return { cleanAddress, gpsUrl };
}

export function ShippingAddressDisplay({ 
  address, 
  city, 
  country = "Egypt",
  className = "" 
}: { 
  address: string | null | undefined; 
  city?: string | null; 
  country?: string | null;
  className?: string; 
}) {
  const { cleanAddress, gpsUrl } = parseAddressWithGps(address);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className="font-medium">{cleanAddress || "No street address provided"}</p>
      {city && <p className="text-xs text-charcoal/60 font-semibold">{city}{country ? `, ${country}` : ""}</p>}
      {gpsUrl && (
        <a
          href={gpsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-black text-xs rounded-xl transition-all shadow-2xs hover:scale-105 active:scale-95 border border-accent/20"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open Exact GPS Location on Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      )}
    </div>
  );
}
