"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Mail, 
  Clock, 
  Search, 
  X, 
  Send, 
  CheckSquare, 
  Square, 
  ArrowUpDown, 
  ChevronDown, 
  Check,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import ExportSubscribersButton from "@/components/admin/export-subscribers-button";
import DeleteSubscriberButton from "@/components/admin/delete-subscriber-button";

interface AdminSubscribersClientProps {
  initialSubscribers: any[];
  dict: any;
  lang: string;
}

export function AdminSubscribersClient({ initialSubscribers, dict, lang }: AdminSubscribersClientProps) {
  const isAr = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("NEWEST");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sortOptions = [
    { key: "NEWEST", label: isAr ? "الأحدث انضماماً" : "Newest Subscribers" },
    { key: "OLDEST", label: isAr ? "الأقدم انضماماً" : "Oldest Subscribers" },
    { key: "EMAIL_ASC", label: isAr ? "البريد الإلكتروني (أ - ي)" : "Email (A-Z)" },
  ];

  const activeSortOption = sortOptions.find(o => o.key === sortBy) || sortOptions[0];

  // Filter & Sort
  const filteredSubscribers = useMemo(() => {
    return initialSubscribers.filter((sub) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return sub.email?.toLowerCase().includes(query);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "OLDEST") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "EMAIL_ASC") return (a.email || "").localeCompare(b.email || "");
      return 0;
    });
  }, [initialSubscribers, searchQuery, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubscribers.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Get selected emails string for mail sender navigation
  const selectedEmails = useMemo(() => {
    return initialSubscribers
      .filter(s => selectedIds.includes(s.id))
      .map(s => s.email)
      .join(",");
  }, [initialSubscribers, selectedIds]);

  return (
    <div className="space-y-8 md:space-y-12" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter">
            {dict.admin?.newsletter_title || "Newsletter"} <span className="serif italic text-accent font-normal">{dict.admin?.subscribers_accent || "Subscribers"}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium mt-2">
            {dict.admin?.mailing_list_desc || "Manage platform subscribers, export mailing lists, and dispatch marketing announcements."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <ExportSubscribersButton subscribers={initialSubscribers} dict={dict} />
          <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-center min-w-[140px]">
            <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-0.5">
              {dict.admin?.total_interest || (isAr ? "إجمالي المشتركين" : "Total Interest")}
            </p>
            <p className="text-xl md:text-2xl font-black text-primary leading-none">{initialSubscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Sorting & Bulk Mail Actions */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-primary/5 shadow-xl shadow-primary/5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-primary/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث بالبريد الإلكتروني..." : "Search by email address..."}
              className="w-full h-12 ps-11 pe-10 bg-cream/30 border border-primary/5 rounded-2xl text-xs font-bold text-primary placeholder:text-primary/30 focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-primary/30 hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Custom Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="h-12 px-5 bg-white border border-primary/10 hover:border-accent text-primary rounded-2xl flex items-center justify-between gap-3 font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                <span>{activeSortOption.label}</span>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-primary/40", isSortOpen && "rotate-180")} />
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
                <div className="absolute top-full end-0 mt-2 w-56 bg-white rounded-2xl border border-primary/10 shadow-2xl z-40 overflow-hidden py-1.5 px-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSortBy(option.key);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start",
                          isSelected
                            ? "bg-primary text-white shadow-md font-black"
                            : "text-charcoal/70 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-light shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar if items selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 px-4 bg-accent/10 border border-accent/20 rounded-2xl animate-in fade-in duration-200">
            <span className="text-xs font-bold text-accent">
              {isAr ? `تم تحديد ${selectedIds.length} مشتركون` : `${selectedIds.length} subscriber(s) selected`}
            </span>
            <Link
              href={`/${lang}/admin/mail-sender?recipients=${encodeURIComponent(selectedEmails)}`}
              className="px-4 py-2 bg-accent text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-accent/90 transition-all shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? "إرسال حملة بريدية للمحددين" : "Send Broadcast to Selected"}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[600px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="w-12 px-4 py-4 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-primary/40 hover:text-primary transition-colors cursor-pointer"
                  >
                    {selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-accent" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] text-start">
                  {dict.admin?.contact_email || (isAr ? "البريد الإلكتروني" : "Contact Email")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] text-start">
                  {dict.admin?.joined_date || (isAr ? "تاريخ الاشتراك" : "Joined Date")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] text-start">
                  {dict.admin?.status || (isAr ? "الحالة" : "Status")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] text-end">
                  {dict.admin?.actions || (isAr ? "الإجراءات" : "Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((sub: any) => {
                  const isSelected = selectedIds.includes(sub.id);
                  return (
                    <tr key={sub.id} className={cn("hover:bg-cream/30 transition-colors group", isSelected && "bg-accent/5")}>
                      <td className="w-12 px-4 py-4 text-center">
                        <button
                          onClick={() => toggleSelectOne(sub.id)}
                          className="text-primary/40 hover:text-primary transition-colors cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-accent" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                            <Mail className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                          </div>
                          <span className="font-bold text-primary text-sm line-clamp-1">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-2 text-primary/60 font-medium text-[10px] md:text-xs">
                          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-40 shrink-0" />
                          <span className="whitespace-nowrap">
                            {new Date(sub.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5">
                        <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-green-100 text-green-700 text-[8px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          {dict.admin?.verified || (isAr ? "موثق ومفعل" : "Verified")}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-5 text-end">
                        <DeleteSubscriberButton id={sub.id} email={sub.email} dict={dict} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 md:px-8 py-16 md:py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-primary/20" />
                      </div>
                      <p className="text-primary/40 font-bold uppercase tracking-widest text-xs md:text-sm">
                        {searchQuery ? (isAr ? "لم يتم العثور على أي مشتركين يطابقون تصفيتك." : "No subscribers match your search.") : (dict.admin?.no_subscribers || "No subscribers yet.")}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-primary/30 text-[10px] font-bold uppercase tracking-[0.3em]">
        {dict.admin?.admin_footer_info || "Giftisan Administrative Control Suite"}
      </p>
    </div>
  );
}
