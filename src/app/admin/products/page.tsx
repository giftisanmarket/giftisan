import { prisma } from "@/lib/prisma";
import { ShoppingBag, Star, TrendingUp, Tag, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      artisan: {
        include: {
          user: true
        }
      },
      reviews: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            Global <span className="serif italic text-accent font-normal">Products</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">Monitor all handcrafted treasures listed on Giftisan.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Total Treasures</p>
          <p className="text-xl md:text-2xl font-black text-primary leading-none">{products.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scrollbar-hide">
          <table className="w-full text-left min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Treasure</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Artisan</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Category</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Inventory</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-cream/30 transition-colors group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-primary/5 shadow-sm shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-primary group-hover:text-accent transition-colors truncate max-w-[200px] text-sm md:text-base">{p.name}</p>
                        <p className="text-[10px] md:text-xs text-accent font-bold">EGP {p.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-primary/5 shrink-0">
                        <Image src={p.artisan.avatar} alt={p.artisan.user.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-primary truncate max-w-[120px] whitespace-nowrap">{p.artisan.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-primary/20" />
                      <span className="text-[10px] md:text-xs font-bold text-primary/60">{p.category}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.stock > 10 ? "bg-green-500" : p.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest",
                        p.stock > 0 ? "text-primary/60" : "text-red-500"
                      )}>
                        {p.stock} units
                      </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                    <div className="flex items-center justify-end gap-2 md:gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] md:text-xs font-black text-primary">{p.reviews?.length || 0}</span>
                      </div>
                    </div>
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
