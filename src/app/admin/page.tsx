import { getAdminStats, getAllOrders } from "@/lib/actions";
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const recentOrders = await getAllOrders();

  const cards = [
    { label: "Total Revenue", value: `EGP ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500", trend: "+12%" },
    { label: "Global Users", value: stats.userCount.toString(), icon: Users, color: "bg-blue-500", trend: "+5%" },
    { label: "Active Products", value: stats.productCount.toString(), icon: ShoppingBag, color: "bg-accent", trend: "+8%" },
    { label: "Orders Fulfilled", value: stats.orderCount.toString(), icon: Package, color: "bg-purple-500", trend: "+15%" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
          Platform <span className="serif italic text-accent font-normal">Overview</span>
        </h1>
        <p className="text-charcoal/40 font-medium">Site-wide metrics and real-time operations.</p>
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
              <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full shrink-0">
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
            <h2 className="text-lg md:text-2xl font-heading font-bold text-primary">Recent Global Orders</h2>
            <Link href="/admin/orders" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All →</Link>
          </div>
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar scrollbar-hide">
              <table className="w-full text-left min-w-[500px] lg:min-w-full">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/5">
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Order ID</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Client</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Amount</th>
                    <th className="px-5 md:px-8 py-4 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-5 md:px-8 py-4 md:py-5 font-mono text-[10px] md:text-xs font-bold text-primary">{order.id.slice(0, 8)}</td>
                      <td className="px-5 md:px-8 py-4 md:py-5 font-bold text-primary text-xs md:text-sm">{order.user.name}</td>
                      <td className="px-5 md:px-8 py-4 md:py-5 font-bold text-accent text-xs md:text-sm">EGP {order.totalAmount}</td>
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
          <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">System Health</h2>
          <div className="bg-primary text-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-primary/20 space-y-6 md:space-y-8">
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Auth Service</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">NextAuth Edge</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">Operational</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Database</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">Prisma / SQL</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">Operational</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Storage</p>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-sm md:text-base shrink-0">Global CDN</span>
                <span className="text-[8px] md:text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full whitespace-nowrap">Operational</span>
              </div>
            </div>
            <button className="w-full h-11 md:h-12 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all text-xs md:text-base border border-white/5 active:scale-95">
              Infrastructure Test <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
