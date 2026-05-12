import { prisma } from "@/lib/prisma";
import { ShoppingBag, Star, TrendingUp, Tag, User, Clock, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import { ProductModerationActions } from "@/components/admin/product-moderation-actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.global_products_title || "Products"} | ${dict.admin?.marketplace || "Platform"}`,
  };
}

export default async function AdminProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
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
            {dict.admin.global_products_title} <span className="serif italic text-accent font-normal">{dict.admin.products_accent}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">{dict.admin.monitor_products_desc}</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{dict.admin.total_treasures}</p>
          <p className="text-xl md:text-2xl font-black text-primary leading-none">{products.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.treasure}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.artisan}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.status}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.category}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.inventory}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">{dict.admin.actions}</th>
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
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-primary group-hover:text-accent transition-colors truncate max-w-[200px] text-sm md:text-base">{p.name}</p>
                          {p.isFeatured && <Star className="w-3 h-3 text-accent fill-accent shrink-0" />}
                        </div>
                        <p className="text-[10px] md:text-xs text-accent font-bold">{dict.product.currency} {p.price}</p>
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
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border",
                      p.status === "APPROVED" ? "bg-green-50 text-green-600 border-green-100" :
                      p.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {p.status === "APPROVED" ? dict.admin.approved : 
                       p.status === "REJECTED" ? dict.admin.rejected : 
                       dict.admin.pending}
                    </span>
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
                        {p.stock} {dict.admin.units}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                    <ProductModerationActions 
                      productId={p.id} 
                      initialStatus={p.status} 
                      isFeatured={p.isFeatured}
                      slug={p.slug}
                      dict={dict}
                    />
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
