"use client";

import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  X, 
  ExternalLink, 
  Search, 
  Filter,
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Package,
  RotateCcw,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { resolveRefundRequestAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import Link from "next/link";

interface AdminRefundsClientProps {
  initialClaims: any[];
  dict: any;
}

export function AdminRefundsClient({ initialClaims, dict }: AdminRefundsClientProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const isAr = lang === "ar";

  const [claims, setClaims] = useState<any[]>(initialClaims);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredClaims = claims.filter(claim => {
    if (filterStatus !== "ALL" && claim.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderId = claim.orderId.toLowerCase();
      const userName = (claim.user?.name || "").toLowerCase();
      const userEmail = (claim.user?.email || "").toLowerCase();
      const id = claim.id.toLowerCase();
      return orderId.includes(q) || userName.includes(q) || userEmail.includes(q) || id.includes(q);
    }
    return true;
  });

  const handleResolve = async (action: 'APPROVE' | 'REJECT' | 'REPLACEMENT') => {
    if (!selectedClaim) return;
    setIsResolving(true);

    try {
      const res = await resolveRefundRequestAction({
        requestId: selectedClaim.id,
        action,
        adminNote,
        lang: isAr ? 'ar' : 'en'
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          action === 'APPROVE' ? (isAr ? "تمت الموافقة على الاسترجاع بنجاح" : "Refund approved successfully") :
          action === 'REPLACEMENT' ? (isAr ? "تم اعتماد إرسال القطعة البديلة" : "Replacement approved successfully") :
          (isAr ? "تم رفض الطلب بنجاح" : "Claim rejected")
        );
        
        // Update local list
        setClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status: res.claim?.status || action, adminNote } : c));
        setSelectedClaim(null);
        setAdminNote("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve claim");
    } finally {
      setIsResolving(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'DAMAGED_IN_TRANSIT':
        return isAr ? "تلف أثناء الشحن" : "Damaged in Transit";
      case 'DEFECTIVE_OR_WRONG_ITEM':
        return isAr ? "معيب أو منتج خاطئ" : "Defective or Wrong Item";
      case 'NOT_AS_DESCRIBED':
        return isAr ? "مختلف عن الوصف" : "Not as Described";
      case 'ORDER_NOT_RECEIVED':
        return isAr ? "لم يتم الاستلام" : "Order Not Received";
      default:
        return isAr ? "سبب آخر" : "Other";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-accent" />
            <span>{isAr ? "طلبات الاسترجاع والنزاعات" : "Refunds & Claims Management"}</span>
          </h1>
          <p className="text-sm text-charcoal/50 mt-1">
            {isAr 
              ? "مراجعة شكاوى المشترين، تقييم الأدلة والصور، والبت في الاسترداد أو استبدال القطع."
              : "Review buyer claims, inspect photographic evidence, and mediate refunds or replacements."}
          </p>
        </div>

        {/* Quick Count Badges */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{claims.filter(c => c.status === 'PENDING').length} {isAr ? "قيد المراجعة" : "Pending Review"}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-primary/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REPLACEMENT_ISSUED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                filterStatus === st
                  ? "bg-primary text-white shadow-sm"
                  : "bg-cream/40 text-charcoal/60 hover:bg-cream hover:text-primary"
              )}
            >
              {st === 'ALL' ? (isAr ? "الكل" : "All Claims") :
               st === 'PENDING' ? (isAr ? "قيد المراجعة" : "Pending") :
               st === 'APPROVED' ? (isAr ? "تم الاسترجاع" : "Approved") :
               st === 'REPLACEMENT_ISSUED' ? (isAr ? "البديل" : "Replacement") :
               (isAr ? "مرفوض" : "Declined")}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-charcoal/40 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث بالطلب، العميل..." : "Search by order, user..."}
            className="w-full h-10 ps-9 pe-4 bg-cream/30 border border-primary/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-accent/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <div className="p-16 bg-white rounded-[2.5rem] border border-primary/5 text-center shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-primary mb-1">
            {isAr ? "لا توجد طلبات استرجاع في هذا التصنيف" : "No refund claims found"}
          </h3>
          <p className="text-xs text-charcoal/40">
            {isAr ? "جميع الأمور مستقرة ومحسومة." : "All transactions and claims are currently clear."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const product = claim.orderItem?.product || claim.order?.items?.[0]?.product;
            const artisan = product?.artisan;

            return (
              <div 
                key={claim.id}
                className="p-6 bg-white rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {product?.images?.[0] ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-cream shrink-0 border border-primary/5">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center text-primary/30 shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        claim.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        claim.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        claim.status === 'REPLACEMENT_ISSUED' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {claim.status === 'PENDING' ? (isAr ? "قيد المراجعة" : "Pending Review") :
                         claim.status === 'APPROVED' ? (isAr ? "موافقة واسترداد" : "Refund Approved") :
                         claim.status === 'REPLACEMENT_ISSUED' ? (isAr ? "تم إرسال بديل" : "Replacement Dispatched") :
                         (isAr ? "مرفوض" : "Declined")}
                      </span>

                      <span className="text-[10px] font-bold text-accent bg-accent/5 px-2 py-0.5 rounded-md">
                        {getReasonLabel(claim.reason)}
                      </span>

                      <span className="text-[10px] text-charcoal/40 font-mono">
                        #{claim.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-primary truncate">
                      {product?.name || (isAr ? "طلب كامل" : "Full Order")}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal/60">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-primary/40" />
                        {claim.user?.name || "Client"} ({claim.user?.email || claim.order?.clientEmail})
                      </span>
                      {artisan && (
                        <span>• {isAr ? "الحرفي" : "Artisan"}: <strong>{artisan.studioName || artisan.name}</strong></span>
                      )}
                      <span>• EGP {(claim.refundAmount || claim.order?.totalAmount || 0).toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-primary/80 italic line-clamp-2 bg-cream/30 p-2.5 rounded-xl border border-primary/5 mt-2">
                      "{claim.details}"
                    </p>
                  </div>
                </div>

                {/* Evidence thumbnails & Action CTA */}
                <div className="flex flex-wrap lg:flex-col items-end gap-3 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-primary/5 pt-4 lg:pt-0">
                  {claim.images && claim.images.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {claim.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewImage(img)}
                          className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10 hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedClaim(claim);
                      setAdminNote(claim.adminNote || "");
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-brand text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {isAr ? "مراجعة واتخاذ قرار" : "Review & Decide"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Resolution Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start min-h-screen"
            onClick={() => setSelectedClaim(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-primary/5 my-auto space-y-6 shrink-0"
            >
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="absolute top-6 end-6 w-9 h-9 rounded-full bg-cream hover:bg-primary/5 flex items-center justify-center text-charcoal/60 hover:text-primary transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                  {isAr ? "إدارة النزاعات والمطالبات" : "Dispute Resolution Center"}
                </span>
                <h3 className="text-xl md:text-2xl font-heading font-black text-primary mt-1 break-all">
                  Ticket #{selectedClaim.id}
                </h3>
              </div>

              {/* Claim Overview Box */}
              <div className="p-4 bg-cream/30 rounded-2xl border border-primary/5 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-charcoal/50">{isAr ? "العميل" : "Buyer"}: </span>
                    <span className="font-bold text-primary">{selectedClaim.user?.name} ({selectedClaim.user?.email})</span>
                  </div>
                  <div>
                    <span className="text-charcoal/50">{isAr ? "رقم الطلب" : "Order Ref"}: </span>
                    <Link 
                      href={`/${lang}/admin/orders`} 
                      className="font-mono font-bold text-primary hover:text-accent underline inline-flex items-center gap-1"
                    >
                      <span>#{selectedClaim.orderId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div>
                    <span className="text-charcoal/50">{isAr ? "السبب" : "Reason"}: </span>
                    <span className="font-bold text-accent">{getReasonLabel(selectedClaim.reason)}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/50">{isAr ? "المبلغ المقترح" : "Amount"}: </span>
                    <span className="font-bold text-emerald-700">EGP {(selectedClaim.refundAmount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-charcoal/50">{isAr ? "نوع المطالبة" : "Target"}: </span>
                    <span className="font-bold text-primary">
                      {selectedClaim.orderItemId 
                        ? (selectedClaim.orderItem?.product?.name || (isAr ? "قطعة محددة" : "Specific Item"))
                        : (isAr ? "الطلب بالكامل" : "Full Order")}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal/50">{isAr ? "الحرفي" : "Artisan"}: </span>
                    <span className="font-bold text-primary">
                      {selectedClaim.orderItem?.product?.artisan?.studioName || 
                       selectedClaim.order?.items?.[0]?.product?.artisan?.studioName || 
                       (isAr ? "متعدد / الحرفيين" : "Multiple / Platform")}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-[11px] text-blue-900 leading-relaxed font-medium flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr 
                      ? "عند الموافقة على الاسترجاع: يتم تعديل حالة الطلب والمنتج إلى (مسترجع)، وخصم المبلغ تلقائياً من رصيد الحرفي المعني وإرسال بريد إشعار فوري للعميل."
                      : "Upon approval: Order & Item statuses transition to REFUNDED, artisan balance ledger is atomically debited, and resolution email is sent to the buyer."}
                  </span>
                </div>
              </div>

              {/* Customer Explanation */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-primary/60 mb-1.5">
                  {isAr ? "بيان المشكلة من العميل" : "Customer Description"}
                </p>
                <div className="p-4 bg-cream/20 rounded-2xl text-xs md:text-sm text-primary/90 leading-relaxed font-medium">
                  {selectedClaim.details}
                </div>
              </div>

              {/* Attached Evidence Photos */}
              {selectedClaim.images && selectedClaim.images.length > 0 && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-primary/60 mb-2">
                    {isAr ? "أدلة الصور المرفقة" : "Photo Evidence"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary/10 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Note / Resolution Message */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-primary/60 mb-1.5">
                  {isAr ? "ملاحظة الإدارة ورسالة القرار للعميل" : "Admin Note & Email Explanation"}
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={isAr ? "اكتب ملاحظة أو توجيهات سيتم إرسالها في البريد للعميل..." : "Explain resolution reason to be sent to the customer..."}
                  className="w-full p-3.5 bg-cream/30 border border-primary/10 rounded-xl text-xs md:text-sm font-medium text-primary focus:ring-2 focus:ring-accent/30 focus:outline-none placeholder:text-primary/30"
                />
              </div>

              {/* Resolution Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-primary/5">
                <button
                  type="button"
                  disabled={isResolving}
                  onClick={() => handleResolve('APPROVE')}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? "موافقة واسترداد المبلغ" : "Approve Full Refund"}</span>
                </button>

                <button
                  type="button"
                  disabled={isResolving}
                  onClick={() => handleResolve('REPLACEMENT')}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isAr ? "إرسال قطعة بديلة" : "Issue Replacement"}</span>
                </button>

                <button
                  type="button"
                  disabled={isResolving}
                  onClick={() => handleResolve('REJECT')}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{isAr ? "رفض الطلب" : "Decline Claim"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Image Preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[85vh]">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={previewImage} alt="Evidence Full" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
