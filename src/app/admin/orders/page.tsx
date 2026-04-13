import { getAllOrders } from "@/lib/actions";
import { Package, Truck, CheckCircle2, Clock, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            Global <span className="serif italic text-accent font-normal">Orders</span>
          </h1>
          <p className="text-charcoal/40 font-medium">Track fulfillment across the entire artisan network.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-primary/5 shadow-sm">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-2xl font-black text-primary leading-none">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/5">
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Order Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Items</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-cream/30 transition-colors group">
                <td className="px-8 py-6">
                  <div>
                    <p className="font-mono text-xs font-bold text-primary uppercase">{order.id.slice(0, 10)}</p>
                    <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{order.user.name}</p>
                      <p className="text-[10px] text-charcoal/40 font-medium">{order.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="relative w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                        <img src={item.product.images[0]} alt="" className="object-cover w-full h-full" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-lg bg-cream border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-[9px] font-black text-primary">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit",
                    order.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                    order.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                    "bg-green-50 text-green-700 border-green-200"
                  )}>
                    {order.status === "PENDING" && <Clock className="w-3 h-3" />}
                    {order.status === "SHIPPED" && <Truck className="w-3 h-3" />}
                    {order.status === "DELIVERED" && <CheckCircle2 className="w-3 h-3" />}
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className="text-lg font-heading font-bold text-primary">${order.totalAmount}.00</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
