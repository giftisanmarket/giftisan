"use client";

import { Navbar } from "@/components/navbar";
import { BespokeImage } from "./bespoke-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  BarChart3,
  Settings,
  Heart,
  ShoppingBag,
  Star,
  ArrowUpRight,
  MoreVertical,
  Edit2,
  Package,
  Clock,
  CheckCircle,
  CheckCircle2,
  Truck,
  Phone,
  Mail,
  X,
  Trash2,
  MousePointer2,
  Percent,
  Sparkles,
  Info,
  Globe,
  LayoutGrid,
  Share2,
  Lock,
  Coins,
  ShieldCheck,
  TrendingUp,
  Megaphone,
  Eye,
  MessageCircle,
  CreditCard,
  Banknote,
  Wallet,
  User,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo, useRef } from "react";
import { updateOrderItemStatus, deleteProduct, bulkDeleteProducts, bulkUpdateProductStatus } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { EditProductModal } from "@/components/edit-product-modal";
import { SalesChart } from "@/components/sales-chart";
import { OverviewTab } from "./studio/overview-tab";
import { InventoryTab } from "./studio/inventory-tab";
import { SalesTab } from "./studio/sales-tab";
import { GrowthTab } from "./studio/growth-tab";
import { LogisticsTab } from "./studio/logistics-tab";
import { ReviewsTab } from "./studio/reviews-tab";
import { SettingsTab } from "./studio/settings-tab";

interface StudioClientProps {
  artisan: any;
  sales: any[];
  reviews: any[];
  isAdminPreview?: boolean;
  dict: any;
  lang: string;
}

