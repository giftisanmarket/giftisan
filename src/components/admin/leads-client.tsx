"use client";

import { useState, useTransition } from "react";
import { updateAbandonedCheckoutLead } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Copy,
  StickyNote,
  ShoppingBag,
  BadgeCheck,
  Clock,
  User,
} from "lucide-react";

type Lead = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  totalAmount: number;
  items: any;
  orderNotes: string | null;
  couponCode: string | null;
  discountApplied: number | null;
  shippingCost: number | null;
  status: string;
  isContacted: boolean;
  adminNotes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const STATUS_COLORS: Record<string, string> = {
  ABANDONED: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED_PAYMENT: "bg-red-50 text-red-700 border-red-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUS_LABELS: Record<string, string> = {
  ABANDONED: "Abandoned",
  FAILED_PAYMENT: "Failed Payment",
  CONVERTED: "Converted",
};

function LeadRow({ lead: initialLead, isAr }: { lead: Lead; isAr: boolean }) {
  const [lead, setLead] = useState(initialLead);
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(lead.adminNotes || "");
  const [isPending, startTransition] = useTransition();

  const items: any[] = Array.isArray(lead.items) ? lead.items : [];

  const toggleContacted = () => {
    startTransition(async () => {
      const next = !lead.isContacted;
      const result = await updateAbandonedCheckoutLead(lead.id, { isContacted: next });
      if (result.success) {
        setLead((prev) => ({ ...prev, isContacted: next }));
        toast.success(next ? "Marked as contacted" : "Marked as not contacted");
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  const saveNotes = () => {
    startTransition(async () => {
      const result = await updateAbandonedCheckoutLead(lead.id, { adminNotes: notesDraft });
      if (result.success) {
        setLead((prev) => ({ ...prev, adminNotes: notesDraft }));
        setEditingNotes(false);
        toast.success("Notes saved");
      } else {
        toast.error(result.error || "Failed to save notes");
      }
    });
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(label + " copied!"));
  };

  const formattedDate = new Date(lead.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border shadow-sm transition-all duration-300",
        lead.isContacted ? "border-emerald-200/60" : "border-primary/8",
        lead.status === "CONVERTED" ? "opacity-70" : ""
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 md:p-5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={toggleContacted}
            disabled={isPending}
            className="shrink-0 mt-0.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer p-0.5"
            title={lead.isContacted ? "Mark as not contacted" : "Mark as contacted"}
          >
            {lead.isContacted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5 text-primary/20 hover:text-emerald-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <p className="font-bold text-primary text-sm truncate">{lead.customerName}</p>
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0",
                  STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600 border-gray-200"
                )}
              >
                {STATUS_LABELS[lead.status] || lead.status}
              </span>
              {lead.isContacted && (
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  Contacted
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
              <button
                onClick={() => copyText(lead.customerEmail, "Email")}
                className="flex items-center gap-1 text-[11px] text-charcoal/60 hover:text-accent transition-colors cursor-pointer"
              >
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-[200px]">{lead.customerEmail}</span>
              </button>
              {lead.customerPhone && (
                <button
                  onClick={() => copyText(lead.customerPhone, "Phone")}
                  className="flex items-center gap-1 text-[11px] text-charcoal/60 hover:text-accent transition-colors cursor-pointer"
                >
                  <Phone className="w-3 h-3 shrink-0" />
                  <span>{lead.customerPhone}</span>
                </button>
              )}
              {lead.shippingCity && (
                <span className="flex items-center gap-1 text-[11px] text-charcoal/50">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {lead.shippingCity}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-primary/5 shrink-0">
          <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
            <p className="text-base font-bold text-accent font-heading">
              EGP {Number(lead.totalAmount).toLocaleString()}
            </p>
            <p className="text-[10px] text-charcoal/40 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </p>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-cream transition-colors cursor-pointer"
            aria-label="Toggle details"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-primary/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary/40" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-primary/5 p-4 md:p-6 space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3 h-3" /> Items ({items.length})
            </p>
            <div className="space-y-2">
              {items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3 bg-cream/40 rounded-xl gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-primary text-xs">{item.name}</p>
                    {item.personalization && (
                      <p className="text-[10px] text-charcoal/60 mt-0.5 italic">
                        Personalization: {item.personalization}
                      </p>
                    )}
                    {item.customImage && (
                      <p className="text-[10px] text-accent mt-0.5">Custom image attached</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-primary">
                      EGP {Number(item.price).toLocaleString()} x {item.quantity}
                    </p>
                    <p className="text-[10px] text-charcoal/50">
                      = EGP {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lead.shippingCost !== null && Number(lead.shippingCost) > 0 && (
              <div className="bg-cream/40 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1">Shipping</p>
                <p className="font-bold text-primary text-sm">EGP {Number(lead.shippingCost).toLocaleString()}</p>
              </div>
            )}
            {lead.discountApplied !== null && Number(lead.discountApplied) > 0 && (
              <div className="bg-cream/40 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1">Discount</p>
                <p className="font-bold text-emerald-600 text-sm">- EGP {Number(lead.discountApplied).toLocaleString()}</p>
              </div>
            )}
            {lead.couponCode && (
              <div className="bg-cream/40 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1">Coupon</p>
                <p className="font-bold text-primary text-sm font-mono">{lead.couponCode}</p>
              </div>
            )}
            {lead.shippingAddress && (
              <div className="bg-cream/40 rounded-xl p-3 col-span-2 md:col-span-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1">Address</p>
                <p className="text-xs text-charcoal/70 leading-relaxed">{lead.shippingAddress}</p>
              </div>
            )}
          </div>

          {lead.orderNotes && (
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 mb-1">Order Notes</p>
              <p className="text-xs text-charcoal/70 italic">{lead.orderNotes}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2 flex items-center gap-1.5">
              <StickyNote className="w-3 h-3" /> Admin Notes
            </p>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add your notes about this lead..."
                  className="w-full text-xs p-3 rounded-xl border border-primary/10 bg-white resize-none outline-none focus:border-accent/40 transition-colors"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNotes}
                    disabled={isPending}
                    className="px-4 py-1.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Notes"}
                  </button>
                  <button
                    onClick={() => { setEditingNotes(false); setNotesDraft(lead.adminNotes || ""); }}
                    className="px-4 py-1.5 bg-cream text-primary text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-cream/60 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingNotes(true)}
                className="w-full text-left p-3 rounded-xl border border-dashed border-primary/10 hover:border-accent/30 transition-colors group"
              >
                {lead.adminNotes ? (
                  <p className="text-xs text-charcoal/70">{lead.adminNotes}</p>
                ) : (
                  <p className="text-xs text-charcoal/30 italic group-hover:text-charcoal/50 transition-colors">
                    Click to add admin notes...
                  </p>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={"mailto:" + lead.customerEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/5 text-accent border border-accent/20 text-[11px] font-black hover:bg-accent hover:text-white transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Email
            </a>
            <a
              href={"tel:" + lead.customerPhone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black hover:bg-emerald-600 hover:text-white transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
            <button
              onClick={toggleContacted}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all",
                lead.isContacted
                  ? "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  : "bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white"
              )}
            >
              {lead.isContacted ? "Unmark Contacted" : "Mark as Contacted"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function LeadsClient({
  initialLeads,
  total,
  isAr,
}: {
  initialLeads: Lead[];
  total: number;
  isAr: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered =
    statusFilter === "ALL"
      ? initialLeads
      : initialLeads.filter((l) => l.status === statusFilter);

  const stats = {
    total: initialLeads.length,
    abandoned: initialLeads.filter((l) => l.status === "ABANDONED").length,
    converted: initialLeads.filter((l) => l.status === "CONVERTED").length,
    contacted: initialLeads.filter((l) => l.isContacted).length,
    totalValue: initialLeads.reduce((sum, l) => sum + Number(l.totalAmount), 0),
  };

  const filters = [
    { label: "All", value: "ALL", count: stats.total },
    { label: "Abandoned", value: "ABANDONED", count: stats.abandoned },
    { label: "Failed Payment", value: "FAILED_PAYMENT", count: initialLeads.filter((l) => l.status === "FAILED_PAYMENT").length },
    { label: "Converted", value: "CONVERTED", count: stats.converted },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-primary/5 shadow-sm p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1.5 flex items-center gap-1"><User className="w-3 h-3" /> Total Leads</p>
          <p className="text-2xl font-heading font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-primary/5 shadow-sm p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Abandoned</p>
          <p className="text-2xl font-heading font-bold text-amber-600">{stats.abandoned}</p>
        </div>
        <div className="bg-white rounded-2xl border border-primary/5 shadow-sm p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1.5 flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Contacted</p>
          <p className="text-2xl font-heading font-bold text-emerald-600">{stats.contacted}</p>
        </div>
        <div className="bg-white rounded-2xl border border-primary/5 shadow-sm p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1.5 flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Lead Value</p>
          <p className="text-2xl font-heading font-bold text-accent">EGP {stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border shrink-0 whitespace-nowrap cursor-pointer",
              statusFilter === f.value
                ? "bg-primary text-white border-primary shadow-lg"
                : "bg-white text-primary/50 border-primary/10 hover:border-primary/20 hover:text-primary"
            )}
          >
            {f.label}
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-black", statusFilter === f.value ? "bg-white/20 text-white" : "bg-primary/5 text-primary/60")}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-primary/5">
          <ShoppingBag className="w-12 h-12 text-primary/10 mb-4" />
          <p className="font-bold text-primary/30 text-lg">No leads found</p>
          <p className="text-sm text-charcoal/30 mt-1">No abandoned checkouts match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <LeadRow key={lead.id} lead={lead as Lead} isAr={isAr} />
          ))}
        </div>
      )}
    </div>
  );
}
