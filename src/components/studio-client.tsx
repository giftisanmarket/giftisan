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
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { updateOrderItemStatus, deleteProduct } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { EditProductModal } from "@/components/edit-product-modal";
import { SalesChart } from "@/components/sales-chart";

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
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "sales" | "reviews" | "growth" | "logistics">("overview");
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
      <main className="min-h-screen bg-cream">
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

        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Verification Status Banner */}
          {artisan.status === "PENDING" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-8 md:p-12 bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] flex flex-col lg:flex-row items-stretch gap-10 shadow-xl shadow-amber-500/5"
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                    <Clock className="w-8 h-8 text-white" />
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
              className="mb-8 p-8 bg-red-50 border-2 border-red-200 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-red-500/5"
            >
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                <X className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-2xl font-heading font-black text-red-900 mb-2">{dict.studio.action_required}</h3>
                <p className="text-red-700/80 leading-relaxed font-medium">
                  {dict.studio.rejected_desc}
                </p>
              </div>
              <div className="px-6 py-2 bg-white rounded-full border border-red-200 text-[10px] font-black uppercase tracking-widest text-red-600 shadow-sm">
                {dict.studio.action_required}
              </div>
            </motion.div>
          )}

          {/* Pro Studio Roadmap & Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-primary text-white rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 end-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/30 transition-all duration-1000" />
            
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-accent-light" />
            </div>
            
            <div className="flex-1 text-center md:text-start relative z-10">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-2">
                <h3 className="text-xl font-heading font-black">{dict.studio.founding_member}</h3>
                <span className="px-3 py-1 bg-accent rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-accent/20">
                  {dict.studio.exclusive_launch_group}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-2xl mb-3">
                {dict.studio.founding_desc}
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent-light hover:text-white transition-colors group/link"
              >
                {dict.common.support} 
                <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="text-end hidden lg:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{dict.studio.marketing_status}</p>
                <p className="text-xs font-bold text-accent-light flex items-center gap-2 justify-end">
                  <Megaphone className="w-3 h-3" /> {dict.studio.spotlight_ready}
                </p>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden lg:block" />
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                {dict.studio.phase_1_active}
              </div>
            </div>
          </motion.div>

          <div className="relative bg-primary text-white rounded-[3rem] p-8 md:p-16 mb-12 shadow-2xl shadow-primary/20 overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-start">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                  <BespokeImage src={artisan.avatar} alt={artisan.studioName || artisan.user.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-accent-light font-black uppercase tracking-widest text-xs mb-2">{dict.studio.master_studio}</p>
                  <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                    {artisan.studioName || `${artisan.user.name}'s Studio`}
                  </h1>
                  <p className="text-white/60 max-w-xl italic">"{artisan.bio}"</p>
                </div>
              </div>

              <div className="flex gap-4">
                {isAdminPreview ? (
                  <div className="h-14 px-8 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent-light" />
                    {dict.studio.auditor_access}
                  </div>
                ) : (
                  <Link href="/studio/settings" className="h-14 px-8 bg-white text-primary font-bold rounded-full hover:bg-cream transition-all flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    {dict.studio.studio_settings}
                  </Link>
                )}
              </div>
            </div>
            <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="flex gap-4 mb-8 overflow-x-auto pt-4 pb-4 scrollbar-hide whitespace-nowrap relative z-20">
            {(
              [
                  { id: "overview", label: dict.studio.overview, icon: BarChart3 },
                  { id: "inventory", label: dict.studio.inventory, icon: ShoppingBag },
                  { id: "sales", label: dict.studio.sales, icon: Package, badge: sales.filter((s: any) => s.status === "PENDING").length },
                  { id: "growth", label: dict.studio.growth, icon: TrendingUp },
                  { id: "logistics", label: dict.studio.logistics, icon: Truck },
                  { id: "reviews", label: dict.studio.community, icon: Star },
                ] as { id: "overview" | "inventory" | "sales" | "reviews" | "growth" | "logistics"; label: string; icon: any; badge?: number }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-8 h-12 rounded-full font-bold transition-all flex items-center gap-2 relative group shrink-0",
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
                    className="absolute inset-0 bg-primary rounded-full"
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-10"
            >
              {activeTab === "overview" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        label: dict.studio.stats_impressions, 
                        value: totalViews.toLocaleString(), 
                        icon: MousePointer2, 
                        color: "bg-purple-500",
                        tooltip: dict.studio.tooltip_impressions
                      },
                      { 
                        label: dict.studio.stats_loves, 
                        value: totalFavorites, 
                        icon: Heart, 
                        color: "bg-red-500",
                        tooltip: dict.studio.tooltip_loves
                      },
                      {
                        label: dict.studio.stats_success,
                        value: `${conversionRate}%`,
                        icon: Percent,
                        color: "bg-indigo-500",
                        tooltip: dict.studio.tooltip_success
                      },
                      { 
                        label: dict.studio.stats_revenue, 
                        value: `${dict.product.currency} ${totalRevenue.toLocaleString()}`, 
                        icon: BarChart3, 
                        color: "bg-green-500",
                        tooltip: dict.studio.tooltip_revenue
                      },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6", stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2 mb-1 group relative">
                          <p className="text-xs font-black text-primary/40 uppercase tracking-widest">{stat.label}</p>
                          {stat.tooltip && (
                            <>
                              <Info className="w-3 h-3 text-primary/20 cursor-help" />
                              <div className="absolute bottom-full start-0 mb-2 w-64 p-3 bg-primary text-[10px] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl leading-relaxed">
                                {stat.tooltip}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-heading font-bold text-primary">{stat.value}</p>
                          {stat.label === dict.studio.stats_success && (
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                              parseFloat(stat.value) === 0 ? "bg-cream text-primary/40 border-primary/5" :
                              parseFloat(stat.value) < 2 ? "bg-blue-50 text-blue-600 border-blue-100" :
                              parseFloat(stat.value) <= 5 ? "bg-green-50 text-green-600 border-green-100" :
                              parseFloat(stat.value) <= 10 ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                              "bg-accent/10 text-accent border-accent/20"
                            )}>
                              {parseFloat(stat.value) === 0 ? dict.studio.status_building :
                               parseFloat(stat.value) < 2 ? dict.studio.status_rising :
                               parseFloat(stat.value) <= 5 ? dict.studio.status_healthy :
                               parseFloat(stat.value) <= 10 ? dict.studio.status_exceptional :
                               dict.studio.status_legendary}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pro Insights */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest mb-6">
                          <Sparkles className="w-3 h-3" />
                          {dict.studio.most_desired_treasure}
                        </div>
                        {(() => {
                          const topViewed = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
                          if (!topViewed) return <p className="text-white/40 italic">{dict.studio.gallery_empty}</p>;
                          return (
                            <div className="flex items-center gap-6">
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                <BespokeImage src={topViewed.images[0]} alt="" fill className="object-cover" />
                              </div>
                              <div>
                                <h4 className="text-2xl font-heading font-bold mb-1">{topViewed.name}</h4>
                                <p className="text-white/40 text-sm font-medium">{dict.studio.visits_count.replace('{count}', (topViewed.views || 0).toString())}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="absolute top-0 end-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl shadow-primary/5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest mb-6">
                        <CheckCircle2 className="w-3 h-3" />
                        {dict.studio.best_selling_piece}
                      </div>
                      {(() => {
                        const topSold = [...products].sort((a, b) => {
                          const aSales = sales.filter(s => s.productId === a.id).length;
                          const bSales = sales.filter(s => s.productId === b.id).length;
                          return bSales - aSales;
                        })[0];
                        if (!topSold) return <p className="text-charcoal/30 italic">{dict.studio.waiting_first_sale}</p>;
                        const soldCount = sales.filter(s => s.productId === topSold.id).length;
                        return (
                          <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-primary/5 shrink-0">
                              <BespokeImage src={topSold.images[0]} alt="" fill className="object-cover" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-heading font-bold text-primary mb-1">{topSold.name}</h4>
                              <p className="text-charcoal/40 text-sm font-medium">{dict.studio.units_traveling.replace('{count}', soldCount.toString())}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                    <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
                      <div className="flex justify-between items-center mb-10">
                        <div>
                          <h2 className="text-3xl font-heading font-bold text-primary">{dict.studio.sales_performance} <span className="serif italic font-normal text-accent">{dict.studio.sales_performance_accent}</span></h2>
                          <p className="text-charcoal/40 mt-1">{dict.studio.daily_revenue_desc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-accent px-4 py-2 bg-accent/10 rounded-full">
                          <ArrowUpRight className="w-4 h-4" />
                          {dict.studio.live_data}
                        </div>
                      </div>
                      <SalesChart sales={sales} tickFormatter={(value) => `EGP ${value}`} />
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
                      <div className="flex justify-between items-center mb-10">
                        <div>
                          <h2 className="text-3xl font-heading font-bold text-primary">{dict.studio.recent_activity} <span className="serif italic font-normal text-accent">{dict.studio.recent_activity_accent || "Flow"}</span></h2>
                          <p className="text-charcoal/40 mt-1">{dict.studio.no_activity_desc || "Insights from your workshop's pulse."}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {activities.length === 0 ? (
                          <div className="text-center py-20 bg-cream/20 rounded-[2rem] border border-dashed border-primary/10">
                            <Clock className="w-10 h-10 text-primary/10 mx-auto mb-4" />
                            <p className="text-charcoal/30 italic text-sm">{dict.studio.no_activity}</p>
                          </div>
                        ) : (
                          activities.map((activity) => (
                            <div key={activity.id + activity.type} className="flex items-center gap-6 p-4 rounded-[2rem] hover:bg-cream/50 transition-all group border border-transparent hover:border-primary/5">
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                activity.type === 'SALE' ? "bg-green-500 text-white shadow-green-500/20" :
                                activity.type === 'REVIEW' ? "bg-accent text-white shadow-accent/20" :
                                activity.status === 'APPROVED' ? "bg-blue-500 text-white shadow-blue-500/20" :
                                activity.status === 'REJECTED' ? "bg-red-500 text-white shadow-red-500/20" :
                                "bg-amber-500 text-white shadow-amber-500/20"
                              )}>
                                {activity.type === 'SALE' ? <ShoppingBag className="w-5 h-5" /> :
                                 activity.type === 'REVIEW' ? <Star className="w-5 h-5" /> :
                                 activity.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> :
                                 activity.status === 'REJECTED' ? <X className="w-5 h-5" /> :
                                 <Clock className="w-5 h-5" />}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-bold text-primary text-sm md:text-base">
                                  {activity.type === 'SALE' ? dict.studio.activity_sale :
                                   activity.type === 'REVIEW' ? dict.studio.activity_review :
                                   activity.status === 'APPROVED' ? dict.studio.activity_product_approved :
                                   activity.status === 'REJECTED' ? dict.studio.activity_product_rejected :
                                   dict.studio.activity_product_pending}
                                </h4>
                                <p className="text-[10px] md:text-xs text-charcoal/60 leading-relaxed max-w-md">
                                  {activity.type === 'SALE' ? dict.studio.activity_sale_desc.replace('{customer}', activity.customer).replace('{name}', activity.name) :
                                   activity.type === 'REVIEW' ? dict.studio.activity_review_desc.replace('{name}', activity.name) :
                                   activity.status === 'APPROVED' ? dict.studio.activity_product_approved_desc.replace('{name}', activity.name) :
                                   activity.status === 'REJECTED' ? (
                                     <>
                                       {dict.studio.activity_product_rejected_desc.replace('{name}', activity.name)}
                                       {activity.reason && (
                                         <span className="block mt-1 font-bold text-red-500 italic">
                                           "{activity.reason}"
                                         </span>
                                       )}
                                     </>
                                   ) :
                                   dict.studio.activity_product_pending_desc.replace('{name}', activity.name)}
                                </p>
                              </div>
                              
                              <div className="text-end shrink-0">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] text-primary/20 whitespace-nowrap">{new Date(activity.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' })}</p>
                                <p className="text-[8px] md:text-[9px] font-bold text-accent whitespace-nowrap">{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === "inventory" && (
                /* Inventory Section */
                <div id="inventory" className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                      <h2 className="text-4xl font-heading font-bold text-primary">{dict.studio.studio_inventory} <span className="serif italic font-normal text-accent">{dict.studio.studio_inventory_accent}</span></h2>
                      <p className="text-charcoal/40 mt-1">{dict.studio.manage_inventory_desc}</p>
                    </div>
                    {!isAdminPreview ? (
                      <Link
                        href="/studio/new-product"
                        className="h-14 px-10 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all flex items-center gap-2 shadow-xl shadow-accent/20"
                      >
                        <Plus className="w-5 h-5" /> {dict.studio.add_treasure}
                      </Link>
                    ) : (
                      <div className="h-14 px-8 bg-primary text-white font-bold rounded-full flex items-center gap-2 shadow-xl">
                        <Lock className="w-4 h-4" /> {dict.studio.management_locked}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-start">
                    {products.length === 0 ? (
                      <div className="col-span-full py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag className="w-10 h-10 text-primary/20" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary">{dict.studio.empty_studio_title}</h3>
                        <p className="text-charcoal/40 max-w-xs mx-auto">{dict.studio.empty_studio_desc}</p>
                        <button className="inline-flex items-center gap-2 px-8 h-14 bg-primary text-white font-bold rounded-full">
                          {dict.studio.create_first_piece}
                        </button>
                      </div>
                    ) : (
                      products.map((p: any) => (
                        <motion.div
                          layout
                          key={p.id}
                          className="group relative bg-cream/30 rounded-[2.5rem] border border-primary/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all text-charcoal"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <BespokeImage src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedProductForEdit(p);
                                  setIsEditModalOpen(true);
                                }}
                                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl"
                              >
                                {isAdminPreview ? <Eye className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                              </button>
                              {!isAdminPreview && (
                                <button
                                  onClick={() => setProductToDelete(p.id)}
                                  disabled={isDeleting === p.id}
                                  className="w-12 h-12 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                              <Link 
                                href={`/products/${p.slug || p.id}`} 
                                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl"
                              >
                                <ArrowUpRight className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                          <div className="p-8">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-heading font-bold text-primary">{p.name}</h3>
                              <div className="flex flex-col items-end gap-1">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight whitespace-nowrap",
                                  p.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                  p.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                  "bg-amber-100 text-amber-700"
                                )}>
                                  {p.status === "APPROVED" ? dict.admin.treasure_approved :
                                   p.status === "REJECTED" ? dict.admin.treasure_rejected :
                                   p.status === "DRAFT" ? dict.admin.treasure_draft :
                                   dict.admin.treasure_pending}
                                </span>
                                {p.status === "REJECTED" && p.rejectionReason && (
                                  <div className="group/reason relative">
                                     <Info className="w-3 h-3 text-red-400 cursor-help" />
                                     <div className="absolute end-0 bottom-full mb-2 w-48 p-2 bg-red-900 text-[10px] text-white rounded-lg opacity-0 group-hover/reason:opacity-100 transition-opacity z-50 shadow-xl leading-relaxed text-center">
                                       {p.rejectionReason}
                                     </div>
                                  </div>
                                )}
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight whitespace-nowrap opacity-60",
                                  (p.stock || 0) > 0 ? "bg-primary/5 text-primary/40" : "bg-red-50 text-red-400"
                                )}>
                                  {dict.studio.in_stock.replace('{count}', (p.stock || 0).toString())}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-2xl font-heading font-bold text-accent">{dict.product.currency} {p.price}.00</p>
                              <div className="flex items-center gap-2 text-xs font-bold text-primary/40">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{dict.studio.reviews_count.replace('{count}', (p._count?.reviews || 0).toString())}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "sales" && (
                <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5 text-charcoal">
                  <div className="mb-12">
                    <h2 className="text-4xl font-heading font-bold text-primary">{dict.studio.sales_fulfillment} <span className="serif italic font-normal text-accent">{dict.studio.sales_fulfillment_accent}</span></h2>
                    <p className="text-charcoal/40 mt-1">{dict.studio.track_orders_desc}</p>
                  </div>

                  <div className="space-y-6">
                    {sales.length === 0 ? (
                      <div className="py-20 text-center space-y-6 bg-cream/10 rounded-[2rem] border border-dashed border-primary/10">
                        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto">
                          <Truck className="w-10 h-10 text-primary/20" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary">{dict.studio.no_sales_title}</h3>
                        <p className="text-charcoal/40 max-w-xs mx-auto">{dict.studio.no_sales_desc}</p>
                      </div>
                    ) : (
                      sales.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-[2rem] border border-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <BespokeImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 space-y-2 text-center md:text-start">
                            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                              <h4 className="text-xl font-heading font-bold text-primary">{item.product.name}</h4>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                item.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                                  item.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                    "bg-green-50 text-green-600 border-green-200"
                              )}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-charcoal/60">
                              Ordered by <span className="font-bold text-primary">{item.order.user.name}</span> • {new Date(item.order.createdAt).toLocaleDateString()}
                            </p>
                            {item.personalization && (
                              <div className="bg-accent/5 border border-accent/10 p-3 rounded-xl inline-block mt-2">
                                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{dict.studio.bespoke_request}:</p>
                                <p className="text-sm italic text-primary">"{item.personalization}"</p>
                              </div>
                            )}

                            <div className="mt-4">
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === item.id ? null : item.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-accent transition-colors flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3" />
                                {expandedOrder === item.id ? dict.studio.hide_shipping : dict.studio.show_shipping}
                              </button>

                              <AnimatePresence>
                                {expandedOrder === item.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 space-y-2 border-t border-primary/5 mt-4">
                                      <p className="text-lg font-bold text-primary">{dict.product.currency} {item.price * item.quantity}.00</p>
                                      <p className="text-xs font-bold text-primary">
                                        {item.order.shippingAddress || "No address provided"}
                                      </p>
                                      <p className="text-xs text-charcoal/60">
                                        {item.order.shippingCity}, {item.order.shippingZip}
                                      </p>
                                      <div className="pt-2 flex flex-wrap gap-4">
                                        <span className="text-[10px] font-bold text-accent flex items-center gap-1.5">
                                          <Phone className="w-3 h-3" />
                                          {item.order.clientPhone || "N/A"}
                                        </span>
                                        <span className="text-[10px] font-bold text-accent flex items-center gap-1.5">
                                          <Mail className="w-3 h-3" />
                                          {item.order.clientEmail || item.order.user.email}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                            <p className="text-2xl font-heading font-bold text-primary">{dict.product.currency} {item.price * item.quantity}.00</p>
                            <div className="flex gap-2">
                              {item.status === "PENDING" && (
                                <button
                                  disabled={isUpdating === item.id}
                                  onClick={() => {
                                    setShippingItem(item);
                                  }}
                                  className="px-6 h-10 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-light transition-all font-bold"
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
                                  className="px-6 h-10 bg-green-500 text-white text-xs font-bold rounded-full hover:bg-green-600 transition-all font-bold"
                                >
                                  {isUpdating === item.id ? dict.studio.updating : dict.studio.mark_delivered}
                                </button>
                              )}
                              <div className="relative">
                                <button
                                  onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                  className={cn(
                                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                                    openMenuId === item.id ? "bg-primary text-white border-primary" : "border-primary/5 text-primary/40 hover:text-primary hover:border-primary/20"
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
                                        className="absolute end-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-primary/5 p-2 z-50 overflow-hidden"
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "growth" && (
                <div className="space-y-12">
                  <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden relative">
                    <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                        <div className="max-w-2xl">
                          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">{dict.studio.growth_title} <span className="serif italic font-normal text-accent">{dict.studio.growth_title_accent}</span></h2>
                          <p className="text-charcoal/60 text-lg leading-relaxed">
                            {dict.studio.growth_desc}
                          </p>
                        </div>
                        <div className="p-8 bg-cream border border-primary/5 rounded-[2.5rem] shrink-0 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">{dict.studio.marketing_priority}</p>
                          <p className="text-3xl font-heading font-bold text-primary">Top 1%</p>
                          <p className="text-xs text-accent font-bold mt-1">{dict.studio.founding_tier}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                          <Globe className="w-8 h-8 text-accent-light mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-xl font-heading font-bold mb-2">{dict.studio.global_visibility_title}</h4>
                          <p className="text-white/60 text-sm leading-relaxed">{dict.studio.global_visibility_desc}</p>
                          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-light">
                            <CheckCircle2 className="w-3 h-3" /> {dict.studio.status_active}
                          </div>
                        </div>

                        <div className="p-8 bg-white border border-primary/5 rounded-[2.5rem] shadow-xl group">
                          <LayoutGrid className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-xl font-heading font-bold text-primary mb-2">{dict.studio.homepage_spotlight_title}</h4>
                          <p className="text-charcoal/60 text-sm leading-relaxed">{dict.studio.homepage_spotlight_desc}</p>
                          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30">
                            <Clock className="w-3 h-3 text-accent" /> {dict.studio.status_queued}
                          </div>
                        </div>

                        <div className="p-8 bg-white border border-primary/5 rounded-[2.5rem] shadow-xl group">
                          <Share2 className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform" />
                          <h4 className="text-xl font-heading font-bold text-primary mb-2">{dict.studio.social_push_title}</h4>
                          <p className="text-charcoal/60 text-sm leading-relaxed">{dict.studio.social_push_desc}</p>
                          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/30">
                            <Sparkles className="w-3 h-3 text-accent" /> {dict.studio.status_curating}
                          </div>
                        </div>
                      </div>

                      <div className="mt-16 p-10 bg-accent/5 rounded-[3rem] border border-accent/20 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shrink-0 shadow-xl shadow-accent/20">
                          <Megaphone className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-start">
                          <h3 className="text-2xl font-heading font-bold text-primary mb-2">{dict.studio.boost_title}</h3>
                          <p className="text-charcoal/60 text-sm leading-relaxed">
                            {dict.studio.boost_desc}
                          </p>
                        </div>
                        <Link href="/studio/settings" className="px-10 h-14 bg-primary text-white font-bold rounded-full flex items-center gap-2 hover:bg-primary-light transition-all whitespace-nowrap">
                          {dict.studio.optimize_profile}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="space-y-12">
                  <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-primary/5 shadow-2xl shadow-primary/5 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto py-20">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-10 border border-accent/20">
                          {dict.studio.logistics_phase_2}
                        </div>
                        <h2 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-8">{dict.studio.fulfillment_handsfree} <span className="serif italic font-normal text-accent">{dict.studio.fulfillment_handsfree_accent}</span></h2>
                        <p className="text-charcoal/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                          {dict.studio.logistics_desc.split('**').map((text: string, i: number) => 
                            i % 2 === 1 ? <strong key={i} className="text-primary font-bold">{text}</strong> : text
                          )}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-start mb-12">
                        {[
                          { label: dict.studio.direct_payments, icon: Coins, desc: dict.studio.egp_intl },
                          { label: dict.studio.smart_shipping, icon: Truck, desc: dict.studio.one_click_labels },
                          { label: dict.studio.insured_transit, icon: ShieldCheck, desc: dict.studio.peace_of_mind },
                        ].map((item, i) => (
                          <div key={i} className="p-6 bg-cream/30 rounded-2xl border border-primary/5 opacity-60">
                            <item.icon className="w-6 h-6 text-accent mb-4" />
                            <p className="text-sm font-bold text-primary mb-1">{item.label}</p>
                            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <p className="relative z-10 font-bold mb-2">{dict.studio.beta_test_title}</p>
                        <p className="relative z-10 text-white/40 text-sm mb-6">{dict.studio.beta_test_desc}</p>
                        <button 
                          onClick={handleJoinWaitlist}
                          disabled={isJoiningWaitlist || hasJoinedWaitlist}
                          className={cn(
                            "relative z-10 px-8 h-12 font-bold rounded-full transition-all flex items-center gap-2 mx-auto",
                            hasJoinedWaitlist 
                              ? "bg-green-500 text-white cursor-default" 
                              : "bg-white text-primary hover:bg-cream active:scale-95"
                          )}
                        >
                          {isJoiningWaitlist ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                              {dict.studio.securing_spot}
                            </>
                          ) : hasJoinedWaitlist ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              {dict.studio.on_waitlist}
                            </>
                          ) : (
                            dict.studio.join_waitlist
                          )}
                        </button>
                        <div className="absolute top-0 end-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.length === 0 ? (
                      <div className="col-span-full py-20 px-10 text-center bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5">
                        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                          <Star className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-primary mb-4">{dict.studio.no_reviews_title}</h3>
                        <p className="text-charcoal/40 max-w-md mx-auto leading-relaxed italic serif text-lg">
                          {dict.studio.no_reviews_desc}
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <motion.div
                          layout
                          key={review.id}
                          className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col justify-between group hover:border-accent/20 transition-all"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-cream shrink-0 border border-primary/5">
                                  <BespokeImage
                                    src={review.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.name}`}
                                    alt={review.user.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-primary">{review.user.name}</p>
                                  <p className="font-bold text-primary">EGP {review.product.price}.00</p>
                                  <p className="text-[10px] text-charcoal/30 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn("w-3 h-3", i < review.rating ? "fill-accent text-accent" : "text-primary/10")}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-charcoal/60 text-sm leading-relaxed italic italic mb-4">"{review.comment}"</p>

                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {review.images.map((img: string, i: number) => (
                                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-primary/5 shrink-0 shadow-sm">
                                    <BespokeImage src={img} alt="Review" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/products/${review.product.slug || review.product.id}`}
                            className="mt-auto pt-6 border-t border-primary/5 flex items-center gap-4 group/p"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream border border-primary/5 shadow-sm shrink-0">
                              <BespokeImage src={review.product.images[0]} alt="" fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest mb-0.5 group-hover/p:text-accent transition-colors">Reviewed Item</p>
                              <p className="font-bold text-xs text-primary group-hover/p:underline underline-offset-4 decoration-accent/30 leading-snug">{review.product.name}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
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
                <div className="p-6 md:p-16 space-y-8 md:space-y-10">
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
                <td className="py-6 font-bold text-primary">{itemToPrint.product.name}</td>
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