export function StudioClient({ artisan, sales, reviews, isAdminPreview = false, dict, lang }: StudioClientProps) {
  const router = useRouter();
  const [showMask, setShowMask] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "sales" | "reviews" | "growth" | "logistics" | "settings">("overview");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isSkipping, setIsSkipping] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemToPrint, setItemToPrint] = useState<any | null>(null);
  const [shippingItem, setShippingItem] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);

  // Variant Analytics
  const topVariants = useMemo(() => {
    return sales.reduce((acc: any[], sale: any) => {
      if (!sale.variantId) return acc;
      const existing = acc.find((v: any) => v.id === sale.variantId);
      if (existing) {
        existing.quantity += sale.quantity;
        existing.revenue += sale.quantity * sale.price;
      } else {
        acc.push({
          id: sale.variantId,
          name: sale.variant?.name || dict.edit_product.standard_variant,
          productName: sale.product.name,
          quantity: sale.quantity,
          revenue: sale.quantity * sale.price,
          image: sale.variant?.image || sale.product.images[0]
        });
      }
      return acc;
    }, []).sort((a: any, b: any) => b.quantity - a.quantity).slice(0, 5);
  }, [sales, dict.edit_product]);

  const handleDelete = async () => {
    if (!productToDelete || isAdminPreview) return;

    setIsDeleting(productToDelete);
    const res = await deleteProduct(productToDelete);

    if (res.success) {
      toast.success(dict.studio.treasure_removed, {
        icon: <Trash2 className="w-5 h-5 text-red-500" />,
      });
      setProductToDelete(null);
      setIsDeleting(null);
      router.refresh();
    } else {
      toast.error(res.error || dict.studio.delete_failed, {
        icon: <X className="w-5 h-5 text-red-500" />,
      });
      setIsDeleting(null);
      setProductToDelete(null);
    }
  };

  const handleJoinWaitlist = async () => {
    if (isAdminPreview) return;
    setIsJoiningWaitlist(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setHasJoinedWaitlist(true);
    setIsJoiningWaitlist(false);

    toast.success("You're on the list! We'll notify you when Phase 2 starts.", {
      icon: <Sparkles className="w-5 h-5 text-accent" />,
      style: {
        borderRadius: '20px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isRTL = lang === 'ar';
    
    if (isRTL) {
      // In RTL, scrollLeft is usually negative or starts at 0 and goes negative
      const isAtEnd = Math.abs(target.scrollLeft) >= target.scrollWidth - target.clientWidth - 10;
      setShowMask(!isAtEnd);
    } else {
      const isAtEnd = target.scrollLeft >= target.scrollWidth - target.clientWidth - 10;
      setShowMask(!isAtEnd);
    }
  };
  const handleBulkDelete = async (ids: string[]) => {
    if (isAdminPreview) return;
    
    const confirm = window.confirm(dict.studio.remove_desc);
    if (!confirm) return;

    const loadingToast = toast.loading("Removing treasures...", {
      style: { borderRadius: '20px', background: '#1a1a1a', color: '#fff' }
    });

    const res = await bulkDeleteProducts(ids);

    toast.dismiss(loadingToast);

    if (res.success) {
      toast.success(`${ids.length} Treasures removed`, {
        icon: <Trash2 className="w-5 h-5 text-red-500" />,
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete items");
    }
  };

  const handleBulkStatusUpdate = async (ids: string[], status: string) => {
    if (isAdminPreview) return;

    const loadingToast = toast.loading("Updating status...", {
      style: { borderRadius: '20px', background: '#1a1a1a', color: '#fff' }
    });

    const res = await bulkUpdateProductStatus(ids, status as any);

    toast.dismiss(loadingToast);

    if (res.success) {
      toast.success(`${ids.length} Treasures updated`, {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update items");
    }
  };

  const products = artisan.products || [];
  const totalFavorites = products.reduce((acc: number, p: any) => acc + (p._count?.favoritedBy || 0), 0);
  const totalReviews = products.reduce((acc: number, p: any) => acc + (p._count?.reviews || 0), 0);
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price * sale.quantity), 0);
  const totalViews = products.reduce((acc: number, p: any) => acc + (p.views || 0), 0);
  const conversionRate = totalViews > 0
    ? Math.min(100, (sales.length / totalViews) * 100).toFixed(1)
    : "0.0";

  const activities = [
    ...products.map((p: any) => ({
      id: p.id,
      type: 'PRODUCT',
      status: p.status,
      name: p.name,
      reason: p.rejectionReason,
      date: new Date(p.updatedAt),
    })),
    ...sales.map((s: any) => ({
      id: s.id,
      type: 'SALE',
      name: s.product.name,
      customer: s.order.user.name,
      amount: s.price * s.quantity,
      date: new Date(s.order.createdAt),
    })),
    ...reviews.map((r: any) => ({
      id: r.id,
      type: 'REVIEW',
      name: r.product.name,
      rating: r.rating,
      date: new Date(r.createdAt),
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <>
      <main className="min-h-screen bg-cream overflow-x-hidden">
        <Navbar dict={dict} />

        <AnimatePresence>
          {productToDelete && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setProductToDelete(null)}
                className="absolute inset-0 bg-primary/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-primary/5 text-center space-y-8"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-heading font-bold text-primary">{dict.studio.remove_treasure}</h3>
                  <p className="text-charcoal/40 text-sm leading-relaxed">
                    {dict.studio.remove_desc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setProductToDelete(null)}
                    className="flex-1 h-14 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all"
                  >
                    {dict.studio.keep_it}
                  </button>
                  <button
                    disabled={isDeleting === productToDelete}
                    onClick={handleDelete}
                    className="flex-1 h-14 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                  >
                    {isDeleting === productToDelete ? dict.studio.removing : dict.studio.delete_permanently}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="max-w-[1400px] mx-auto px-4 pt-24 md:pt-32 pb-20">
          {/* Verification Status Banner */}
          {artisan.status === "PENDING" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 md:p-12 bg-amber-50 border-2 border-amber-200 rounded-[2rem] md:rounded-[2.5rem] flex flex-col lg:flex-row items-stretch gap-8 md:gap-10 shadow-xl shadow-amber-500/5"
            >
              <div className="flex-1 space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-amber-900 mb-1">{dict.studio.under_review_title}</h3>
                    <div className="px-3 py-1 bg-white rounded-full border border-amber-200 text-[10px] font-black uppercase tracking-widest text-amber-600 shadow-sm w-fit">
                      {dict.studio.pending_verification}
                    </div>
                  </div>
                </div>

                <p className="text-amber-800/70 leading-relaxed font-bold text-lg">
                  {dict.studio.under_review_desc}
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  {dict.common.support}
                </Link>
              </div>

              {/* Checklist Section */}
              <div className="lg:w-96 bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 border border-white shadow-inner flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-900/40">
                    {dict.studio.studio_setup_checklist}
                  </h4>
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: dict.studio.checklist_story,
                      done: !!artisan.bio && artisan.bio.trim().length > 0,
                      link: "/studio/settings"
                    },
                    {
                      label: dict.studio.checklist_location,
                      done: !!artisan.location && artisan.location.trim().length > 0,
                      link: "/studio/settings"
                    },
                    {
                      label: dict.studio.checklist_products.replace('{count}', artisan.products.length.toString()),
                      done: artisan.products.length >= 3,
                      link: "#inventory"
                    },
                    {
                      label: dict.studio.checklist_email,
                      done: !!artisan.user?.emailVerified,
                      link: "/profile/settings"
                    }
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.link}
                      onClick={(e) => {
                        if (item.link.startsWith("#")) {
                          e.preventDefault();
                          setActiveTab(item.link.substring(1) as any);
                          const element = document.getElementById(item.link.substring(1));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all border",
                        item.done
                          ? "bg-green-50 border-green-100 text-green-700 opacity-60"
                          : "bg-white border-amber-100 text-amber-900 hover:border-amber-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                        item.done
                          ? "bg-green-500 border-green-600 text-white"
                          : "bg-white border-amber-300 text-transparent"
                      )}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {artisan.status === "REJECTED" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 md:p-8 bg-red-50 border-2 border-red-200 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-xl shadow-red-500/5"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                <X className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-xl md:text-2xl font-heading font-black text-red-900 mb-1 md:mb-2">{dict.studio.action_required}</h3>
                <p className="text-red-700/80 leading-relaxed font-medium text-sm md:text-base">
                  {dict.studio.rejected_desc}
                </p>
              </div>
              <div className="px-5 py-1.5 md:px-6 md:py-2 bg-white rounded-full border border-red-200 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-red-600 shadow-sm">
                {dict.studio.action_required}
              </div>
            </motion.div>
          )}

          {/* Pro Studio Roadmap & Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 md:p-8 bg-primary text-white rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 end-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/30 transition-all duration-1000" />

            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-xl">
              <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-accent-light" />
            </div>

            <div className="flex-1 text-center md:text-start relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <h3 className="text-xl md:text-2xl font-heading font-black tracking-tight">{dict.studio.founding_member}</h3>
                <span className="px-3 py-1 bg-accent rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-accent/20 border border-white/10">
                  {dict.studio.exclusive_launch_group}
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed max-w-2xl font-medium">
                {dict.studio.founding_desc}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-light hover:text-white transition-colors group/link bg-white/5 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none border border-white/10 md:border-none"
              >
                {dict.common.support}
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="text-center md:text-end hidden sm:block">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{dict.studio.marketing_status}</p>
                <p className="text-xs font-bold text-accent-light flex items-center gap-2 justify-center md:justify-end">
                  <Megaphone className="w-3 h-3" /> {dict.studio.spotlight_ready}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />
              <div className="w-full md:w-auto px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white text-center shadow-lg">
                {dict.studio.phase_1_active}
              </div>
            </div>
          </motion.div>

          <div className="relative bg-primary text-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 lg:p-16 mb-12 shadow-2xl shadow-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20 opacity-40" />
            
            {!isAdminPreview && (
              <button 
                onClick={() => {
                  setActiveTab("settings");
                  setTimeout(() => {
                    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="absolute top-6 end-6 md:top-10 md:end-10 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl group active:scale-90"
                title={dict.studio.studio_settings}
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-90 duration-500" />
              </button>
            )}

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-start w-full md:w-auto">
                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-white/10 shadow-2xl shrink-0">
                  <BespokeImage type="artisan" id={artisan.id} src={artisan.avatar} alt={artisan.studioName || artisan.user.name} fill className="object-cover" />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <p className="text-accent-light font-black uppercase tracking-[0.25em] text-[9px] md:text-xs bg-white/5 w-fit px-3 py-1 rounded-full mx-auto md:mx-0 border border-white/10">{dict.studio.master_studio}</p>
                  <h1 className="text-3xl md:text-4xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight">
                    {artisan.studioName || `${artisan.user.name}'s Studio`}
                  </h1>
                  <p className="text-white/60 text-sm md:text-lg max-w-xl italic font-medium leading-relaxed line-clamp-3 md:line-clamp-4">
                    "{artisan.bio}"
                  </p>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto justify-center pt-2 md:pt-0">
                {isAdminPreview && (
                  <div className="h-12 md:h-16 px-8 bg-white/10 backdrop-blur-xl text-white font-bold rounded-2xl md:rounded-full border border-white/20 flex items-center gap-3 text-sm md:text-base shadow-xl">
                    <ShieldCheck className="w-5 h-5 text-accent-light" />
                    {dict.studio.auditor_access}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30" />
          </div>

          <div className="relative mb-8">
            <div 
              onScroll={handleScroll}
              className={cn(
                "flex gap-2 md:gap-4 overflow-x-auto pt-4 pb-12 scrollbar-hide whitespace-nowrap relative z-20 transition-all duration-300",
                showMask ? "mask-fade-right" : ""
              )}
            >
              {(
                [
                  { id: "overview", label: dict.studio.overview, icon: BarChart3 },
                  { id: "inventory", label: dict.studio.inventory, icon: ShoppingBag },
                  { id: "sales", label: dict.studio.sales, icon: Package, badge: sales.filter((s: any) => s.status === "PENDING").length },
                  { id: "growth", label: dict.studio.growth, icon: TrendingUp },
                  { id: "logistics", label: dict.studio.logistics, icon: CreditCard },
                  { id: "reviews", label: dict.studio.community, icon: Star },
                  { id: "settings", label: dict.studio.studio_settings, icon: Settings },
                ] as { id: "overview" | "inventory" | "sales" | "reviews" | "growth" | "logistics" | "settings"; label: string; icon: any; badge?: number }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 md:px-8 h-10 md:h-12 rounded-full font-bold transition-all flex items-center gap-2 relative group shrink-0 text-xs md:text-sm",
                    activeTab === tab.id ? "text-white" : "text-primary/60 hover:text-primary bg-white/50 backdrop-blur-sm border border-primary/5"
                  )}
                >
                  {tab.id === "logistics" && (
                    <div className="absolute -top-1 -end-1 z-[30] px-1.5 py-0.5 bg-accent text-[8px] font-black text-white rounded-full border border-white shadow-sm uppercase tracking-tighter">
                      {dict.studio.soon}
                    </div>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-primary rounded-full z-0 shadow-[0_10px_30px_-5px_rgba(6,78,59,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-accent")} />
                    {tab.label}
                    {tab.badge ? (
                      <span className={cn(
                        "ms-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px]",
                        activeTab === tab.id ? "bg-white text-primary" : "bg-accent text-white shadow-lg shadow-accent/20"
                      )}>
                        {tab.badge}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="scroll-mt-32 relative z-10"
            >
              {activeTab === "overview" && (
                <OverviewTab
                  dict={dict}
                  lang={lang}
                  totalViews={totalViews}
                  totalFavorites={totalFavorites}
                  conversionRate={conversionRate}
                  totalRevenue={totalRevenue}
                  products={products}
                  sales={sales}
                  topVariants={topVariants}
                  activities={activities}
                />
              )}

              {activeTab === "inventory" && (
                <InventoryTab
                  products={products}
                  dict={dict}
                  isAdminPreview={isAdminPreview}
                  setSelectedProductForEdit={setSelectedProductForEdit}
                  setIsEditModalOpen={setIsEditModalOpen}
                  setProductToDelete={setProductToDelete}
                  isDeleting={isDeleting}
                  onBulkDelete={handleBulkDelete}
                  onBulkStatusUpdate={handleBulkStatusUpdate}
                />
              )}

              {activeTab === "sales" && (
                <SalesTab
                  sales={sales}
                  dict={dict}
                  expandedOrder={expandedOrder}
                  setExpandedOrder={setExpandedOrder}
                  isAdminPreview={isAdminPreview}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  updateOrderItemStatus={updateOrderItemStatus}
                  setShippingItem={setShippingItem}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  setSelectedItem={setSelectedItem}
                  setItemToPrint={setItemToPrint}
                  router={router}
                />
              )}

              {activeTab === "growth" && <GrowthTab dict={dict} />}

              {activeTab === "logistics" && (
                <LogisticsTab
                  dict={dict}
                  handleJoinWaitlist={handleJoinWaitlist}
                  isJoiningWaitlist={isJoiningWaitlist}
                  hasJoinedWaitlist={hasJoinedWaitlist}
                />
              )}

              {activeTab === "reviews" && <ReviewsTab reviews={reviews} dict={dict} />}
              {activeTab === "settings" && <SettingsTab artisan={artisan} dict={dict} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {selectedProductForEdit && (
          <div className="no-print">
            <EditProductModal
              product={selectedProductForEdit}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedProductForEdit(null);
              }}
              readOnly={isAdminPreview}
              dict={dict}
            />
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden no-print max-h-[90vh] flex flex-col"
            >
              <div className="overflow-y-auto custom-scrollbar">
                <div className="p-5 md:p-16 space-y-6 md:space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        {dict.studio.sale_receipt} #{selectedItem.orderId.slice(-6).toUpperCase()}
                      </div>
                      <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary">{dict.studio.order_details_title} <span className="serif italic">{dict.studio.order_details_accent}</span></h2>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors shrink-0"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-0 md:pt-4">
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.studio.item_info}</h3>
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-cream border border-primary/5 shadow-sm shrink-0">
                          <BespokeImage src={selectedItem.product.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-primary text-sm md:text-base leading-tight truncate md:whitespace-normal">{selectedItem.product.name}</p>
                          <p className="text-[10px] md:text-xs text-charcoal/40 font-medium">{dict.studio.qty_label}: {selectedItem.quantity} • {dict.product.currency} {selectedItem.price}</p>
                          {selectedItem.variant && (
                            <p className="text-[10px] md:text-xs font-bold text-accent mt-1">
                              {dict.edit_product.variant_name}: {selectedItem.variant.name}
                            </p>
                          )}
                          <p className="text-base md:text-lg font-heading font-bold mt-1 md:mt-2 text-accent">{dict.product.currency} {selectedItem.price.toFixed(2)}</p>
                        </div>
                      </div>
                      {selectedItem.status === "SHIPPED" && selectedItem.trackingNumber && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/5">
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary/40 mb-1">{dict.studio.shipment_tracking}</p>
                          <p className="text-xs font-bold text-primary flex items-center gap-2">
                            <Truck className="w-3 h-3 text-accent" />
                            {selectedItem.carrier}: {selectedItem.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40">{dict.studio.buyer_details}</h3>
                      <div>
                        <p className="font-bold text-primary text-sm md:text-base">{selectedItem.order.user.name}</p>
                        <p className="text-charcoal/60 text-xs md:text-sm font-medium mt-1 truncate">{selectedItem.order.user.email}</p>
                        {selectedItem.order.clientPhone && (
                          <p className="text-accent text-xs md:text-sm font-bold mt-2">{selectedItem.order.clientPhone}</p>
                        )}
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-primary/5">
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/20 mb-2">{dict.studio.shipping_to}</p>
                          <p className="text-xs md:text-sm text-charcoal/60 leading-relaxed font-medium">
                            {selectedItem.order.shippingAddress}<br />
                            {selectedItem.order.shippingCity}{selectedItem.order.shippingZip ? `, ${selectedItem.order.shippingZip}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedItem.order.isGift && (
                    <div className="p-4 md:p-6 bg-accent/5 rounded-2xl md:rounded-[2rem] border border-accent/10">
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent">{dict.checkout.mark_as_gift}</h3>
                      </div>
                      {selectedItem.order.giftMessage && (
                        <p className="text-xs md:text-sm italic text-charcoal/60 leading-relaxed">
                          "{selectedItem.order.giftMessage}"
                        </p>
                      )}
                    </div>
                  )}

                  {selectedItem.order.orderNotes && (
                    <div className="p-4 md:p-6 bg-accent/5 rounded-2xl md:rounded-[2rem] border border-accent/10">
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent">{dict.studio.order_notes_client}</h3>
                      </div>
                      <p className="text-xs md:text-sm italic text-charcoal/60 leading-relaxed">
                        "{selectedItem.order.orderNotes}"
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-2">
                    <Link
                      href={`/profile/messages?userId=${selectedItem.order.userId}`}
                      className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-xl shadow-primary/20 text-sm md:text-base"
                    >
                      <Mail className="w-4 h-4 md:w-5 md:h-5" />
                      {dict.studio.message_customer}
                    </Link>
                    <button
                      onClick={() => {
                        setItemToPrint(selectedItem);
                        setTimeout(() => {
                          window.print();
                          setItemToPrint(null);
                        }, 100);
                      }}
                      className="w-full md:w-fit px-8 h-14 md:h-16 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all text-sm md:text-base"
                    >
                      {dict.studio.print_summary}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shipping Modal */}
      <AnimatePresence>
        {shippingItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShippingItem(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-12 no-print"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      {dict.studio.fulfillment_status}
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-primary">{dict.studio.ship_item} <span className="serif italic">{dict.studio.ship_item_accent}</span></h2>
                  </div>
                  <button
                    onClick={() => setShippingItem(null)}
                    className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {shippingItem.order.orderNotes && (
                  <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">{dict.studio.client_notes}</p>
                    <p className="text-xs italic text-charcoal/60 leading-relaxed">"{shippingItem.order.orderNotes}"</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio.shipment_carrier}</label>
                    <input
                      type="text"
                      placeholder="e.g. Aramex, DHL, FedEx"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.studio.tracking_number}</label>
                    <input
                      type="text"
                      placeholder={dict.studio.enter_tracking_id}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={async () => {
                      setIsUpdating(shippingItem.id);
                      const res = await updateOrderItemStatus(shippingItem.id, "SHIPPED", trackingNumber, carrier);
                      if (res.success) {
                        toast.success(dict.studio.shipment_success, {
                          icon: <div className="p-1 bg-green-500 rounded-full text-white"><CheckCircle2 className="w-4 h-4" /></div>,
                          style: { borderRadius: '20px', background: '#1a4332', color: '#fff' }
                        });
                        setShippingItem(null);
                        setTrackingNumber("");
                        setCarrier("");
                        router.refresh();
                      } else {
                        toast.error(dict.studio.update_failed, {
                          icon: <X className="w-4 h-4 text-white" />,
                          style: { borderRadius: '20px', background: '#4a1d1d', color: '#fff' }
                        });
                      }
                      setIsUpdating(null);
                    }}
                    disabled={isAdminPreview || !carrier || !trackingNumber || isUpdating === shippingItem.id || isSkipping === shippingItem.id}
                    className="w-full h-14 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isAdminPreview ? dict.studio.preview_only : isUpdating === shippingItem.id ? dict.studio.saving : dict.studio.confirm_shipment}
                    {!isAdminPreview && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={async () => {
                      if (isAdminPreview) {
                        setShippingItem(null);
                        return;
                      }
                      setIsSkipping(shippingItem.id);
                      const res = await updateOrderItemStatus(shippingItem.id, "SHIPPED");
                      if (res.success) {
                        toast.success("Marked as shipped!", {
                          style: { borderRadius: '20px', background: '#1a4332', color: '#fff' }
                        });
                        setShippingItem(null);
                        router.refresh();
                      }
                      setIsSkipping(null);
                    }}
                    disabled={isUpdating === shippingItem.id || isSkipping === shippingItem.id}
                    className="w-full h-16 text-primary/40 font-bold hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {isSkipping === shippingItem.id ? "Updating..." : "Skip for now"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Printable Area */}
      {itemToPrint && (
        <div className="hidden print:flex print:flex-col print-isolated p-10 bg-white min-h-[25cm]">
          <div className="flex items-center justify-between border-b pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">GIFTISAN</h1>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">Official Packing Slip</p>
            </div>
            <div className="text-end">
              <p className="text-sm font-bold text-primary">Order #{itemToPrint.orderId.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-charcoal/40 font-medium">{new Date(itemToPrint.order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-3">Ship To</h3>
              <p className="font-bold text-primary">{itemToPrint.order.user.name}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed font-medium mt-1">
                {itemToPrint.order.shippingAddress}<br />
                {itemToPrint.order.shippingCity}, {itemToPrint.order.shippingZip}<br />
                {itemToPrint.order.clientPhone && <span className="font-bold text-primary">{itemToPrint.order.clientPhone}</span>}
              </p>
            </div>
            <div className="text-end">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-3">From</h3>
              <p className="font-bold text-primary">{artisan.studioName || artisan.user.name}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed font-medium mt-1">
                {artisan.user.email}
              </p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead>
              <tr className="border-b text-start">
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40">Item</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Qty</th>
                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40 text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-6">
                  <p className="font-bold text-primary">{itemToPrint.product.name}</p>
                  {itemToPrint.variant && (
                    <p className="text-[10px] font-bold text-accent mt-1">
                      {dict.edit_product.variant_name}: {itemToPrint.variant.name}
                    </p>
                  )}
                  {itemToPrint.personalization && (
                    <p className="text-[10px] italic text-charcoal/40 mt-1">
                      "{itemToPrint.personalization}"
                    </p>
                  )}
                </td>
                <td className="py-6 text-center font-bold text-charcoal/60">{itemToPrint.quantity}</td>
                <td className="py-6 text-end font-bold text-primary">EGP {itemToPrint.price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-auto text-center pt-8 border-t border-primary/5">
            <p className="text-xs italic font-serif text-primary/60">"Thank you for supporting handcrafted excellence."</p>
            <p className="text-[8px] uppercase font-black tracking-[0.2em] text-accent mt-4">giftisan.com</p>
          </div>
        </div>
      )}
    </>
  );
}

