"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Truck,
  User,
  Calendar,
  Sparkles,
  Mail,
  Search,
  Download,
  FileSpreadsheet,
  Check,
  CheckCircle2,
  X,
  Clock,
  Coins,
  Printer,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BespokeImage } from "@/components/bespoke-image";
import { useState, useMemo } from "react";

interface SalesTabProps {
  sales: any[];
  dict: any;
  isAdminPreview: boolean;
  isUpdating: string | null;
  setIsUpdating: (id: string | null) => void;
  updateOrderItemStatus: (id: string, status: string, trackingInfo?: any) => Promise<any>;
  setShippingItem: (item: any) => void;
  setSelectedItem: (item: any) => void;
  router: any;
  lang: string;
  commissionRate: number;
}

export function SalesTab({
  sales,
  dict,
  isAdminPreview,
  isUpdating,
  setIsUpdating,
  updateOrderItemStatus,
  setShippingItem,
  setSelectedItem,
  router,
  lang,
  commissionRate
}: SalesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const isArabic = dict.studio.mark_shipped === "تحديد كمشحون";

  const getBulkOrdersLabel = (count: number) => {
    if (isArabic) {
      if (count === 1) return "طلب واحد";
      if (count === 2) return "طلبان";
      if (count >= 3 && count <= 10) return `${count} طلبات`;
      return `${count} طلباً`;
    }
    return `${count} ${count === 1 ? "Order" : "Orders"}`;
  };

  const filteredSales = useMemo(() => {
    let result = sales;
    
    if (statusFilter !== "ALL") {
      result = result.filter(item => item.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.order.user.name.toLowerCase().includes(query) ||
        item.order.user.email.toLowerCase().includes(query) ||
        item.product.name.toLowerCase().includes(query) ||
        item.orderId.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [sales, statusFilter, searchQuery]);

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrderIds.length === 0) return;
    
    setIsUpdating("BULK");
    for (const id of selectedOrderIds) {
      await updateOrderItemStatus(id, status);
    }
    setIsUpdating(null);
    setSelectedOrderIds([]);
    router.refresh();
  };

  const exportToCSV = () => {
    if (sales.length === 0) return;

    // Define headers
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Product Name",
      "Variant",
      "Quantity",
      "Price",
      "Total",
      "Status",
      "Shipping Address",
      "City",
      "Country"
    ];

    // Map sales to rows
    const rows = sales.map(item => [
      item.order.id,
      new Date(item.order.createdAt).toLocaleDateString(),
      item.order.user.name,
      item.order.user.email,
      `"${item.product.name}"`,
      item.variant?.name || "Standard",
      item.quantity,
      item.price,
      item.price * item.quantity,
      item.status,
      `"${item.order.shippingAddress}"`,
      item.order.shippingCity,
      item.order.shippingCountry
    ]);

    // Join headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `artisan_sales_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async (url: string) => {
    try {
      if (url.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `client_custom_image_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanUrl = url.split("?")[0];
      const ext = cleanUrl.split(".").pop() || "jpg";
      link.download = `client_custom_image_${Date.now()}.${ext.length <= 4 ? ext : "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 200);
    } catch (error) {
      console.error("Direct download failed, falling back:", error);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `client_custom_image_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5 text-charcoal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-12">
        <div className="space-y-2 text-center md:text-start w-full md:w-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight">
            {dict.studio.sales_fulfillment} <span className="serif italic font-normal text-accent">{dict.studio.sales_fulfillment_accent}</span>
          </h2>
          <p className="text-sm md:text-base text-charcoal/40 font-medium">{dict.studio.track_orders_desc}</p>
        </div>

        {sales.length > 0 && (
          <button
            onClick={exportToCSV}
            className="w-full md:w-auto h-14 md:h-16 px-8 md:px-10 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 duration-200"
          >
            <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-accent-light" />
            <div className="text-start">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">{dict.studio.export_sales}</p>
              <p className="text-sm leading-none">{dict.studio.download_csv}</p>
            </div>
            <Download className="w-4 h-4 opacity-40 ms-2" />
          </button>
        )}
      </div>

      <div className="space-y-6 md:space-y-8">
        {sales.length > 0 && (
          <div className="space-y-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.studio.search_orders}
                className="w-full h-14 ps-12 pe-12 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all text-sm font-bold text-primary placeholder:text-primary/20 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 end-0 pe-5 flex items-center text-primary/20 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "PENDING", "SHIPPED", "DELIVERED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                    statusFilter === status 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
                  )}
                >
                  {status === "ALL" ? dict.studio.all_orders : 
                   status === "PENDING" ? dict.studio.status_pending :
                   status === "SHIPPED" ? dict.studio.status_shipped :
                   dict.studio.status_delivered}
                  <span className="ms-2 opacity-40">
                    ({status === "ALL" ? sales.length : sales.filter(s => s.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredSales.length === 0 ? (
          <div className="py-20 md:py-32 text-center space-y-6 md:space-y-8 bg-cream/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-primary/5">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5">
              <Search className="w-10 h-10 md:w-16 md:h-16 text-primary/10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-4xl font-heading font-bold text-primary">
                {searchQuery ? dict.studio.no_search_results : dict.studio.no_sales_title}
              </h3>
              <p className="text-charcoal/40 max-w-xs md:max-w-md mx-auto text-sm md:text-base">
                {searchQuery ? dict.studio.no_search_results_desc : dict.studio.no_sales_desc}
              </p>
            </div>
          </div>
        ) : (
          filteredSales.map((item: any) => {
            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all overflow-hidden cursor-pointer active:scale-[0.98]"
              >
                <div className="p-5 md:p-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 border-2 border-white shadow-lg">
                      <BespokeImage type="product" id={item.product.id} src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-4 text-center md:text-start">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 justify-center md:justify-start">
                        <h4 className="text-xl md:text-2xl font-heading font-bold text-primary line-clamp-2" dir="auto">{item.product.name}</h4>
                        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                          <span className={cn(
                            "inline-flex px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                            item.status === "PENDING" ? "bg-amber-500 text-white border-amber-400" :
                            item.status === "PROCESSING" ? "bg-purple-500 text-white border-purple-400" :
                            item.status === "SHIPPED" ? "bg-blue-500 text-white border-blue-400" :
                            "bg-green-500 text-white border-green-400"
                          )}>
                            {item.status === "PENDING" ? dict.studio.status_pending :
                             item.status === "PROCESSING" ? (lang === "ar" ? "جاهز للشحن" : "Ready to Ship") :
                             item.status === "SHIPPED" ? dict.studio.status_shipped :
                             dict.studio.status_delivered}
                          </span>

                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-charcoal/60">
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 opacity-40" />
                          <span className="font-bold text-primary">{item.order.user.name}</span>
                        </p>
                        <p className="hidden md:block opacity-20">•</p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 opacity-40" />
                          {new Date(item.order.createdAt).toLocaleDateString()}
                        </p>
                        {item.order.isGift && (
                          <div className="bg-accent/10 border border-accent/20 px-3 py-1 rounded-full flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent">{dict.checkout.mark_as_gift}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {item.variant && (
                          <div className="bg-white/80 backdrop-blur-sm border border-primary/5 p-3 rounded-2xl flex flex-col items-center md:items-start shadow-sm">
                            <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] mb-1">{dict.edit_product.variant_name}</p>
                            <p className="text-xs font-bold text-accent">{item.variant.name}</p>
                          </div>
                        )}

                        {item.personalization && (
                          <div className="bg-accent/5 border border-accent/10 p-3 rounded-2xl flex flex-col items-center md:items-start shadow-sm max-w-full">
                            <p className="text-[9px] font-black text-accent/50 uppercase tracking-[0.2em] mb-1">{dict.studio.bespoke_request}</p>
                            <p className="text-xs italic text-primary leading-relaxed">"{item.personalization}"</p>
                          </div>
                        )}

                        {item.customImage && (
                          <div className="bg-accent/5 border border-accent/10 p-3 rounded-2xl flex items-center gap-3 shadow-sm max-w-full">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingImage(item.customImage);
                              }}
                              className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary/10 bg-white shrink-0 group/img hover:opacity-90 shadow-sm cursor-pointer"
                            >
                              <img src={item.customImage} alt="Client upload" className="w-full h-full object-cover" />
                            </button>
                            <div className="text-start">
                              <p className="text-[9px] font-black text-accent/60 uppercase tracking-[0.2em] mb-0.5">
                                {dict.product.custom_image_attached || "Client Uploaded Image"}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingImage(item.customImage);
                                }}
                                className="text-[10px] font-bold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                              >
                                {dict.common.view_image || "View Image"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 shrink-0 pt-4 md:pt-0">
                      <div className="text-center md:text-end">
                        <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.2em] mb-1">{dict.common.total_amount}</p>
                        <p className="text-2xl md:text-3xl font-heading font-bold text-primary">{dict.product.currency} {item.price * item.quantity}</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/5 max-w-full">
                        <Coins className="w-4 h-4 text-accent shrink-0" />
                        <p className="text-[10px] md:text-xs font-black text-primary/60 uppercase tracking-widest whitespace-nowrap truncate">
                          {lang === "ar" ? "أرباحك:" : "Your Net:"} <span className="text-accent font-bold ms-1">{dict.product.currency} {(item.price * item.quantity * (1 - commissionRate)).toFixed(2)}</span>
                        </p>
                      </div>

                      {item.order.discountApplied > 0 && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span>{item.order.coupon?.code || "PROMO"}: -{dict.product.currency} {item.order.discountApplied}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setTimeout(() => window.print(), 100);
                        }}
                        className="flex shrink-0 h-10 md:h-12 px-3 md:px-4 bg-white border border-primary/10 text-primary/40 hover:text-accent hover:border-accent/20 rounded-2xl items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-90"
                        title={dict.studio.print_slip}
                      >
                        <Printer className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{dict.studio.print_slip}</span>
                      </button>

                      <Link
                        href={`/profile/messages?userId=${item.order.userId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex shrink-0 h-10 md:h-12 px-3 md:px-4 bg-white border border-primary/10 text-primary/40 hover:text-primary hover:border-primary/20 rounded-2xl items-center justify-center gap-1.5 md:gap-2 transition-all active:scale-90"
                        title={dict.studio.contact_buyer}
                      >
                        <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{dict.studio.contact_buyer}</span>
                      </Link>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="flex shrink-0 h-10 md:h-12 px-4 md:px-6 bg-primary/5 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary/10 transition-all active:scale-95 items-center justify-center gap-2"
                      >
                        {dict.studio.full_details}
                      </button>

                      {item.status === "PENDING" && (
                        <button
                          disabled={isUpdating === item.id}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setIsUpdating(item.id);
                            await updateOrderItemStatus(item.id, "PROCESSING");
                            router.refresh();
                            setIsUpdating(null);
                          }}
                          className="flex shrink-0 h-10 md:h-12 px-4 md:px-6 bg-accent text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-accent-light transition-all shadow-lg shadow-accent/20 active:scale-95 disabled:opacity-50 items-center justify-center gap-2"
                          title={lang === "ar" ? "تحديد كجاهز للشحن" : "Mark as Ready to Ship"}
                        >
                          {isUpdating === item.id ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                          ) : (
                            <Truck className="w-4 h-4 shrink-0" />
                          )}
                          <span>
                            {lang === "ar" ? "جاهز" : "Ready"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {viewingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingImage(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full flex flex-col items-center gap-4 pointer-events-none"
            >
              {/* Image Preview */}
              <div 
                className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl cursor-default pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={viewingImage}
                  alt="Client design preview"
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Action Buttons */}
              <div 
                className="flex items-center gap-3 mt-2 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleDownloadImage(viewingImage)}
                  className="px-6 py-3 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent-light transition-all flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {dict.product?.download_high_res || dict.common?.download || (isArabic ? "تنزيل الصورة" : "Download Image")}
                </button>
                <button
                  type="button"
                  onClick={() => setViewingImage(null)}
                  className="px-6 py-3 bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
                >
                  {dict.product?.close || dict.common?.close || (isArabic ? "إغلاق" : "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
