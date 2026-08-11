"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  X, 
  ShoppingBag, 
  Star, 
  Tag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  Check,
  Filter,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductModerationActions } from "@/components/admin/product-moderation-actions";

interface AdminProductsClientProps {
  initialProducts: any[];
  dict: any;
  lang: string;
}

export function AdminProductsClient({ initialProducts, dict, lang }: AdminProductsClientProps) {
  const isAr = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [initialProducts]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = initialProducts.length;
    const pending = initialProducts.filter(p => p.status === "PENDING").length;
    const approved = initialProducts.filter(p => p.status === "APPROVED").length;
    const lowStock = initialProducts.filter(p => p.stock <= 5).length;
    return { total, pending, approved, lowStock };
  }, [initialProducts]);

  const sortOptions = [
    { key: "NEWEST", label: isAr ? "الأحدث إضافتاً" : "Newest Treasures" },
    { key: "OLDEST", label: isAr ? "الأقدم إضافتاً" : "Oldest Treasures" },
    { key: "PRICE_HIGH", label: isAr ? "السعر (الأعلى للأقل)" : "Price: High to Low" },
    { key: "PRICE_LOW", label: isAr ? "السعر (الأقل للأعلى)" : "Price: Low to High" },
    { key: "STOCK_LOW", label: isAr ? "المخزون (الأقل للمزيد)" : "Stock: Lowest First" },
    { key: "FEATURED", label: isAr ? "المميزة أولاً" : "Featured First" },
  ];

  const activeSortOption = sortOptions.find(o => o.key === sortBy) || sortOptions[0];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesArtisan = product.artisan?.user?.name?.toLowerCase().includes(query) || product.artisan?.studioName?.toLowerCase().includes(query);
        const matchesCategory = product.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesArtisan && !matchesCategory) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if (product.status !== statusFilter) return false;
      }

      // 3. Stock Level Filter
      if (stockFilter !== "ALL") {
        if (stockFilter === "OUT_OF_STOCK" && product.stock > 0) return false;
        if (stockFilter === "LOW_STOCK" && (product.stock === 0 || product.stock > 5)) return false;
        if (stockFilter === "IN_STOCK" && product.stock === 0) return false;
      }

      // 4. Category Filter
      if (categoryFilter !== "ALL") {
        if (product.category !== categoryFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "OLDEST") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "PRICE_HIGH") return b.price - a.price;
      if (sortBy === "PRICE_LOW") return a.price - b.price;
      if (sortBy === "STOCK_LOW") return a.stock - b.stock;
      if (sortBy === "FEATURED") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0;
    });
  }, [initialProducts, searchQuery, statusFilter, stockFilter, categoryFilter, sortBy]);

  return (
    <div className="space-y-8 md:space-y-12" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-2">
            {dict.admin?.global_products_title || "Global"} <span className="serif italic text-accent font-normal">{dict.admin?.products_accent || "Treasures"}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">
            {dict.admin?.monitor_products_desc || "Moderate artisan products, set featured items, inspect stock levels, and enforce marketplace quality standards."}
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">
            {dict.admin?.total_treasures || (isAr ? "إجمالي الكنوز" : "Total Products")}
          </p>
          <p className="text-xl md:text-2xl font-black text-primary leading-none">{stats.total}</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-primary/5 shadow-lg shadow-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-primary/40 mb-0.5">
              {isAr ? "إجمالي المنتجات" : "Total Listings"}
            </p>
            <p className="text-2xl font-black text-primary leading-none">{stats.total}</p>
          </div>
        </div>

        <div className={cn(
          "p-5 rounded-2xl md:rounded-3xl border shadow-lg flex items-center gap-4 transition-all",
          stats.pending > 0 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-900 shadow-amber-500/5 animate-pulse" 
            : "bg-white border-primary/5 text-primary shadow-primary/5"
        )}>
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            stats.pending > 0 ? "bg-amber-500 text-white" : "bg-primary/5 text-primary/40"
          )}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">
              {isAr ? "بانتظار المراجعة" : "Pending Review"}
            </p>
            <p className="text-2xl font-black leading-none">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-primary/5 shadow-lg shadow-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-primary/40 mb-0.5">
              {isAr ? "معتمدة ونشطة" : "Approved & Active"}
            </p>
            <p className="text-2xl font-black text-green-600 leading-none">{stats.approved}</p>
          </div>
        </div>

        <div className={cn(
          "p-5 rounded-2xl md:rounded-3xl border shadow-lg flex items-center gap-4 transition-all",
          stats.lowStock > 0 
            ? "bg-red-50 border-red-200 text-red-900 shadow-red-500/5" 
            : "bg-white border-primary/5 text-primary shadow-primary/5"
        )}>
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            stats.lowStock > 0 ? "bg-red-500 text-white" : "bg-primary/5 text-primary/40"
          )}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">
              {isAr ? "مخزون منخفض / نفذ" : "Low / Out of Stock"}
            </p>
            <p className="text-2xl font-black leading-none">{stats.lowStock}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-primary/5 shadow-xl shadow-primary/5 space-y-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-primary/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث باسم المنتج، اسم الحرفي، الاستوديو، أو القسم..." : "Search by product name, artisan, studio, or category..."}
              className="w-full h-12 ps-11 pe-10 bg-cream/30 border border-primary/5 rounded-2xl text-xs font-bold text-primary placeholder:text-primary/30 focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-primary/30 hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Custom Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="h-12 px-5 bg-white border border-primary/10 hover:border-accent text-primary rounded-2xl flex items-center justify-between gap-3 font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                <span>{activeSortOption.label}</span>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-primary/40", isSortOpen && "rotate-180")} />
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
                <div className="absolute top-full end-0 mt-2 w-56 bg-white rounded-2xl border border-primary/10 shadow-2xl z-40 overflow-hidden py-1.5 px-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSortBy(option.key);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-start",
                          isSelected
                            ? "bg-primary text-white shadow-md font-black"
                            : "text-charcoal/70 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-light shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-3 border-t border-primary/5">
          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 me-1">
              {isAr ? "الحالة:" : "Status:"}
            </span>
            {[
              { key: "ALL", label: isAr ? "الكل" : "All" },
              { key: "PENDING", label: isAr ? "بانتظار المراجعة" : "Pending Review" },
              { key: "APPROVED", label: isAr ? "معتمد" : "Approved" },
              { key: "REJECTED", label: isAr ? "مرفوض" : "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-3.5 h-8 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                  statusFilter === tab.key
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 me-1">
              {isAr ? "المخزون:" : "Stock:"}
            </span>
            {[
              { key: "ALL", label: isAr ? "الكل" : "All Stock" },
              { key: "IN_STOCK", label: isAr ? "متوفر" : "In Stock" },
              { key: "LOW_STOCK", label: isAr ? "مخزون منخفض (≤5)" : "Low Stock (≤5)" },
              { key: "OUT_OF_STOCK", label: isAr ? "نفذ المخزون" : "Out of Stock" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStockFilter(tab.key)}
                className={cn(
                  "px-3.5 h-8 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                  stockFilter === tab.key
                    ? "bg-accent text-white border-accent shadow-md"
                    : "bg-white text-primary/40 border-primary/5 hover:border-primary/20"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills (If multiple categories exist) */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-primary/5">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 me-1">
              {isAr ? "القسم:" : "Category:"}
            </span>
            <button
              onClick={() => setCategoryFilter("ALL")}
              className={cn(
                "px-3.5 h-7 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border",
                categoryFilter === "ALL"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-white text-primary/30 border-primary/5 hover:border-primary/20"
              )}
            >
              {isAr ? "جميع الأقسام" : "All Categories"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3.5 h-7 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border",
                  categoryFilter === cat
                    ? "bg-primary/10 text-primary border-primary/20 font-bold"
                    : "bg-white text-primary/30 border-primary/5 hover:border-primary/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start min-w-[1000px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-start">
                  {dict.admin?.treasure || (isAr ? "المنتج والكنز" : "Treasure")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-start">
                  {dict.admin?.artisan || (isAr ? "الحرفي والاستوديو" : "Artisan")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-start">
                  {dict.admin?.status || (isAr ? "الحالة" : "Status")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-start">
                  {dict.admin?.category || (isAr ? "القسم" : "Category")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-start">
                  {dict.admin?.inventory || (isAr ? "المخزون" : "Inventory")}
                </th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-end">
                  {dict.admin?.actions || (isAr ? "الإجراءات" : "Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-charcoal/40 font-medium">
                    <div className="max-w-xs mx-auto space-y-3">
                      <Search className="w-10 h-10 mx-auto text-primary/20" />
                      <p className="text-sm font-bold text-primary">
                        {isAr ? "لم يتم العثور على أي منتجات تطابق تصفيتك." : "No products matched your active search and filter criteria."}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("ALL");
                          setStockFilter("ALL");
                          setCategoryFilter("ALL");
                        }}
                        className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        {isAr ? "إعادة ضبط التصفية" : "Reset Filters"}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-cream/30 transition-colors group">
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-primary/5 shadow-sm shrink-0 bg-cream">
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-primary group-hover:text-accent transition-colors truncate max-w-[200px] text-sm md:text-base">{p.name}</p>
                            {p.isFeatured && <Star className="w-3 h-3 text-accent fill-accent shrink-0" />}
                          </div>
                          <p className="text-[10px] md:text-xs text-accent font-bold">
                            {dict.product?.currency || "EGP"} {p.price}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-primary/5 shrink-0 bg-cream">
                          <Image src={p.artisan.avatar} alt={p.artisan.user?.name || "Artisan"} fill className="object-cover" />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-primary truncate max-w-[140px] whitespace-nowrap">
                          {p.artisan.studioName || p.artisan.user?.name || "Artisan"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border",
                        p.status === "APPROVED" ? "bg-green-50 text-green-600 border-green-100" :
                        p.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {p.status === "APPROVED" ? (dict.admin?.approved || "Approved") : 
                         p.status === "REJECTED" ? (dict.admin?.rejected || "Rejected") : 
                         (dict.admin?.pending || "Pending")}
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
                          p.stock > 0 ? "text-primary/60" : "text-red-500 font-bold"
                        )}>
                          {p.stock} {dict.admin?.units || "Units"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 md:px-8 py-4 md:py-6 text-end">
                      <ProductModerationActions 
                        productId={p.id} 
                        initialStatus={p.status} 
                        isFeatured={p.isFeatured}
                        slug={p.slug}
                        dict={dict}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
