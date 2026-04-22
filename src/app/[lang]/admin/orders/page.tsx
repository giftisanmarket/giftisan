import { getAllOrders } from "@/lib/actions";
import { Package, Truck, CheckCircle2, Clock, User, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.global_orders_title || "Orders"} | ${dict.admin?.marketplace || "Platform"}`,
  };
}

export default async function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const orders = await getAllOrders();

  return (
    <div className="space-y-8 md:space-y-12">
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

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scrollbar-hide">
          <table className="w-full text-left min-w-[900px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.order_details}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.customer}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.items}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.status}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">{dict.admin.revenue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div>
                      <p className="font-mono text-[10px] md:text-xs font-bold text-primary uppercase">{order.id.slice(0, 10)}</p>
                      <p className="text-[8px] md:text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.isGift && (
                        <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full w-fit">
                          <Sparkles className="w-2.5 h-2.5 text-accent" />
                          <span className="text-[8px] font-black uppercase text-accent tracking-widest">{dict.checkout.mark_as_gift}</span>
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
                        <p className="text-xs md:text-sm font-bold text-primary truncate max-w-[150px]">{order.user.name}</p>
                        <p className="text-[9px] md:text-[10px] text-charcoal/40 font-medium truncate max-w-[150px]">{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="relative w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={item.product.images[0]} alt="" className="object-cover w-full h-full" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-cream border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                          <span className="text-[8px] md:text-[9px] font-black text-primary">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className={cn(
                      "px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 md:gap-2 w-fit whitespace-nowrap",
                      order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                      order.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      "bg-green-50 text-green-700 border-green-200"
                    )}>
                      {order.status === "PENDING" && <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      {order.status === "SHIPPED" && <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      {order.status === "DELIVERED" && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                    <p className="text-base md:text-lg font-heading font-bold text-primary">{dict.product.currency} {order.totalAmount}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
