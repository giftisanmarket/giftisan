"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface ArtisanData {
  name: string;
  email: string;
  artisanProfile?: {
    studioName?: string;
    phoneNumber?: string;
    location?: string;
  };
}

export default function ExportArtisansButton({ users, dict }: { users: any[]; dict: any }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    // Filter only artisans
    const artisans = users.filter(u => u.role === "ARTISAN");
    
    const headers = ["Studio Name", "Artisan Name", "Email", "Phone Number", "Location"];
    const rows = artisans.map(u => [
      u.artisanProfile?.studioName || u.name,
      u.name,
      u.email,
      u.artisanProfile?.phoneNumber || "N/A",
      u.artisanProfile?.location || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `giftisan_artisan_contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={isExporting}
      className="h-10 md:h-12 px-5 md:px-6 bg-white border border-primary/10 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 hover:bg-primary/5 hover:text-accent hover:border-accent/20 transition-all active:scale-95 disabled:opacity-50 group"
    >
      <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
      {isExporting ? "Exporting..." : (dict.admin?.export_emails || "Export Contacts")}
    </button>
  );
}
