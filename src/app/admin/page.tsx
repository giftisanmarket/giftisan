import { getAdminStats, getAllOrders } from "@/lib/actions";
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  const recentOrders = await getAllOrders();

  const cards = [
    { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500", trend: "+12%" },
    { label: "Global Users", value: stats.userCount, icon: Users, color: "bg-blue-500", trend: "+5%" },
    { label: "Active Products", value: stats.productCount, icon: ShoppingBag, color: "bg-accent", trend: "+8%" },
    { label: "Orders Fulfilled", value: stats.orderCount, icon: Package, color: "bg-purple-500", trend: "+15%" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6", card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-3xl font-heading font-bold text-primary">{card.value}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-heading font-bold text-primary">Recent Global Orders</h2>
            <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-accent hover:underline">View All →</Link>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
             <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/5">
                  <th className="px-8 py-4 text-[10px] font-black text-primary/40 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-primary/40 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-4 text-[10px] font-black text-primary/40 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-primary/40 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-primary">{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-5 font-bold text-primary">{order.user.name}</td>
                    <td className="px-8 py-5 font-bold text-accent">${order.totalAmount}</td>
                    <td className="px-8 py-5 text-xs font-black">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
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

        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold text-primary">System Health</h2>
          <div className="bg-primary text-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Auth Service</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">NextAuth Edge</span>
                <span className="text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full">Operational</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Database</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Prisma / PostgreSQL</span>
                <span className="text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full">Operational</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Storage</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Global CDN</span>
                <span className="text-[10px] font-black text-accent-light px-2 py-0.5 bg-accent-light/10 rounded-full">Operational</span>
              </div>
            </div>
            <button className="w-full h-12 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              Run Infrastructure Test <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
