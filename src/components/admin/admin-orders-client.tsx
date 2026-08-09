"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, User, ArrowRight, Sparkles, X, Search, Edit, RefreshCw, ChevronDown, Check, MoreVertical, Mail, BarChart3, Printer, ExternalLink, Store, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateOrderStatus } from "@/lib/actions";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import QRCode from "react-qr-code";
import { ShippingAddressDisplay } from "@/lib/location-utils";

interface AdminOrdersClientProps {
  orders: any[];
  dict: any;
  lang: string;
}

export function AdminOrdersClient({ orders: initialOrders, dict, lang }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "READY TO SHIP") {
      const totalItems = order.items?.length || 0;
      const prepared = order.items?.filter((i: any) => i.status === "PROCESSING" || i.status === "SHIPPED" || i.status === "DELIVERED").length || 0;
      if (!["PENDING", "PROCESSING"].includes(order.status) || totalItems === 0 || prepared !== totalItems) return false;
    } else if (statusFilter !== "ALL" && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchUser = order.user?.name?.toLowerCase().includes(q) || order.user?.email?.toLowerCase().includes(q);
      return matchId || matchUser;
    }
    return true;
  });

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setIsDropdownOpen(false);
    // Find tracking number and carrier if any items have them
    const itemWithTracking = order.items?.find((i: any) => i.trackingNumber);
    setTrackingNumber(itemWithTracking?.trackingNumber || "");
    setCarrier(itemWithTracking?.carrier || "");
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder) return;
    setIsUpdating(true);

    const res = await updateOrderStatus(editingOrder.id, newStatus, trackingNumber, carrier);
    setIsUpdating(false);

    if (res.success) {
      toast.success("Order status updated successfully!", {
        style: { borderRadius: '20px', background: '#1a4332', color: '#fff' }
      });
      // Update local state
      setOrders(prev => prev.map(o => {
        if (o.id === editingOrder.id) {
          return { ...o, status: newStatus, trackingNumber, carrier };
        }
        return o;
      }));
      setEditingOrder(null);
    } else {
      toast.error(res.error || "Failed to update order status", {
        style: { borderRadius: '20px', background: '#4a1d1d', color: '#fff' }
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="no-print space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter mb-2">
              {dict.admin.global_orders_title} <span className="serif italic text-accent font-normal">{dict.admin.orders_accent}</span>
            </h1>
            <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">{dict.admin.track_fulfillment_desc}</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
            <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{dict.admin.total_orders}</p>
            <p className="text-xl md:text-2xl font-black text-primary leading-none">{orders.length}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative group flex-1 max-w-md">
              <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, customer name or email..."
                className="w-full h-12 ps-12 pe-4 bg-white border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all text-sm font-bold text-primary placeholder:text-primary/20 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "READY TO SHIP", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                    statusFilter === status 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
                  )}
                >
                  {status === "READY TO SHIP" ? dict.admin.ready_to_ship : status}
                  <span className="opacity-40">
                    ({status === "ALL" ? orders.length : status === "READY TO SHIP" ? orders.filter(o => ["PENDING", "PROCESSING"].includes(o.status) && (o.items?.length || 0) > 0 && o.items?.filter((i: any) => i.status === "PROCESSING" || i.status === "SHIPPED" || i.status === "DELIVERED").length === o.items?.length).length : orders.filter(o => o.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="overflow-x-auto min-h-[280px]">
              <table className="w-full text-left min-w-[900px] lg:min-w-full">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/5">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.order_details}</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.customer}</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.items}</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.status}</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">{dict.admin.revenue}</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-charcoal/40 font-medium">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order: any, idx: number) => {
                      const openUpward = idx > 0 && idx >= filteredOrders.length - 2;
                      return (
                        <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <div>
                              <p className="font-mono text-[10px] md:text-xs font-bold text-primary uppercase">{order.id.slice(0, 8)}</p>
                              <p className="text-[8px] md:text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mt-1">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              {order.isGift && (
                                <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full w-fit">
                                  <Sparkles className="w-2.5 h-2.5 text-accent" />
                                  <span className="text-[8px] font-black uppercase text-accent tracking-widest">{dict.checkout?.mark_as_gift || "GIFT"}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs md:text-sm font-bold text-primary truncate max-w-[150px]">{order.user?.name || "Anonymous"}</p>
                                <p className="text-[9px] md:text-[10px] text-charcoal/40 font-medium truncate max-w-[150px]">{order.user?.email || order.clientEmail || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-3">
                                {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                  <div key={idx} className="relative w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0 bg-cream">
                                    {item.product?.images?.[0] && (
                                      <img src={item.product.images[0]} alt="" className="object-cover w-full h-full" />
                                    )}
                                  </div>
                                ))}
                                {(order.items?.length || 0) > 3 && (
                                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-cream border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                    <span className="text-[8px] md:text-[9px] font-black text-primary">+{order.items.length - 3}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                {(() => {
                                  const totalItems = order.items?.length || 0;
                                  const prepared = order.items?.filter((i: any) => i.status === "PROCESSING" || i.status === "SHIPPED" || i.status === "DELIVERED").length || 0;
                                  const isFullyPrepared = prepared === totalItems && totalItems > 0;
                                  return (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-bold text-primary block">
                                        {prepared}/{totalItems} Prepared
                                      </span>
                                      {isFullyPrepared && ["PENDING", "PROCESSING"].includes(order.status) ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-widest animate-pulse">
                                          Ready to Ship
                                        </span>
                                      ) : prepared > 0 && order.status === "PENDING" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-widest">
                                          Crafting ({prepared}/{totalItems})
                                        </span>
                                      ) : null}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6">
                            <span className={cn(
                              "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit whitespace-nowrap",
                              order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                              order.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-200" :
                              order.status === "PROCESSING" ? "bg-purple-50 text-purple-600 border-purple-200" :
                              order.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              "bg-green-50 text-green-700 border-green-200"
                            )}>
                              {order.status === "PENDING" && <Clock className="w-3 h-3" />}
                              {order.status === "PROCESSING" && <RefreshCw className="w-3 h-3 animate-spin" />}
                              {order.status === "CANCELLED" && <X className="w-3 h-3" />}
                              {order.status === "SHIPPED" && <Truck className="w-3 h-3" />}
                              {order.status === "DELIVERED" && <CheckCircle2 className="w-3 h-3" />}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                            <p className="text-base md:text-lg font-heading font-bold text-primary">{dict.product?.currency || "EGP"} {order.totalAmount}</p>
                            {order.discountApplied > 0 && (
                              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                -{dict.product?.currency || "EGP"} {order.discountApplied}
                              </p>
                            )}
                            {order.shippingCost > 0 && (
                              <p className="text-[10px] font-bold text-accent mt-0.5 uppercase tracking-widest">
                                {order.shippingMethod?.name || "Shipping"}: +{dict.product?.currency || "EGP"} {order.shippingCost}
                              </p>
                            )}
                          </td>
                          <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                            <div className="relative flex justify-center">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                className={cn(
                                  "w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm active:scale-90",
                                  openMenuId === order.id ? "bg-primary text-white border-primary" : "bg-white border-primary/5 text-primary/40 hover:text-primary"
                                )}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>

                              <AnimatePresence>
                                {openMenuId === order.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: openUpward ? -8 : 8 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: openUpward ? -8 : 8 }}
                                      className={cn(
                                        "absolute end-0 w-56 bg-white rounded-2xl shadow-2xl border border-primary/5 p-2 z-50 overflow-hidden text-start",
                                        openUpward ? "bottom-full mb-2" : "top-full mt-2"
                                      )}
                                    >
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          handleOpenEdit(order);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                      >
                                        <Edit className="w-4 h-4 text-accent" />
                                        {dict.admin.update_state}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          setSelectedOrderDetails(order);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                      >
                                        <BarChart3 className="w-4 h-4 text-accent" />
                                        {dict.admin.full_order_details}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          setOrderToPrint(order);
                                          setTimeout(() => {
                                            window.print();
                                            setOrderToPrint(null);
                                          }, 100);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                      >
                                        <Printer className="w-4 h-4 text-accent" />
                                        {dict.admin.print_packing_slip}
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingOrder(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 space-y-8 no-print"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Admin Control</p>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                    Update Order State
                  </h2>
                  <p className="font-mono text-xs font-bold text-accent mt-1">#{editingOrder.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ms-4">Order Status</label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl flex items-center justify-between font-bold text-primary text-sm hover:border-accent transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      {newStatus === "PENDING" && <Clock className="w-4 h-4 text-yellow-600" />}
                      {newStatus === "PROCESSING" && <RefreshCw className="w-4 h-4 text-purple-600" />}
                      {newStatus === "SHIPPED" && <Truck className="w-4 h-4 text-blue-600" />}
                      {newStatus === "DELIVERED" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {newStatus === "CANCELLED" && <X className="w-4 h-4 text-red-600" />}
                      {newStatus}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-primary/40 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-primary/5 shadow-2xl p-2 z-20 space-y-1 overflow-hidden"
                        >
                          {[
                            { value: "PENDING", icon: Clock, color: "text-yellow-600", bg: "hover:bg-yellow-50/50" },
                            { value: "PROCESSING", icon: RefreshCw, color: "text-purple-600", bg: "hover:bg-purple-50/50" },
                            { value: "SHIPPED", icon: Truck, color: "text-blue-600", bg: "hover:bg-blue-50/50" },
                            { value: "DELIVERED", icon: CheckCircle2, color: "text-green-600", bg: "hover:bg-green-50/50" },
                            { value: "CANCELLED", icon: X, color: "text-red-600", bg: "hover:bg-red-50/50" },
                          ].map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                setNewStatus(item.value);
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                item.bg,
                                newStatus === item.value ? "bg-primary/5 text-primary" : "text-primary/70"
                              )}
                            >
                              <span className="flex items-center gap-3">
                                <item.icon className={cn("w-4 h-4", item.color)} />
                                {item.value}
                              </span>
                              {newStatus === item.value && <Check className="w-4 h-4 text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {newStatus === "SHIPPED" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ms-4">Carrier</label>
                      <input
                        type="text"
                        placeholder="e.g. Bosta, Aramex, DHL"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ms-4">Tracking Number</label>
                      <input
                        type="text"
                        placeholder="Tracking ID"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 h-14 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="flex-1 h-14 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{dict.studio?.updating || "Saving..."}</span>
                    </>
                  ) : (
                    dict.admin.apply_state
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden no-print max-h-[90vh] flex flex-col"
            >
              <div className="overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      {dict.admin.order_details} #{selectedOrderDetails.id.slice(0, 8).toUpperCase()}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary">{dict.admin.full_order_details} <span className="serif italic">{dict.admin.overview_accent}</span></h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors shrink-0"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.admin.included_treasures}</h3>
                    <div className="space-y-4">
                      {selectedOrderDetails.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 bg-cream/20 rounded-2xl border border-primary/5">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-primary/5 shadow-sm shrink-0">
                            <img src={item.product?.images?.[0]} alt="" className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-bold text-primary text-sm">{item.product?.name}</p>
                                <p className="text-[10px] text-charcoal/40 font-medium">Qty: {item.quantity} • {dict.product?.currency} {item.price}</p>
                              </div>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                item.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                                item.status === "PROCESSING" ? "bg-purple-50 text-purple-600 border-purple-200" :
                                item.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                "bg-green-50 text-green-700 border-green-200"
                              )}>
                                {item.status}
                              </span>
                            </div>
                            {item.variant && (
                              <p className="text-[10px] font-bold text-accent mt-1">Variant: {item.variant.name}</p>
                            )}
                            {item.personalization && (
                              <p className="text-[10px] italic text-charcoal/60 mt-1 bg-white/50 p-2 rounded-lg border border-primary/5">
                                "{item.personalization}"
                              </p>
                            )}
                            {item.product?.artisan && (
                              <div className="mt-2 text-[10px] bg-primary/5 p-3 rounded-xl border border-primary/10 space-y-1">
                                <p className="font-bold text-primary flex items-center gap-1.5">
                                  <Store className="w-3.5 h-3.5 text-accent shrink-0" />
                                  <span>Seller Studio: {item.product.artisan.studioName}</span>
                                </p>
                                {item.product.artisan.phoneNumber && (
                                  <p className="text-accent font-bold flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 shrink-0" />
                                    <span>Phone: {item.product.artisan.phoneNumber}</span>
                                  </p>
                                )}
                                <div className="pt-1.5 border-t border-primary/10 mt-1">
                                  <p className="font-bold text-primary flex items-center gap-1.5 mb-1">
                                    <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                    <span>Exact Pickup Address (Courier):</span>
                                  </p>
                                  <ShippingAddressDisplay 
                                    address={[
                                      item.product.artisan.pickupAddress || item.product.artisan.location || "Not specified",
                                      item.product.artisan.pickupBuilding ? `Bldg/Fl: ${item.product.artisan.pickupBuilding}` : null,
                                      item.product.artisan.pickupDistrict ? `District: ${item.product.artisan.pickupDistrict}` : null
                                    ].filter(Boolean).join(", ")} 
                                    city={item.product.artisan.pickupCity || item.product.artisan.location}
                                    className="text-xs text-charcoal/70 ps-5"
                                    lang={lang}
                                  />
                                  {item.product.artisan.pickupNotes && (
                                    <p className="text-charcoal/50 ps-5 text-[9px] italic mt-1">
                                      Notes: {item.product.artisan.pickupNotes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.admin.customer_details}</h3>
                      <div className="bg-primary/5 p-6 rounded-2xl space-y-4">
                        <div>
                          <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest mb-1">{dict.admin.customer}</p>
                          <p className="font-bold text-primary text-sm">{selectedOrderDetails.user?.name || "Anonymous"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest mb-1">{dict.studio?.community || "Contact"}</p>
                          <p className="text-xs font-medium text-charcoal/60">{selectedOrderDetails.user?.email || selectedOrderDetails.clientEmail}</p>
                          <p className="text-xs font-bold text-accent mt-1">{selectedOrderDetails.clientPhone || "No Phone"}</p>
                        </div>
                        <div className="pt-4 border-t border-primary/10">
                          <p className="text-[8px] font-black text-primary/40 uppercase tracking-widest mb-2">{dict.admin.ship_to}</p>
                          <ShippingAddressDisplay 
                            address={selectedOrderDetails.shippingAddress} 
                            city={selectedOrderDetails.shippingCity}
                            country={selectedOrderDetails.shippingCountry}
                            className="text-xs text-charcoal/60"
                            lang={lang}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.admin.financials}</h3>
                      <div className="bg-cream/30 p-6 rounded-2xl space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/40 font-bold uppercase tracking-widest text-[9px]">{dict.admin.subtotal}</span>
                          <span className="font-bold text-primary">{dict.product?.currency} {selectedOrderDetails.totalAmount - (selectedOrderDetails.shippingCost || 0) + (selectedOrderDetails.discountApplied || 0)}</span>
                        </div>
                        {selectedOrderDetails.discountApplied > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600">
                            <span className="font-bold uppercase tracking-widest text-[9px]">{dict.admin.discount}</span>
                            <span className="font-bold">-{dict.product?.currency} {selectedOrderDetails.discountApplied}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-accent">
                          <span className="font-bold uppercase tracking-widest text-[9px]">{dict.admin.shipping}</span>
                          <span className="font-bold">+{dict.product?.currency} {selectedOrderDetails.shippingCost || 0}</span>
                        </div>
                        <div className="pt-3 border-t border-primary/10 flex justify-between items-end">
                          <span className="font-black text-primary uppercase tracking-[0.2em] text-[10px]">{dict.admin.total_paid}</span>
                          <span className="text-xl font-heading font-bold text-primary">{dict.product?.currency} {selectedOrderDetails.totalAmount}</span>
                        </div>
                    </div>
                  </div>
                    
                    {(selectedOrderDetails.status === "SHIPPED" || selectedOrderDetails.status === "DELIVERED") && (
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Fulfillment</h3>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2 text-blue-700">
                            <Truck className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">{selectedOrderDetails.carrier || "Standard Carrier"}</span>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Tracking Number</p>
                            <p className="font-mono text-sm font-bold text-blue-900 tracking-wider">
                              {selectedOrderDetails.trackingNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Packing Slip Area (Hidden from UI, visible in print) */}
      {orderToPrint && (
        <div className="hidden print:flex print:flex-col print-isolated p-10 bg-white min-h-[24cm] font-sans overflow-hidden">
          <div className="flex justify-between items-start mb-12 border-b-4 border-primary pb-8">
            <div>
              <h1 className="text-5xl font-heading font-black text-primary tracking-tighter mb-2">Giftisan</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                {lang === "ar" ? "صُنع بالأيدي، وُصل بالقلب" : "Crafted by Hands, Delivered with Heart"}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary mb-1 uppercase tracking-tight">{dict.admin.packing_slip}</h2>
              <p className="font-mono text-sm font-bold text-charcoal/40">#{orderToPrint.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs font-bold text-primary mt-2">{new Date(orderToPrint.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mb-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-4 border-b border-primary/5 pb-2">{dict.admin.ship_to}</h3>
              <div className="space-y-1">
                <p className="text-lg font-black text-primary">{orderToPrint.user?.name || "Customer"}</p>
                <ShippingAddressDisplay 
                  address={orderToPrint.shippingAddress} 
                  city={orderToPrint.shippingCity}
                  country={orderToPrint.shippingCountry}
                  className="text-sm font-bold text-charcoal/60"
                  lang={lang}
                />
                <p className="text-sm font-black text-accent mt-4">{orderToPrint.clientPhone || orderToPrint.user?.phone}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="p-2 bg-white border-2 border-primary rounded-2xl mb-4">
                <QRCode value={`${window.location.origin}/api/shipping/verify?orderId=${orderToPrint.id}`} size={100} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-primary/20">{dict.admin.scan_to_verify}</p>
            </div>
          </div>

          <div className="mb-12">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/10">
                  <th className="py-4 text-start text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.admin.item_description}</th>
                  <th className="py-4 text-end text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.admin.qty}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {orderToPrint.items?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-6 pe-8">
                      <p className="font-bold text-primary text-sm">{item.product?.name}</p>
                      {item.variant && <p className="text-[10px] font-bold text-accent mt-0.5">{dict.product?.details || "Option"}: {item.variant.name}</p>}
                      {item.personalization && (
                        <div className="mt-2 p-3 bg-cream/30 rounded-xl border border-primary/5">
                          <p className="text-[8px] font-black uppercase tracking-widest text-accent mb-1">{dict.profile?.personalized || "Personalization"}</p>
                          <p className="text-xs italic text-primary/70">"{item.personalization}"</p>
                        </div>
                      )}
                      {item.customImage && (
                        <div className="mt-2 p-3 bg-cream/30 rounded-xl border border-primary/5 flex items-center gap-2">
                          <img src={item.customImage} alt="Custom upload" className="w-10 h-10 object-cover rounded border border-primary/10" />
                          <span className="text-[10px] font-bold text-primary">{dict.product?.custom_image_attached || "Custom photo attached"}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-6 text-end font-bold text-primary text-lg">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orderToPrint.isGift && (
            <div className="mt-auto p-10 bg-accent/5 rounded-[3rem] border-2 border-dashed border-accent/20 relative overflow-hidden">
              <Sparkles className="absolute top-6 right-6 w-12 h-12 text-accent/10" />
              <div className="relative z-10 text-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">{dict.admin.special_gift_message}</h4>
                <p className="text-2xl font-heading font-bold text-primary italic leading-relaxed">
                  "{orderToPrint.giftMessage || "Enjoy your handcrafted treasure!"}"
                </p>
              </div>
            </div>
          )}

          {!orderToPrint.isGift && (
            <div className="mt-auto text-center py-12 border-t border-primary/5">
              <p className="font-heading font-bold text-primary text-xl mb-1">{dict.admin.thank_you_supporting}</p>
              <p className="text-accent text-[10px] font-black uppercase tracking-widest">www.giftisan.com</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
