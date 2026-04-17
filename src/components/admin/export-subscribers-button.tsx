"use client";

import { Download, FileSpreadsheet } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date | string;
}

export default function ExportSubscribersButton({ subscribers, dict }: { subscribers: Subscriber[], dict: any }) {
  const exportToCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ["Email", "Joined Date", "Status"];
    const rows = subscribers.map(sub => {
      let formattedDate = "N/A";
      try {
        if (sub.createdAt) {
          const d = new Date(sub.createdAt);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          }
        }
      } catch (e) {
        console.error("Date formatting error:", e);
      }

      return [
        sub.email || "N/A",
        formattedDate,
        "Verified"
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `giftisan-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={subscribers.length === 0}
      className="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-2xl border border-primary shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      <div className="bg-white/10 p-1.5 rounded-lg">
        <FileSpreadsheet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </div>
      <div className="flex flex-col items-start leading-none gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{dict.admin.database}</span>
        <span className="text-xs font-black uppercase tracking-wider">{dict.admin.export_emails}</span>
      </div>
      <Download className="w-3 h-3 ms-2 opacity-40 group-hover:translate-y-0.5 transition-transform" />
    </button>
  );
}

