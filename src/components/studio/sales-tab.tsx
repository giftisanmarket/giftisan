"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Truck,
  User,
  Calendar,
  Sparkles,
  MoreVertical,
  Mail,
  BarChart3,
  Package,
  ArrowUpRight,
  Search,
  Download,
  FileSpreadsheet,
  Check,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BespokeImage } from "@/components/bespoke-image";
import { useState, useMemo } from "react";

interface SalesTabProps {
  sales: any[];
  dict: any;
  expandedOrder: string | null;
  setExpandedOrder: (id: string | null) => void;
  isAdminPreview: boolean;
  isUpdating: string | null;
  setIsUpdating: (id: string | null) => void;
  updateOrderItemStatus: (id: string, status: string, trackingInfo?: any) => Promise<any>;
  setShippingItem: (item: any) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  setSelectedItem: (item: any) => void;
  setItemToPrint: (item: any) => void;
  router: any;
}

export function SalesTab({
  sales,
  dict,
  expandedOrder,
  setExpandedOrder,
  isAdminPreview,
  isUpdating,
  setIsUpdating,
  updateOrderItemStatus,
  setShippingItem,
  openMenuId,
  setOpenMenuId,
  setSelectedItem,
  setItemToPrint,
  router
}: SalesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
          filteredSales.map((item: any) => (
            <div 
              key={item.id} 
              onClick={() => selectedOrderIds.length > 0 && toggleSelectOrder(item.id)}
              className={cn(
                "bg-cream/20 rounded-[2rem] md:rounded-[2.5rem] border p-5 md:p-8 flex flex-col items-stretch gap-6 transition-all relative group",
                selectedOrderIds.includes(item.id) 
                  ? "border-accent bg-accent/5 ring-4 ring-accent/5 shadow-2xl" 
                  : "border-primary/5 hover:shadow-xl hover:shadow-primary/5"
              )}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Selection Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectOrder(item.id);
                  }}
                  className={cn(
                    "absolute top-4 start-4 md:top-8 md:start-8 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xl",
                    selectedOrderIds.includes(item.id) 
                      ? "bg-accent text-white" 
                      : "bg-white text-primary opacity-0 group-hover:opacity-100 border border-primary/5"
                  )}
                >
                  {selectedOrderIds.includes(item.id) ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <div className="w-4 h-4 rounded-md border-2 border-primary/20" />
                  )}
                </button>

                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 border-2 border-white shadow-lg">
                  <BespokeImage type="product" id={item.product.id} src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-4 text-center md:text-start">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                    <h4 className="text-xl md:text-2xl font-heading font-bold text-primary truncate">{item.product.name}</h4>
                    <span className={cn(
                      "inline-flex self-center md:self-auto px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      item.status === "PENDING" ? "bg-amber-500 text-white border-amber-400" :
                        item.status === "SHIPPED" ? "bg-blue-500 text-white border-blue-400" :
                          "bg-green-500 text-white border-green-400"
                    )}>
                      {item.status === "PENDING" ? dict.studio.status_pending :
                       item.status === "SHIPPED" ? dict.studio.status_shipped :
                       dict.studio.status_delivered}
                    </span>
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
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0 pt-4 md:pt-0">
                  <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.2em]">{dict.common.total_amount}</p>
                  <p className="text-2xl md:text-3xl font-heading font-bold text-primary">{dict.product.currency} {item.price * item.quantity}</p>
                  {item.order.discountApplied > 0 && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span>{item.order.coupon?.code || "PROMO"}: -{dict.product.currency} {item.order.discountApplied}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === item.id ? null : item.id)}
                  className={cn(
                    "h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95",
                    expandedOrder === item.id ? "bg-primary text-white" : "bg-white text-primary/40 hover:text-accent border border-primary/5"
                  )}
                >
                  <Truck className="w-4 h-4" />
                  {expandedOrder === item.id ? dict.studio.hide_shipping : dict.studio.show_shipping}
                </button>

                <div className="flex items-center gap-3">
                  {item.status === "PENDING" && (
                    <button
                      disabled={isUpdating === item.id}
                      onClick={() => {
                        setShippingItem(item);
                      }}
                      className="flex-1 md:flex-none h-12 px-8 bg-accent text-white text-xs font-bold rounded-2xl hover:bg-accent-light transition-all shadow-lg shadow-accent/20 active:scale-95"
                    >
                      {dict.studio.mark_shipped}
                    </button>
                  )}
                  {item.status === "SHIPPED" && (
                    <button
                      disabled={isUpdating === item.id}
                      onClick={async () => {
                        setIsUpdating(item.id);
                        await updateOrderItemStatus(item.id, "DELIVERED");
                        router.refresh();
                        setIsUpdating(null);
                      }}
                      className="flex-1 md:flex-none h-12 px-8 bg-green-500 text-white text-xs font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdating === item.id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{dict.studio.updating || "Updating..."}</span>
                        </>
                      ) : (
                        dict.studio.mark_delivered
                      )}
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className={cn(
                        "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-sm active:scale-90",
                        openMenuId === item.id ? "bg-primary text-white border-primary" : "bg-white border-primary/5 text-primary/40 hover:text-primary"
                      )}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === item.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute end-0 bottom-full mb-3 w-56 bg-white rounded-2xl shadow-2xl border border-primary/5 p-2 z-50 overflow-hidden"
                          >
                            <Link
                              href={`/profile/messages?userId=${item.order.userId}`}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                            >
                              <Mail className="w-4 h-4 text-accent" />
                              {dict.studio.contact_buyer}
                            </Link>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setSelectedItem(item);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                            >
                              <BarChart3 className="w-4 h-4 text-accent" />
                              {dict.studio.full_order_details}
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setItemToPrint(item);
                                setTimeout(() => {
                                  window.print();
                                  setItemToPrint(null);
                                }, 100);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                            >
                              <Package className="w-4 h-4 text-accent" />
                              {dict.studio.print_packing_slip}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Order Shipping Details Expansion */}
              <AnimatePresence>
                {expandedOrder === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-[2rem] border border-primary/5">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-4">{dict.checkout.shipping_address}</h5>
                          <div className="space-y-1">
                            <p className="font-bold text-primary">{item.order.user.name}</p>
                            <p className="text-sm text-charcoal/60">{item.order.shippingAddress}</p>
                            <p className="text-sm text-charcoal/60">{item.order.shippingCity}{item.order.shippingZip ? `, ${item.order.shippingZip}` : ''}</p>
                            <p className="text-sm text-charcoal/60">{item.order.shippingCountry}</p>
                            <p className="text-sm font-bold text-accent pt-2">{item.order.clientPhone || item.order.user.phone || ""}</p>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-primary/5">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-4">{dict.checkout.shipping_method}</h5>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-accent" />
                              </div>
                              <div>
                                <p className="font-bold text-primary">{item.order.shippingMethod}</p>
                                <p className="text-xs text-charcoal/40 uppercase tracking-widest">{dict.studio.standard_shipping}</p>
                              </div>
                            </div>
                            {item.trackingNumber && (
                              <div className="pt-4 border-t border-primary/5">
                                <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mb-1">{dict.studio.tracking_number}</p>
                                <div className="flex items-center justify-between">
                                  <p className="font-mono text-sm font-bold text-primary">{item.trackingNumber}</p>
                                  {item.trackingUrl && (
                                    <a href={item.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                                      {dict.studio.track_package}
                                      <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Floating Bulk Order Bar */}
      <AnimatePresence>
        {selectedOrderIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-3xl"
          >
            <div className="bg-primary/90 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] flex items-center justify-between gap-2 md:gap-4 animate-fade-in">
              <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 min-w-0">
                <button 
                  onClick={() => setSelectedOrderIds([])}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="hidden sm:block text-start">
                  <p className="text-white font-bold text-lg">{getBulkOrdersLabel(selectedOrderIds.length)}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{dict.studio.selected_for_action || "Selected for Action"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button
                  disabled={isUpdating === "BULK"}
                  onClick={() => handleBulkStatusUpdate("DELIVERED")}
                  className="h-12 px-5 md:px-8 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all flex items-center gap-2 text-xs md:text-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden md:inline whitespace-nowrap">{dict.studio.mark_delivered || "Mark Delivered"}</span>
                </button>
                <button
                  disabled={isUpdating === "BULK"}
                  onClick={() => handleBulkStatusUpdate("SHIPPED")}
                  className="h-12 px-5 md:px-8 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 text-xs md:text-sm disabled:opacity-50"
                >
                  <Truck className="w-4 h-4" />
                  <span className="hidden md:inline whitespace-nowrap">{dict.studio.mark_shipped || "Mark Shipped"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
