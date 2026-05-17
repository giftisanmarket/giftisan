import { getAdminStats, getAllOrders } from "@/lib/actions";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Truck, 
  Tag, 
  Store, 
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { getDictionary } from "../dictionaries";
import { Metadata } from "next";
import { AdminChartClient } from "@/components/admin/admin-chart-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.overview || "Admin Overview"} | ${dict.admin?.marketplace || "Platform"}`,
  };
}

export default async function AdminOverviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const stats = await getAdminStats();
  const recentOrders = await getAllOrders();

  const isAr = lang === "ar";

  const cards = [
    { 
      label: dict.admin.total_revenue, 
      value: `${dict.product.currency} ${(stats.revenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "bg-emerald-500 shadow-emerald-500/10", 
      trend: "+12%",
      trendColor: "bg-emerald-50 text-emerald-600"
    },
    { 
      label: dict.admin.ready_to_ship, 
      value: (stats.readyToShipCount || 0).toString(), 
      icon: Truck, 
      color: "bg-purple-600 shadow-purple-600/10", 
      trend: isAr ? "عاجل" : "Urgent",
      trendColor: "bg-purple-50 text-purple-600 animate-pulse"
    },
    { 
      label: dict.admin.platform_earnings, 
      value: `${dict.product.currency} ${(stats.platformEarnings || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: "bg-accent shadow-accent/10", 
      trend: "Net",
      trendColor: "bg-accent/10 text-accent"
    },
    { 
      label: dict.admin.pending_payouts, 
      value: `${dict.product.currency} ${(stats.pendingPayouts || 0).toLocaleString()}`, 
      icon: Package, 
      color: "bg-amber-500 shadow-amber-500/10", 
      trend: isAr ? "إجراء" : "Action",
      trendColor: "bg-amber-50 text-amber-600"
    },
  ];

  const secondaryStats = [
    { 
      label: dict.admin.shipping_collected, 
      value: `${dict.product.currency} ${(stats.shippingRevenue || 0).toLocaleString()}`, 
      color: "text-blue-600",
      indicator: "bg-blue-500"
    },
    { 
      label: dict.admin.artisan_escrow, 
      value: `${dict.product.currency} ${(stats.artisanPending || 0).toLocaleString()}`, 
      color: "text-amber-600",
      indicator: "bg-amber-500"
    },
    { 
      label: dict.admin.artisan_withdrawable, 
      value: `${dict.product.currency} ${(stats.artisanWithdrawable || 0).toLocaleString()}`, 
      color: "text-emerald-600",
      indicator: "bg-emerald-500"
    },
  ];

  const quickActions = [
    { 
      label: dict.admin.coupons || (isAr ? "كوبونات الخصم" : "Coupons"), 
      desc: isAr ? "إنشاء وإدارة رموز الخصم" : "Create & manage discount codes",
      href: "/admin/coupons", 
      icon: Tag, 
      color: "text-rose-500 bg-rose-50 hover:bg-rose-100" 
    },
    { 
      label: dict.admin.artisans_title || (isAr ? "تفعيل الحرفيين" : "Verify Artisans"), 
      desc: isAr ? "إدارة الصلاحيات وحسابات الأستوديو" : "Permissions & studio verification",
      href: "/admin/users", 
      icon: Store, 
      color: "text-indigo-500 bg-indigo-50 hover:bg-indigo-100" 
    },
    { 
      label: dict.admin.shipping_management || (isAr ? "إدارة الشحن" : "Shipping Zones"), 
      desc: isAr ? "إعداد مناطق وأسعار الشحن" : "Set shipping methods and costs",
      href: "/admin/shipping", 
      icon: Truck, 
      color: "text-blue-500 bg-blue-50 hover:bg-blue-100" 
    },
    { 
      label: dict.admin.outreach || (isAr ? "مرسل البريد" : "Mail Sender"), 
      desc: isAr ? "إرسال رسائل بريد إلكتروني مخصصة" : "Compose and send custom emails",
      href: "/admin/mail-sender", 
      icon: Send, 
      color: "text-teal-500 bg-teal-50 hover:bg-teal-100" 
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-primary/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-2 leading-none">
            {dict.admin.platform_title} <span className="serif italic text-accent font-normal">{dict.admin.overview_accent}</span>
          </h1>
          <p className="text-charcoal/40 font-medium text-sm md:text-base">{dict.admin.platform_overview_desc}</p>
        </div>
        
        {/* Secondary Financial Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto shrink-0">
          {secondaryStats.map((s, i) => (
            <div 
              key={i} 
              className="bg-white/60 backdrop-blur-md px-5 py-4 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md hover:border-primary/10 transition-all flex flex-col justify-between group min-w-[160px]"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-2 flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.indicator)} />
                {s.label}
              </p>
              <p className={cn("text-base md:text-lg font-bold font-heading leading-tight", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="bg-white p-6 md:p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300", card.color)}>
                <card.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5">{card.label}</p>
            </div>
            
            <div className="flex justify-between items-end mt-4">
              <p className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight leading-none">{card.value}</p>
              <div className={cn(
                "flex items-center gap-1 text-[8px] md:text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 border border-primary/5",
                card.trendColor
              )}>
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Left Column: Visual Analytics & Recent Orders (col-span 2) */}
        <div className="xl:col-span-2 space-y-8 md:space-y-10">
          {/* Interactive Recharts Analytics Chart */}
          <AdminChartClient orders={recentOrders} dict={dict} lang={lang} />

          {/* Recent Global Orders Table */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                {dict.admin.recent_global_orders}
              </h2>
              <Link 
                href="/admin/orders" 
                className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent-dark hover:underline flex items-center gap-1 transition-colors"
              >
                {dict.admin.view_all_action}
              </Link>
            </div>

            <div className="bg-white rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px] lg:min-w-full">
                  <thead>
                    <tr className="bg-primary/5 border-b border-primary/5">
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.order_id}</th>
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.client}</th>
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.amount}</th>
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {recentOrders.slice(0, 5).map((order: any) => (
                      <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                        <td className="px-6 md:px-8 py-4 md:py-5 font-mono text-[10px] md:text-xs font-bold text-primary">{order.id.slice(0, 8)}</td>
                        <td className="px-6 md:px-8 py-4 md:py-5 font-bold text-primary text-xs md:text-sm">{order.user.name}</td>
                        <td className="px-6 md:px-8 py-4 md:py-5 font-bold text-accent text-xs md:text-sm">
                          <div className="flex flex-col">
                            <span>{dict.product.currency} {order.totalAmount}</span>
                            {order.discountApplied > 0 && (
                              <span className="text-[9px] font-bold text-emerald-600 mt-0.5 leading-none">
                                -{dict.product.currency} {order.discountApplied}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-5 text-xs font-black">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border shrink-0",
                            order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                            order.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                            "bg-green-50 text-green-700 border-green-200"
                          )}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Health (col-span 1) */}
        <div className="space-y-8 md:space-y-10">
          {/* Quick Operations panel */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-primary px-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              {isAr ? "عمليات سريعة" : "Quick Operations"}
            </h2>

            <div className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 space-y-4">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center justify-between p-4 rounded-2xl border border-primary/5 hover:border-primary/10 hover:bg-cream/20 transition-all duration-300 group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", action.color)}>
                      <action.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-primary text-xs md:text-sm truncate">{action.label}</p>
                      <p className="text-[10px] text-charcoal/40 font-medium truncate mt-0.5">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className={cn(
                    "w-4 h-4 text-primary/20 transition-all duration-300 group-hover:text-accent",
                    isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
                  )} />
                </Link>
              ))}
            </div>
          </div>

          {/* System Health status panel */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-primary px-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {dict.admin.system_health}
            </h2>

            <div className="bg-primary text-white p-8 rounded-[2rem] shadow-2xl shadow-primary/20 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-white/10" />
              
              <div className="space-y-2 relative z-10">
                <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{dict.admin.auth_service}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-sm md:text-base shrink-0">NextAuth Edge</span>
                  <span className="text-[8px] md:text-[9px] font-black text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {dict.admin.operational}
                  </span>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{dict.admin.database}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-sm md:text-base shrink-0">Prisma / SQL</span>
                  <span className="text-[8px] md:text-[9px] font-black text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {dict.admin.operational}
                  </span>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{dict.admin.storage}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-sm md:text-base shrink-0">Global CDN</span>
                  <span className="text-[8px] md:text-[9px] font-black text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {dict.admin.operational}
                  </span>
                </div>
              </div>

              <button className="w-full h-12 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-xs md:text-sm border border-white/5 active:scale-95 relative z-10 mt-2">
                {dict.admin.infrastructure_test} <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
