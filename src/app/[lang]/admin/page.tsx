import { getAdminStats, getAllOrders } from "@/lib/actions";
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight, Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { getDictionary } from "../dictionaries";
import { Metadata } from "next";

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

  const cards = [
    { label: dict.admin.total_revenue, value: `${dict.product.currency} ${(stats.revenue || 0).toLocaleString()}`, icon: DollarSign, color: "bg-green-500", trend: "+12%" },
    { label: dict.admin.ready_to_ship, value: (stats.readyToShipCount || 0).toString(), icon: Truck, color: "bg-purple-600", trend: "Urgent" },
    { label: dict.admin.platform_earnings, value: `${dict.product.currency} ${(stats.platformEarnings || 0).toLocaleString()}`, icon: TrendingUp, color: "bg-accent", trend: "Net" },
    { label: dict.admin.pending_payouts, value: `${dict.product.currency} ${(stats.pendingPayouts || 0).toLocaleString()}`, icon: Package, color: "bg-amber-500", trend: "Action" },
  ];

  const secondaryStats = [
    { label: dict.admin.shipping_collected, value: `${dict.product.currency} ${(stats.shippingRevenue || 0).toLocaleString()}`, color: "text-blue-600" },
    { label: dict.admin.artisan_escrow, value: `${dict.product.currency} ${(stats.artisanPending || 0).toLocaleString()}`, color: "text-amber-600" },
    { label: dict.admin.artisan_withdrawable, value: `${dict.product.currency} ${(stats.artisanWithdrawable || 0).toLocaleString()}`, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            {dict.admin.platform_title} <span className="serif italic text-accent font-normal">{dict.admin.overview_accent}</span>
          </h1>
          <p className="text-charcoal/40 font-medium">{dict.admin.platform_overview_desc}</p>
        </div>
        
        {/* Secondary Financial Indicators */}
        <div className="flex gap-4 md:gap-8">
          {secondaryStats.map((s, i) => (
            <div key={i} className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-1">{s.label}</p>
              <p className={cn("text-sm md:text-lg font-bold font-heading", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6", card.color)}>
              <card.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-xl md:text-3xl font-heading font-bold text-primary">{card.value}</p>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[8px] md:text-[10px] font-black px-2 py-1 rounded-full shrink-0",
                card.trend === "Action" ? "bg-amber-50 text-amber-600" : 
                card.trend === "Net" ? "bg-accent/10 text-accent" :
                "bg-green-50 text-green-500"
              )}>
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid xl:grid-cols-3 gap-6 md:gap-12">
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-lg md:text-2xl font-heading font-bold text-primary">{dict.admin.recent_global_orders}</h2>
            <Link href="/admin/orders" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent hover:underline">{dict.admin.view_all_action}</Link>
          </div>
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px] lg:min-w-full">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/5">
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.order_id}</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.client}</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.amount}</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-5 md:px-8 py-4 md:py-5 font-mono text-[10px] md:text-xs font-bold text-primary">{order.id.slice(0, 8)}</td>
                      <td className="px-5 md:px-8 py-4 md:py-5 font-bold text-primary text-xs md:text-sm">{order.user.name}</td>
                      <td className="px-5 md:px-8 py-4 md:py-5 font-bold text-accent text-xs md:text-sm">
                        <div className="flex flex-col">
                          <span>{dict.product.currency} {order.totalAmount}</span>
                          {order.discountApplied > 0 && (
                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5 leading-none">
                              -{dict.product.currency} {order.discountApplied}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 md:px-8 py-4 md:py-5 text-xs font-black">
                        <span className={cn(
                          "px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
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

        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">{dict.admin.system_health}</h2>
          <div className="bg-primary text-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-primary/20 space-y-6 md:space-y-8">
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{dict.admin.auth_service}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">NextAuth Edge</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">{dict.admin.operational}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{dict.admin.database}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">Prisma / SQL</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">{dict.admin.operational}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">{dict.admin.storage}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">Global CDN</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">{dict.admin.operational}</span>
              </div>
            </div>
            <button className="w-full h-11 md:h-12 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-xs md:text-base border border-white/5 active:scale-95">
              {dict.admin.infrastructure_test} <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
