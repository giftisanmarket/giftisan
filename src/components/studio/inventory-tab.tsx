"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  Lock, 
  ShoppingBag, 
  Eye, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  Sparkles, 
  Info, 
  Star 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BespokeImage } from "@/components/bespoke-image";

interface InventoryTabProps {
  products: any[];
  dict: any;
  isAdminPreview: boolean;
  setSelectedProductForEdit: (product: any) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setProductToDelete: (productId: string) => void;
  isDeleting: string | null;
}

export function InventoryTab({
  products,
  dict,
  isAdminPreview,
  setSelectedProductForEdit,
  setIsEditModalOpen,
  setProductToDelete,
  isDeleting
}: InventoryTabProps) {
  return (
    <div id="inventory" className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-12">
        <div className="space-y-2 text-center md:text-start w-full md:w-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight">
            {dict.studio.studio_inventory} <span className="serif italic font-normal text-accent">{dict.studio.studio_inventory_accent}</span>
          </h2>
          <p className="text-sm md:text-base text-charcoal/40 font-medium">{dict.studio.manage_inventory_desc}</p>
        </div>
        {!isAdminPreview ? (
          <Link
            href="/studio/new-product"
            className="w-full md:w-auto h-14 md:h-16 px-8 md:px-12 bg-accent text-white font-bold rounded-xl md:rounded-full hover:bg-accent-light transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 active:scale-95 duration-200"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" /> {dict.studio.add_treasure}
          </Link>
        ) : (
          <div className="w-full md:w-auto h-14 md:h-16 px-8 bg-primary text-white font-bold rounded-xl md:rounded-full flex items-center justify-center gap-3 shadow-xl opacity-80">
            <Lock className="w-4 h-4 md:w-5 md:h-5" /> {dict.studio.management_locked}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
        {products.length === 0 ? (
          <div className="col-span-full py-20 md:py-32 text-center space-y-6 md:space-y-8 bg-cream/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-primary/5">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5">
              <ShoppingBag className="w-10 h-10 md:w-16 md:h-16 text-primary/10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-4xl font-heading font-bold text-primary">{dict.studio.empty_studio_title}</h3>
              <p className="text-charcoal/40 max-w-xs md:max-w-md mx-auto text-sm md:text-base">{dict.studio.empty_studio_desc}</p>
            </div>
            <Link href="/studio/new-product">
              <button className="inline-flex items-center gap-2 px-10 h-14 md:h-16 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all shadow-xl active:scale-95">
                {dict.studio.create_first_piece}
              </button>
            </Link>
          </div>
        ) : (
          products.map((p: any) => (
            <motion.div
              layout
              key={p.id}
              className="group relative bg-white rounded-[2rem] md:rounded-[3.5rem] border border-primary/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all text-charcoal flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden shrink-0">
                <BespokeImage type="product" id={p.id} src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />

                {/* Status Overlay - Premium Look */}
                <div className="absolute top-4 start-4 md:top-8 md:start-8 z-10 flex flex-col gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-xl border",
                    p.status === "APPROVED" ? "bg-green-500/90 text-white border-white/20" :
                      p.status === "REJECTED" ? "bg-red-500/90 text-white border-white/20" :
                        "bg-amber-500/90 text-white border-white/20"
                  )}>
                    {p.status === "APPROVED" ? dict.admin.treasure_approved :
                      p.status === "REJECTED" ? dict.admin.treasure_rejected :
                        p.status === "DRAFT" ? dict.admin.treasure_draft :
                          dict.admin.treasure_pending}
                  </span>
                </div>

                <div className="absolute inset-0 bg-primary/60 opacity-0 xl:group-hover:opacity-100 transition-opacity hidden xl:flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedProductForEdit(p);
                      setIsEditModalOpen(true);
                    }}
                    className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-90"
                  >
                    {isAdminPreview ? <Eye className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                  </button>
                  {!isAdminPreview && (
                    <button
                      onClick={() => setProductToDelete(p.id)}
                      disabled={isDeleting === p.id}
                      className="w-14 h-14 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-90 disabled:opacity-50"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                  <Link
                    href={`/products/${p.slug || p.id}`}
                    className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-90"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </Link>
                </div>

                {/* Mobile Actions - Refined */}
                <div className="xl:hidden absolute bottom-4 end-4 flex gap-2 z-20">
                  <button
                    onClick={() => {
                      setSelectedProductForEdit(p);
                      setIsEditModalOpen(true);
                    }}
                    className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl active:scale-90"
                  >
                    {isAdminPreview ? <Eye className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                  </button>
                  {!isAdminPreview && (
                    <button
                      onClick={() => setProductToDelete(p.id)}
                      disabled={isDeleting === p.id}
                      className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-red-500 flex items-center justify-center shadow-xl active:scale-90 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <Link
                    href={`/products/${p.slug || p.id}`}
                    className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl active:scale-90"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="p-6 md:p-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-2xl font-heading font-bold text-primary truncate leading-tight group-hover:text-accent transition-colors">{p.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        (p.stock || 0) <= 0 ? "bg-red-50 text-red-500 border-red-100" :
                          (p.stock || 0) < 5 ? "bg-orange-50 text-orange-600 border-orange-100 animate-pulse" :
                            "bg-primary/5 text-primary/40 border-transparent"
                      )}>
                        {dict.studio.in_stock.replace('{count}', (p.stock || 0).toString())}
                        {(p.stock || 0) > 0 && (p.stock || 0) < 5 && ` — ${dict.edit_product.low_stock}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    {p.status === "REJECTED" && !isAdminPreview && (
                      <button
                        onClick={() => {
                          setSelectedProductForEdit(p);
                          setIsEditModalOpen(true);
                        }}
                        className="text-[9px] font-black text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-100 active:scale-95"
                      >
                        <Sparkles className="w-3 h-3" />
                        {dict.studio.resolve_feedback}
                      </button>
                    )}
                  </div>
                </div>

                {p.status === "REJECTED" && p.rejectionReason && (
                  <div className="mb-6">
                    <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{dict.edit_product.feedback_title}</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-red-700 italic leading-relaxed">
                        "{p.rejectionReason}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.2em] mb-1">{dict.common.price}</p>
                    <p className="text-xl md:text-2xl font-heading font-bold text-accent">{dict.product.currency} {p.price}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.2em] mb-1">{dict.studio.reviews}</p>
                    <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-primary">
                      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                      <span>{p._count?.reviews || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
