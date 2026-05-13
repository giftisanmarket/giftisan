"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Check, 
  X, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  Building, 
  Send, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  FileText
} from "lucide-react";
import { approvePayoutAction, rejectPayoutAction, triggerEscrowClearanceAction } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface PayoutsManagerClientProps {
  pendingPayouts: any[];
  pastPayouts: any[];
  dict: any;
  lang: string;
}

export function PayoutsManagerClient({
  pendingPayouts,
  pastPayouts,
  dict,
  lang
}: PayoutsManagerClientProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState("");
  const [confirmPayoutData, setConfirmPayoutData] = useState<{ id: string; amount: number } | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isClearingEscrow, setIsClearingEscrow] = useState(false);

  const handleClearEscrow = async () => {
    setIsClearingEscrow(true);
    const res = await triggerEscrowClearanceAction();
    setIsClearingEscrow(false);

    if (res.success) {
      const msg = lang === "ar" 
        ? `تم تسوية ${res.clearedCount} معاملة بنجاح من حسابات الضمان إلى الرصيد المتاح للسحب.`
        : (res.message || "Escrow clearance completed successfully!");

      toast.success(msg, {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
      router.refresh();
    } else {
      toast.error(lang === "ar" ? "فشل في تسوية حسابات الضمان." : (res.error || "Failed to trigger escrow settlement."), {
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
    }
  };

  // Bulletproof Isolated Print handler (forces pure vector receipt page printing/PDF saving via sandboxed iframe)
  const handlePrint = () => {
    const printElement = document.getElementById("print-receipt-container");
    if (!printElement) return;

    // Create a temporary hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    // Inject all active stylesheets to maintain flawless vector graphics and typography
    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
      .map(el => el.outerHTML)
      .join("\n");

    const isRtlLayout = lang === "ar";

    doc.write(`
      <html>
        <head>
          <title>Giftisan Administrative Receipt</title>
          ${styles}
          <style>
            body {
              background: white !important;
              color: black !important;
              padding: 40px !important;
              font-family: system-ui, -apple-system, sans-serif;
            }
            #print-receipt-container {
              box-shadow: none !important;
              border: 1px solid rgba(0,0,0,0.1) !important;
              width: 100% !important;
              max-width: 500px !important;
              margin: 0 auto !important;
              padding: 30px !important;
              background: white !important;
              color: black !important;
              border-radius: 16px !important;
            }
            /* Clean up any standard print styling headers/footers */
            @page {
              size: auto;
              margin: 0mm;
            }
          </style>
        </head>
        <body class="bg-white" dir="${isRtlLayout ? "rtl" : "ltr"}">
          <div id="print-receipt-container">
            ${printElement.innerHTML}
          </div>
          <script>
            window.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                window.focus();
                window.print();
              }, 350);
            });
          </script>
        </body>
      </html>
    `);
    doc.close();

    // Clean up frame after print dialogue is handled
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 4000);
  };

  const handleApprove = async () => {
    if (!confirmPayoutData) return;
    const txId = confirmPayoutData.id;

    setIsProcessing(txId);
    const res = await approvePayoutAction(txId);
    setIsProcessing(null);
    setConfirmPayoutData(null); // Close the modal

    if (res.success) {
      toast.success(lang === "ar" ? "تم اعتماد طلب السحب بنجاح وتحديث السجلات المالية!" : "Payout request successfully completed and ledger updated!", {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
      router.refresh();
    } else {
      toast.error(lang === "ar" ? "فشل في اعتماد طلب السحب." : (res.error || "Failed to approve payout."), {
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
    }
  };

  const handleReject = async (txId: string) => {
    setIsProcessing(txId);
    const res = await rejectPayoutAction(txId, rejectReason);
    setIsProcessing(null);

    if (res.success) {
      toast.success(lang === "ar" ? "تم رفض طلب السحب واسترجاع المبلغ لرصيد العارض بنجاح!" : "Payout declined and funds successfully refunded to artisan!", {
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
      setActiveRejectId(null);
      setRejectReason("");
      router.refresh();
    } else {
      toast.error(lang === "ar" ? "فشل في رفض طلب السحب." : (res.error || "Failed to reject payout."), {
        style: { borderRadius: "20px", background: "#1a1a1a", color: "#fff" }
      });
    }
  };

  const isRTL = lang === "ar";

  // Calculate quick metrics
  const pendingTotalAmount = pendingPayouts.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const pastTotalAmount = pastPayouts
    .filter(tx => tx.status === "COMPLETED")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const filteredHistory = pastPayouts.filter(tx => {
    const studio = (tx.artisan?.studioName || tx.artisan?.user?.name || "").toLowerCase();
    const desc = (tx.description || "").toLowerCase();
    const query = historySearch.toLowerCase();
    return studio.includes(query) || desc.includes(query);
  });

  return (
    <div className="space-y-12 text-start" dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            {isRTL ? "طلبات سحب مستحقات العارضين" : "Artisan Payouts Manager"}
          </h1>
          <p className="text-charcoal/40 font-medium">
            {isRTL 
              ? "مراجعة واعتماد طلبات السحب يدويًا وتسجيل التحويلات المالية بنجاح." 
              : "Review, coordinate transfer receipts, and manually process outstanding payout requests."}
          </p>
        </div>
        <button
          onClick={handleClearEscrow}
          disabled={isClearingEscrow}
          className="px-6 h-12 bg-primary hover:bg-primary-light text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Clock className={cn("w-4 h-4", isClearingEscrow && "animate-spin")} />
          <span>{isClearingEscrow ? (isRTL ? "جاري التسوية..." : "Settling Escrow...") : (isRTL ? "تسوية حسابات الضمان" : "Run Escrow Settlement")}</span>
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Outstanding Volume */}
        <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700/60">
              {isRTL ? "إجمالي المبالغ المطلوبة" : "Pending Payout Volume"}
            </span>
            <p className="text-3xl font-heading font-bold text-amber-950">
              {pendingTotalAmount.toFixed(2)} <span className="text-sm font-bold">EGP</span>
            </p>
          </div>
          <p className="text-xs text-amber-800/60 font-medium mt-4 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {isRTL 
              ? `${pendingPayouts.length} طلب سحب قيد المراجعة حاليًا` 
              : `${pendingPayouts.length} active requests awaiting transfer`}
          </p>
        </div>

        {/* Paid Volume */}
        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">
              {isRTL ? "إجمالي المدفوعات التاريخية" : "Total Paid Out All-Time"}
            </span>
            <p className="text-3xl font-heading font-bold text-emerald-950">
              {pastTotalAmount.toFixed(2)} <span className="text-sm font-bold">EGP</span>
            </p>
          </div>
          <p className="text-xs text-emerald-800/60 font-medium mt-4 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            {isRTL ? "تحويلات ناجحة للعارضين" : "Successful platform payouts executed"}
          </p>
        </div>

        {/* System Fee Card */}
        <div className="bg-primary-light/5 rounded-3xl p-6 border border-primary/5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
              {isRTL ? "رسوم عمولة المنصة الثابتة" : "Platform Settings"}
            </span>
            <p className="text-3xl font-heading font-bold text-primary">
              0.00 <span className="text-sm font-bold">%</span>
            </p>
          </div>
          <p className="text-xs text-primary/60 font-medium mt-4 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-accent" />
            {isRTL 
              ? "استمتع بـ 0% عمولة طوال عام 2026" 
              : "Enjoy 0% platform commission for the 2026 period"}
          </p>
        </div>
      </div>

      {/* Pending Payout Requests List */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-primary flex items-center gap-2">
          {isRTL ? "الطلبات النشطة بانتظار التحويل" : "Active Withdrawal Requests"}
          {pendingPayouts.length > 0 && (
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full">
              {pendingPayouts.length}
            </span>
          )}
        </h2>

        {pendingPayouts.length === 0 ? (
          <div className="p-16 text-center bg-cream/20 rounded-[2rem] border border-dashed border-primary/10 text-charcoal/40 font-medium space-y-3">
            <Check className="w-12 h-12 mx-auto text-emerald-500 bg-emerald-100 rounded-full p-2" />
            <p className="text-sm">
              {isRTL 
                ? "رائع! لا توجد أي طلبات سحب معلقة حاليًا." 
                : "Excellent! All artisan withdrawal requests are paid and cleared."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {pendingPayouts.map((tx) => {
              const methodStr = tx.description?.split("via ")?.[1]?.split(".")?.[0] || "INSTAPAY";
              const addressStr = tx.description?.split("Sent to: ")?.[1]?.split(" (")?.[0] || "N/A";
              const nameStr = tx.description?.split(" (")?.[1]?.slice(0, -1) || "N/A";

              const isInsta = methodStr === "INSTAPAY";
              const isVodafone = methodStr === "VODAFONE_CASH";

              return (
                <div 
                  key={tx.id} 
                  className="bg-white rounded-3xl p-6 md:p-8 border border-primary/5 shadow-xl shadow-primary/5 hover:border-primary/10 transition-all flex flex-col justify-between gap-6 relative"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base font-bold text-primary">
                          {tx.artisan?.studioName || tx.artisan?.user?.name || "Artisan"}
                        </h3>
                        <p className="text-xs text-charcoal/40 font-semibold">
                          {tx.artisan?.user?.email}
                        </p>
                      </div>
                      <p className="text-2xl font-heading font-black text-accent shrink-0">
                        {Math.abs(tx.amount).toFixed(2)} <span className="text-xs font-bold font-sans">EGP</span>
                      </p>
                    </div>

                    {/* Coordinates details */}
                    <div className="p-4 bg-cream/35 rounded-2xl border border-primary/5 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/50 font-medium">{isRTL ? "الوسيلة:" : "Payment Channel:"}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1",
                          isInsta 
                            ? "bg-purple-100 text-purple-800" 
                            : isVodafone 
                              ? "bg-red-100 text-red-800" 
                              : "bg-blue-100 text-blue-800"
                        )}>
                          {isInsta ? <Send className="w-2.5 h-2.5" /> : isVodafone ? <Smartphone className="w-2.5 h-2.5" /> : <Building className="w-2.5 h-2.5" />}
                          {methodStr}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/50 font-medium">{isRTL ? "العنوان/الرقم:" : "Payout Address:"}</span>
                        <span className="font-mono font-bold text-primary select-all">
                          {addressStr}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/50 font-medium">{isRTL ? "الاسم بالكامل:" : "Beneficiary Full Name:"}</span>
                        <span className="font-bold text-primary">
                          {nameStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-primary/5 flex flex-col sm:flex-row gap-3">
                    {activeRejectId === tx.id ? (
                      <div className="w-full space-y-3">
                        <input
                          type="text"
                          required
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Type reason (e.g. Invalid InstaPay ID)"
                          className="w-full h-10 px-3 rounded-xl border border-primary/10 bg-white text-xs font-semibold focus:outline-none focus:border-red-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(tx.id)}
                            disabled={isProcessing === tx.id || !rejectReason.trim()}
                            className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                          >
                            Decline & Refund
                          </button>
                          <button
                            onClick={() => {
                              setActiveRejectId(null);
                              setRejectReason("");
                            }}
                            className="px-3 h-9 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setConfirmPayoutData({ id: tx.id, amount: tx.amount })}
                          disabled={isProcessing !== null}
                          className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/10 transition-colors text-xs uppercase tracking-wider cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          {isRTL ? "تم التحويل بنجاح" : "Approve & Mark Paid"}
                        </button>
                        <button
                          onClick={() => setActiveRejectId(tx.id)}
                          disabled={isProcessing !== null}
                          className="px-4 h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs uppercase tracking-wider"
                        >
                          <X className="w-4 h-4" />
                          {isRTL ? "رفض الطلب" : "Decline"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Payout History Ledger */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5 text-start space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-heading font-black text-primary">
            {isRTL ? "أرشيف عمليات السحب المنفذة" : "Completed Payouts History"}
          </h2>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <input
              type="text"
              placeholder={isRTL ? "البحث باسم الأستوديو..." : "Search studio..."}
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full h-10 ps-10 pe-4 rounded-xl border border-primary/10 bg-cream/10 text-xs font-bold focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center bg-cream/10 rounded-3xl text-charcoal/40 font-semibold">
            {isRTL ? "لم يتم العثور على أي عمليات سحب مطابقة." : "No matching historical payouts found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-primary/5">
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-start">{isRTL ? "التاريخ" : "Date"}</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-start">{isRTL ? "العارض" : "Artisan"}</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-start">{isRTL ? "تفاصيل التحويل" : "Details"}</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-start">{isRTL ? "الحالة" : "Status"}</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-end">{isRTL ? "المبلغ" : "Amount"}</th>
                  <th className="py-4 text-xs font-black uppercase tracking-wider text-primary/40 text-end">{isRTL ? "الإجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((tx: any) => {
                  const isCompleted = tx.status === "COMPLETED";
                  return (
                    <tr key={tx.id} className="border-b border-primary/5 hover:bg-cream/10 transition-colors">
                      <td className="py-5 text-xs text-charcoal/60 font-medium">
                        {new Date(tx.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                      <td className="py-5">
                        <div className="text-xs font-bold text-primary">
                          {tx.artisan?.studioName || tx.artisan?.user?.name || "Artisan"}
                        </div>
                        <div className="text-[10px] text-charcoal/40 font-semibold mt-0.5">
                          {tx.artisan?.user?.email}
                        </div>
                      </td>
                      <td className="py-5 text-xs text-primary font-bold max-w-xs md:max-w-md">
                        {tx.description}
                      </td>
                      <td className="py-5">
                        <span className={cn(
                          "px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md inline-flex items-center gap-1",
                          isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={cn(
                        "py-5 text-sm font-bold text-end",
                        isCompleted ? "text-green-600" : "text-red-500"
                      )}>
                        {Math.abs(tx.amount).toFixed(2)} EGP
                      </td>
                      <td className="py-5 text-end">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-2.5 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary hover:text-accent rounded-lg transition-all inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider cursor-pointer border border-primary/5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isRTL ? "الإيصال" : "Receipt"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmPayoutData && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop Overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmPayoutData(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2rem] border border-primary/10 max-w-md w-full p-8 md:p-10 shadow-2xl relative z-10 space-y-6 text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-2">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h3 className="text-xl font-heading font-black text-primary">
                  {isRTL ? "تأكيد عملية التحويل" : "Confirm Payout Transfer"}
                </h3>
                <p className="text-xs text-charcoal/60 font-semibold leading-relaxed">
                  {isRTL
                    ? `هل أنت متأكد من قيامك بتحويل مبلغ ${Math.abs(confirmPayoutData.amount).toFixed(2)} جنيه بنجاح وتريد تسجيل المعاملة كمكتملة؟ لا يمكن التراجع عن هذا الإجراء.`
                    : `Are you sure you have transferred ${Math.abs(confirmPayoutData.amount).toFixed(2)} EGP and want to mark this request as COMPLETED? This action will update the artisan's ledger and cannot be undone.`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing !== null}
                  onClick={handleApprove}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  {isProcessing === confirmPayoutData.id ? (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )}
                  {isRTL ? "نعم، تم التحويل" : "Yes, Confirm Paid"}
                </button>
                <button
                  type="button"
                  disabled={isProcessing !== null}
                  onClick={() => setConfirmPayoutData(null)}
                  className="flex-1 h-12 bg-charcoal/5 hover:bg-charcoal/10 disabled:opacity-50 text-charcoal font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Receipt PDF Generator Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary/10 flex flex-col z-10 max-h-[90vh]"
            >
              {/* Header Actions */}
              <div className="p-4 bg-cream/10 border-b border-primary/5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-primary/60">
                  {isRTL ? "معاينة إيصال المعاملة (لوحة الإدارة)" : "Transaction Receipt Preview (Admin Panel)"}
                </span>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 hover:bg-cream rounded-full transition-colors cursor-pointer text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Printable Receipt Area */}
              <div className="overflow-y-auto p-8 bg-cream/5 flex-1 flex justify-center">
                <div 
                  id="print-receipt-container"
                  className="w-full max-w-md bg-white border border-primary/10 shadow-lg rounded-2xl p-6 md:p-8 space-y-6 text-start relative overflow-hidden"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* Decorative Border */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent to-primary" />

                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-primary/5 pb-4">
                    <div>
                      <h2 className="text-xl font-heading font-black text-primary leading-none">Giftisan</h2>
                      <p className="text-[9px] text-accent font-bold uppercase tracking-widest mt-1">Platform Administration</p>
                    </div>
                    <div className="text-end">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-[9px] font-black uppercase tracking-wider">
                        {isRTL ? "معاملة رسمية" : "Official Payout"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-primary">
                      {isRTL ? "إيصال تحويل مستحقات العارض" : "Artisan Payout Receipt"}
                    </h3>
                    <p className="text-[10px] text-charcoal/40 font-mono">
                      Ref: #{selectedReceipt.id}
                    </p>
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-b border-primary/5 py-4 text-xs font-medium text-charcoal/80">
                    <div>
                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-wider mb-0.5">{isRTL ? "التاريخ والوقت" : "Date & Time"}</p>
                      <p className="font-bold text-primary">
                        {new Date(selectedReceipt.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-wider mb-0.5">{isRTL ? "حالة المعاملة" : "Transaction Status"}</p>
                      <p className="font-bold text-green-600">
                        {isRTL 
                          ? (selectedReceipt.status === "COMPLETED" ? "تم التحويل" : selectedReceipt.status === "CLEARED" ? "جاهز للسحب" : selectedReceipt.status === "PENDING" ? "في الانتظار" : "ملغي/مرفوض")
                          : selectedReceipt.status
                        }
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-wider mb-0.5">{isRTL ? "أستوديو العارض" : "Artisan Studio"}</p>
                      <p className="font-bold text-primary text-xs">
                        {selectedReceipt.artisan?.studioName || selectedReceipt.artisan?.user?.name || "Artisan"} ({selectedReceipt.artisan?.user?.email})
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-wider mb-0.5">{isRTL ? "الوصف والتفاصيل" : "Description & Details"}</p>
                      <p className="font-bold text-primary leading-relaxed text-xs">
                        {selectedReceipt.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing / Total block */}
                  <div className="bg-cream/20 rounded-xl p-4 flex justify-between items-center border border-primary/5">
                    <span className="text-xs font-black text-primary/60 uppercase tracking-wider">{isRTL ? "المبلغ الإجمالي" : "Total Amount"}</span>
                    <span className="text-xl font-black text-primary">
                      {Math.abs(selectedReceipt.amount).toFixed(2)} EGP
                    </span>
                  </div>

                  {/* Footer message / Verification Code */}
                  <div className="text-center pt-2 space-y-2">
                    <p className="text-[10px] text-charcoal/40 font-bold italic leading-relaxed">
                      {isRTL 
                        ? "هذا الإيصال تم توليده تلقائياً من لوحة تحكم جيفتيزان لإثبات سداد المستحقات." 
                        : "This receipt was automatically generated from the Giftisan Admin suite to verify disbursement."
                      }
                    </p>
                    {/* Fake Barcode representation for beautiful tactile aesthetics */}
                    <div className="pt-2 flex flex-col items-center gap-1 opacity-40">
                      <div className="h-6 w-32 bg-[repeating-linear-gradient(90deg,currentColor,currentColor_1px,transparent_1px,transparent_4px,currentColor_4px,currentColor_6px,transparent_6px,transparent_8px)]" />
                      <span className="text-[8px] font-mono tracking-widest">{selectedReceipt.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-cream/10 border-t border-primary/5 flex gap-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 h-12 rounded-xl text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  {isRTL ? "إغلاق" : "Close"}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 h-12 bg-primary hover:bg-primary-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isRTL ? "طباعة / حفظ PDF" : "Print / Save PDF"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
