import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Check,
  CheckCircle2,
  X,
  EyeOff,
  Search
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
  onBulkDelete?: (ids: string[]) => void;
  onBulkStatusUpdate?: (ids: string[], status: string) => void;
}

export function InventoryTab({
  products,
  dict,
  isAdminPreview,
  setSelectedProductForEdit,
  setIsEditModalOpen,
  setProductToDelete,
  isDeleting,
  onBulkDelete,
  onBulkStatusUpdate
}: InventoryTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkStatus = (status: string) => {
    if (onBulkStatusUpdate && selectedIds.length > 0) {
      onBulkStatusUpdate(selectedIds, status);
      setSelectedIds([]);
    }
  };

  return (
    <div id="inventory" className="relative">
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5 mb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-12">
          <div className="space-y-2 text-center md:text-start w-full md:w-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight">
              {dict.studio.studio_inventory} <span className="serif italic font-normal text-accent">{dict.studio.studio_inventory_accent}</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm md:text-base text-charcoal/40 font-medium">{dict.studio.manage_inventory_desc}</p>
              {products.length > 0 && !isAdminPreview && (
                <button 
                  onClick={toggleSelectAll}
                  className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent-light transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedIds.length === products.length ? dict.studio.deselect_all : dict.studio.select_all}
                </button>
              )}
            </div>
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

        {/* Search Bar */}
        {products.length > 0 && (
          <div className="mb-10 relative group">
            <div className="absolute inset-y-0 start-0 ps-6 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-primary/20 group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.studio.search_treasures}
              className="w-full h-16 md:h-20 ps-16 pe-8 bg-cream/30 border border-primary/5 rounded-[1.5rem] md:rounded-[2.5rem] focus:outline-none focus:border-accent focus:bg-white transition-all text-sm md:text-lg font-bold text-primary placeholder:text-primary/20 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-0 pe-6 flex items-center text-primary/20 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 md:py-32 text-center space-y-6 md:space-y-8 bg-cream/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-primary/5">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5">
                <Search className="w-10 h-10 md:w-16 md:h-16 text-primary/10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-4xl font-heading font-bold text-primary">
                  {searchQuery ? dict.studio.no_search_results : dict.studio.empty_studio_title}
                </h3>
                <p className="text-charcoal/40 max-w-xs md:max-w-md mx-auto text-sm md:text-base">
                  {searchQuery ? "Try refining your keywords." : dict.studio.empty_studio_desc}
                </p>
              </div>
            </div>
          ) : (
            filteredProducts.map((p: any) => (
              <motion.div
                layout
                key={p.id}
                onClick={() => !isAdminPreview && selectedIds.length > 0 && toggleSelect(p.id)}
                className={cn(
                  "group relative bg-white rounded-[2rem] md:rounded-[3.5rem] border transition-all text-charcoal flex flex-col h-full overflow-hidden",
                  selectedIds.includes(p.id) ? "border-accent ring-4 ring-accent/5" : "border-primary/5 hover:shadow-2xl hover:shadow-primary/10"
                )}
              >
                <div className="relative aspect-square overflow-hidden shrink-0">
                  <BespokeImage type="product" id={p.id} src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />

                  {/* Multi-Select Checkbox */}
                  {!isAdminPreview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(p.id);
                      }}
                      className={cn(
                        "absolute top-4 end-4 md:top-8 md:end-8 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xl",
                        selectedIds.includes(p.id) 
                          ? "bg-accent text-white" 
                          : "bg-white/90 backdrop-blur-md text-primary opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {selectedIds.includes(p.id) ? <Check className="w-5 h-5" strokeWidth={3} /> : <div className="w-4 h-4 rounded-md border-2 border-primary/20" />}
                    </button>
                  )}

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

                  <div className={cn(
                    "absolute inset-0 bg-primary/60 transition-opacity hidden xl:flex items-center justify-center gap-4",
                    selectedIds.length > 0 ? "opacity-0 pointer-events-none" : "opacity-0 xl:group-hover:opacity-100"
                  )}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductForEdit(p);
                        setIsEditModalOpen(true);
                      }}
                      className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-90"
                    >
                      {isAdminPreview ? <Eye className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                    </button>
                    {!isAdminPreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(p.id);
                        }}
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
                  <div className={cn(
                    "xl:hidden absolute bottom-4 end-4 flex gap-2 z-20",
                    selectedIds.length > 0 && "opacity-0 pointer-events-none"
                  )}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductForEdit(p);
                        setIsEditModalOpen(true);
                      }}
                      className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl active:scale-90"
                    >
                      {isAdminPreview ? <Eye className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                    </button>
                    {!isAdminPreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(p.id);
                        }}
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
                          onClick={(e) => {
                            e.stopPropagation();
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

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-3xl"
          >
            <div className="bg-primary/90 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] flex items-center justify-between gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 min-w-0">
                <button 
                  onClick={() => setSelectedIds([])}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="hidden sm:block">
                  <p className="text-white font-bold text-lg">{selectedIds.length} {dict.studio.treasures_selected}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{dict.studio.selected_for_action}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button
                  onClick={() => handleBulkStatus("DRAFT")}
                  className="h-12 px-5 md:px-8 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 text-xs md:text-sm"
                >
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden md:inline whitespace-nowrap">{dict.studio.move_to_draft}</span>
                </button>
                <button
                  onClick={() => handleBulkStatus("APPROVED")}
                  className="h-12 px-5 md:px-8 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 text-xs md:text-sm"
                >
                  <Check className="w-4 h-4" strokeWidth={3} />
                  <span className="hidden md:inline whitespace-nowrap">{dict.studio.make_active}</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="h-12 w-12 md:w-auto md:px-6 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
                >
                  <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                  <span className="hidden md:inline whitespace-nowrap">{dict.studio.bulk_delete}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
