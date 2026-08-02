"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EGYPT_GOVERNORATES } from "@/lib/egypt-governorates";
import { cn } from "@/lib/utils";

interface GovernorateSelectProps {
  value: string;
  onChange: (govId: string) => void;
  isAr: boolean;
  hasError?: boolean;
}

export function GovernorateSelect({ value, onChange, isAr, hasError }: GovernorateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedGov = EGYPT_GOVERNORATES.find(g => g.id === value);

  // Filter governorates by search query
  const filteredGovs = EGYPT_GOVERNORATES.filter(g => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      g.nameEn.toLowerCase().includes(q) ||
      g.nameAr.includes(q)
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "w-full py-4 px-5 bg-white border rounded-xl md:rounded-2xl transition-all flex items-center justify-between text-left cursor-pointer shadow-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-accent/20",
          hasError 
            ? "border-accent ring-2 ring-accent/10" 
            : "border-primary/20 hover:shadow-md"
        )}
      >
        <div className="flex items-center gap-3 min-w-0 me-2">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <span className={cn("text-sm md:text-base font-bold truncate", selectedGov ? "text-primary" : "text-primary/40")}>
            {selectedGov 
              ? (isAr ? selectedGov.nameAr : selectedGov.nameEn)
              : (isAr ? "-- اختر المحافظة --" : "-- Select Governorate --")}
          </span>
        </div>

        <ChevronDown className={cn("w-5 h-5 text-primary/40 transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-accent")} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-primary/10 shadow-2xl shadow-primary/15 z-50 overflow-hidden p-2 backdrop-blur-lg"
          >
            {/* Quick Search Bar */}
            <div className="relative mb-2 px-1 pt-1">
              <Search className={cn("w-4 h-4 text-primary/30 absolute top-1/2 -translate-y-1/2", isAr ? "right-4" : "left-4")} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isAr ? "ابحث عن محافظة..." : "Search governorate..."}
                className={cn(
                  "w-full py-2.5 border border-primary/10 rounded-xl text-xs font-medium text-primary placeholder:text-primary/30 focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all bg-cream/60",
                  isAr ? "pe-9 ps-4" : "ps-9 pe-4"
                )}
                autoFocus
              />
            </div>

            {/* List Items */}
            <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pe-1">
              {filteredGovs.length === 0 ? (
                <div className="py-6 text-center text-xs font-medium text-primary/40">
                  {isAr ? "لم يتم العثور على نتائج" : "No governorate found"}
                </div>
              ) : (
                filteredGovs.map(gov => {
                  const isSelected = gov.id === value;
                  return (
                    <button
                      key={gov.id}
                      type="button"
                      onClick={() => {
                        onChange(gov.id);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all text-left",
                        isSelected 
                          ? "bg-primary text-white shadow-md shadow-primary/20" 
                          : "text-primary/80 hover:bg-accent/10 hover:text-accent"
                      )}
                    >
                      <span className="truncate">{isAr ? gov.nameAr : gov.nameEn}</span>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0 ms-2" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
