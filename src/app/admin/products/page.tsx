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
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            Global <span className="serif italic text-accent font-normal">Products</span>
          </h1>
          <p className="text-charcoal/40 font-medium">Monitor all handcrafted treasures listed on Giftisan.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-primary/5 shadow-sm">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Total Treasures</p>
          <p className="text-2xl font-black text-primary leading-none">{products.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/5">
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Treasure</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Artisan</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Inventory</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-cream/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-primary/5 shadow-sm">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-primary group-hover:text-accent transition-colors">{p.name}</p>
                      <p className="text-xs text-accent font-bold">${p.price}.00</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/5">
                      <Image src={p.artisan.avatar} alt={p.artisan.user.name} fill className="object-cover" />
                    </div>
                    <span className="text-sm font-bold text-primary">{p.artisan.user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-primary/20" />
                    <span className="text-xs font-bold text-primary/60">{p.category}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      p.stock > 10 ? "bg-green-500" : p.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      p.stock > 0 ? "text-primary/60" : "text-red-500"
                    )}>
                      {p.stock} units
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-black text-primary">{p.reviews?.length || 0}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
