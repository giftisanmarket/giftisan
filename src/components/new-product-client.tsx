"use client";

import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  DollarSign,
  Tag,
  Type,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  Video,
  Loader2,
  ShieldCheck,
  X,
  Trash2,
  Star,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface NewProductClientProps {
  artisanId: string;
  dict: any;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_DURATION = 30; // 30 seconds

const VariantRow = memo(({ v, i, variants, setVariants, dict }: any) => (
  <tr className="hover:bg-cream/20 transition-colors group">
    <td className="px-6 py-4">
      <div className="relative w-12 h-12 bg-cream rounded-xl overflow-hidden border border-primary/5 flex items-center justify-center group/img">
        {v.image ? (
          <img src={v.image} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-5 h-5 text-primary/20" />
        )}
        <input 
          type="file" 
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const img = new (window as any).Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_RES = 1080;
                  if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
                  else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
                  canvas.width = width; canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
                  
                  const newVariants = [...variants];
                  newVariants[i] = { ...newVariants[i], image: canvas.toDataURL('image/webp', 0.75) };
                  setVariants(newVariants);
                };
                img.src = reader.result as string;
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    </td>
    <td className="px-6 py-4 font-bold text-primary">{v.name}</td>
    <td className="px-6 py-4">
      <input 
        type="number" 
        value={v.price}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], price: e.target.value };
          setVariants(newVariants);
        }}
        className="w-24 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4">
      <div className="space-y-1">
        <input 
          type="number" 
          value={v.stock}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], stock: e.target.value };
            setVariants(newVariants);
          }}
          className={cn(
            "w-20 h-10 bg-white border rounded-xl px-3 focus:outline-none font-bold",
            parseInt(v.stock) < 5 ? "border-orange-300 focus:border-orange-500" : "border-primary/20 focus:border-accent"
          )}
        />
        {parseInt(v.stock) < 5 && (
          <p className="text-[8px] font-black uppercase text-orange-500 tracking-tighter">{dict.edit_product.low_stock}!</p>
        )}
      </div>
    </td>
    <td className="px-6 py-4">
      <input 
        type="text" 
        value={v.badge || ""}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], badge: e.target.value };
          setVariants(newVariants);
        }}
        placeholder="e.g. Rare"
        className="w-24 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4">
      <input 
        type="text" 
        value={v.sku}
        onChange={(e) => {
          const newVariants = [...variants];
          newVariants[i] = { ...newVariants[i], sku: e.target.value };
          setVariants(newVariants);
        }}
        placeholder={dict.checkout.optional}
        className="w-28 h-10 bg-white border border-primary/20 rounded-xl px-3 focus:outline-none focus:border-accent font-bold"
      />
    </td>
    <td className="px-6 py-4 text-end">
      <button 
        type="button"
        onClick={() => setVariants(variants.filter((_: any, idx: number) => idx !== i))}
        className="text-red-400 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100 opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </td>
  </tr>
));

VariantRow.displayName = "VariantRow";

const VariantCard = memo(({ v, i, variants, setVariants, dict }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-primary/10 shadow-sm space-y-5">
    <div className="flex items-center gap-4">
      <div className="relative w-14 h-14 bg-cream rounded-xl overflow-hidden border border-primary/5 flex items-center justify-center shrink-0">
        {v.image ? (
          <img src={v.image} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-primary/10" />
        )}
        <input 
          type="file" 
          accept="image/*"
          className="absolute inset-0 opacity-0"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const img = new (window as any).Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_RES = 1080;
                  if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
                  else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
                  canvas.width = width; canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
                  
                  const newVariants = [...variants];
                  newVariants[i] = { ...newVariants[i], image: canvas.toDataURL('image/webp', 0.75) };
                  setVariants(newVariants);
                };
                img.src = reader.result as string;
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-primary truncate">{v.name}</p>
        <button 
          type="button"
          onClick={() => {
            setVariants(variants.filter((_: any, idx: number) => idx !== i));
            toast.success("Variant removed");
          }}
          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 mt-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{dict.common?.remove || "Delete Variant"}</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.new_product.price_label}</label>
        <input 
          type="number" 
          value={v.price}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], price: e.target.value };
            setVariants(newVariants);
          }}
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.new_product.initial_stock_label}</label>
        <input 
          type="number" 
          value={v.stock}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], stock: e.target.value };
            setVariants(newVariants);
          }}
          className={cn(
            "w-full h-10 bg-cream/30 border rounded-xl px-3 font-bold text-sm",
            parseInt(v.stock) < 5 ? "border-orange-300" : "border-primary/5"
          )}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.edit_product.variant_badge}</label>
        <input 
          type="text" 
          value={v.badge || ""}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], badge: e.target.value };
            setVariants(newVariants);
          }}
          placeholder="e.g. Rare"
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-primary/30">{dict.edit_product.sku_label}</label>
        <input 
          type="text" 
          value={v.sku}
          onChange={(e) => {
            const newVariants = [...variants];
            newVariants[i] = { ...newVariants[i], sku: e.target.value };
            setVariants(newVariants);
          }}
          placeholder={dict.checkout.optional}
          className="w-full h-10 bg-cream/30 border border-primary/5 rounded-xl px-3 font-bold text-sm"
        />
      </div>
    </div>
  </div>
));

VariantCard.displayName = "VariantCard";

const OptionValueInput = memo(({ optIdx, onAddValue, dict }: { optIdx: number; onAddValue: (optIdx: number, val: string) => void; dict: any }) => {
  const [val, setVal] = useState("");

  const handleCommit = useCallback(() => {
    const trimmed = val.trim().replace(/,/g, "");
    if (trimmed) {
      onAddValue(optIdx, trimmed);
      setVal("");
    }
  }, [optIdx, onAddValue, val]);

  return (
    <div className="flex items-center gap-1.5 bg-white border border-primary/15 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 rounded-full px-3 py-1 shadow-sm transition-all">
      <input
        type="text"
        value={val}
        placeholder={dict.edit_product?.add_value || "Add value..."}
        onChange={(e) => {
          const text = e.target.value;
          if (text.includes(",")) {
            const parts = text.split(",");
            parts.forEach((p) => {
              const cleaned = p.trim();
              if (cleaned) onAddValue(optIdx, cleaned);
            });
            setVal("");
          } else {
            setVal(text);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            handleCommit();
          }
        }}
        onBlur={() => {
          handleCommit();
        }}
        className="bg-transparent border-none focus:outline-none text-xs font-bold w-24 sm:w-32 text-primary placeholder:text-primary/30"
      />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCommit();
        }}
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95",
          val.trim() ? "bg-accent text-white hover:bg-accent/90 cursor-pointer shadow-sm" : "bg-primary/10 text-primary/30 cursor-default"
        )}
        title={dict.edit_product?.add_value || "Add value"}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
});

OptionValueInput.displayName = "OptionValueInput";

const VariationsSection = memo(({ dict, options, setOptions, variants, setVariants, basePrice }: any) => {
  const [newOptionName, setNewOptionName] = useState("");
  const [showBulkStockModal, setShowBulkStockModal] = useState(false);
  const [bulkStockVal, setBulkStockVal] = useState("5");

  const addOption = () => {
    if (newOptionName.trim()) {
      setOptions([...options, { name: newOptionName.trim(), values: [] }]);
      setNewOptionName("");
    }
  };

  const addValue = (optIdx: number, val: string) => {
    if (!val.trim()) return;
    const newOptions = [...options];
    if (!newOptions[optIdx].values.includes(val.trim())) {
      newOptions[optIdx].values.push(val.trim());
      setOptions(newOptions);
    }
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const newOptions = [...options];
    newOptions[optIdx].values.splice(valIdx, 1);
    setOptions(newOptions);
  };

  const generateVariants = () => {
    const combos = options.reduce((acc: any[], opt: any) => {
      if (opt.values.length === 0) return acc;
      const nextCombos: any[] = [];
      opt.values.forEach((val: string) => {
        if (acc.length === 0) {
          nextCombos.push({ [opt.name]: val });
        } else {
          acc.forEach((combo: any) => {
            nextCombos.push({ ...combo, [opt.name]: val });
          });
        }
      });
      return nextCombos;
    }, [] as any[]);

    const newVariants = combos.map((combo: any) => {
      const name = Object.values(combo).join(" / ");
      return {
        name,
        price: basePrice,
        stock: "0",
        sku: "",
        options: combo
      };
    });
    setVariants(newVariants);
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
        <Tag className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-heading font-bold text-primary">{dict.edit_product.variations}</h2>
      </div>

      <div className="space-y-6">
        {/* Quick Option Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 me-1">Quick Presets:</span>
          {["Color", "Size", "Material", "Finish", "Style"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (!options.some((o: any) => o.name.toLowerCase() === preset.toLowerCase())) {
                  setOptions([...options, { name: preset, values: [] }]);
                  toast.success(`Added option: ${preset}`);
                }
              }}
              className="px-3 py-1 bg-primary/5 hover:bg-accent/10 hover:text-accent border border-primary/10 rounded-full text-xs font-bold text-primary transition-all active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-accent" />
              <span>{preset}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <input 
            type="text" 
            placeholder={dict.edit_product.option_name_placeholder}
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            className="flex-1 py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:border-accent font-bold shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                e.stopPropagation();
                addOption();
              }
            }}
          />
          <button 
            type="button"
            onClick={addOption}
            className="h-14 px-8 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-lg active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-accent" />
            {dict.edit_product.add_option}
          </button>
        </div>
        <p className="text-[10px] font-bold text-accent/60 uppercase tracking-widest px-2">{dict.edit_product.enter_to_add}</p>

        <div className="space-y-4">
          {options.map((opt: any, optIdx: number) => (
            <div key={optIdx} className="p-6 bg-cream/30 rounded-2xl border border-primary/5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  <span>{opt.name}</span>
                </h4>
                <button 
                  type="button" 
                  onClick={() => {
                    setOptions(options.filter((_: any, i: number) => i !== optIdx));
                    toast.success(`Removed option: ${opt.name}`);
                  }}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{dict.common?.remove || "Delete Option"}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val: string, valIdx: number) => (
                  <span key={valIdx} className="px-3 py-1 bg-white border border-primary/10 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-in zoom-in-50">
                    {val}
                    <button type="button" onClick={() => removeValue(optIdx, valIdx)} className="text-red-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <OptionValueInput optIdx={optIdx} onAddValue={addValue} dict={dict} />
                <span className="text-[9px] font-bold text-accent/40 uppercase tracking-tighter self-center">{dict.edit_product.enter_to_add}</span>
              </div>
            </div>
          ))}
        </div>

        {options.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              type="button"
              onClick={generateVariants}
              className="flex-1 py-4 border-2 border-dashed border-accent/20 text-accent font-black uppercase tracking-widest rounded-2xl hover:bg-accent/5 transition-all active:scale-[0.99] text-[10px] md:text-sm"
            >
              {dict.edit_product.generate_variants}
            </button>
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    if (!basePrice || String(basePrice).trim() === "" || Number(basePrice) <= 0) {
                      toast.error(dict.edit_product?.enter_base_price_first || "Please enter a Base Price first!");
                      return;
                    }
                    const newVariants = variants.map((v: any) => ({ ...v, price: String(basePrice) }));
                    setVariants(newVariants);
                    toast.success(dict.edit_product.prices_synced);
                  }}
                  className="px-6 py-4 bg-cream text-primary border border-primary/10 font-bold rounded-2xl hover:bg-cream/50 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  <DollarSign className="w-4 h-4 text-accent" />
                  {dict.edit_product.apply_base_price}
                </button>

                <button 
                  type="button"
                  onClick={() => setShowBulkStockModal(true)}
                  className="px-6 py-4 bg-primary/5 text-primary border border-primary/10 font-bold rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  <Tag className="w-4 h-4 text-accent" />
                  {dict.edit_product?.set_bulk_stock || "Set Bulk Stock"}
                </button>
              </div>
            )}
          </div>
        )}

        {variants.length > 0 && (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-[2rem] border border-primary/10 shadow-inner">
              <table className="w-full text-start text-xs">
                <thead className="bg-primary/5 text-primary/40 font-black uppercase tracking-tighter">
                  <tr>
                    <th className="px-6 py-4 text-start w-12"></th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.variant_name}</th>
                    <th className="px-6 py-4 text-start">{dict.new_product.price_label}</th>
                    <th className="px-6 py-4 text-start">{dict.new_product.initial_stock_label}</th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.variant_badge}</th>
                    <th className="px-6 py-4 text-start">{dict.edit_product.sku_label}</th>
                    <th className="px-4 py-4 text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {variants.map((v: any, i: number) => (
                    <VariantRow key={i} v={v} i={i} variants={variants} setVariants={setVariants} dict={dict} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {variants.map((v: any, i: number) => (
                <VariantCard key={i} v={v} i={i} variants={variants} setVariants={setVariants} dict={dict} />
              ))}
            </div>
          </div>
        )}
        {/* Bulk Stock Modal */}
        <AnimatePresence>
          {showBulkStockModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-primary">
                        {dict.edit_product?.set_bulk_stock || "Set Bulk Stock"}
                      </h3>
                      <p className="text-xs text-primary/50 font-medium">
                        {dict.edit_product?.bulk_stock_desc || "Enter stock quantity for all variants"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkStockModal(false)}
                    className="p-2 rounded-xl text-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/60 uppercase tracking-wider">
                      {dict.new_product?.initial_stock_label || "Quantity"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      autoFocus
                      value={bulkStockVal}
                      onChange={(e) => setBulkStockVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (bulkStockVal !== "" && !isNaN(Number(bulkStockVal))) {
                            const newVariants = variants.map((v: any) => ({ ...v, stock: bulkStockVal }));
                            setVariants(newVariants);
                            toast.success(
                              dict.edit_product?.stock_set_success
                                ? dict.edit_product.stock_set_success.replace("{count}", bulkStockVal)
                                : `Set stock to ${bulkStockVal} for all variants`
                            );
                            setShowBulkStockModal(false);
                          }
                        }
                      }}
                      placeholder="e.g. 5"
                      className="w-full h-12 px-4 bg-cream/30 border border-primary/10 rounded-2xl font-bold text-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkStockModal(false)}
                      className="flex-1 py-3.5 px-4 bg-cream hover:bg-cream/70 text-primary font-bold rounded-2xl transition-all text-sm"
                    >
                      {dict.common?.cancel || "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (bulkStockVal !== "" && !isNaN(Number(bulkStockVal))) {
                          const newVariants = variants.map((v: any) => ({ ...v, stock: bulkStockVal }));
                          setVariants(newVariants);
                          toast.success(
                            dict.edit_product?.stock_set_success
                              ? dict.edit_product.stock_set_success.replace("{count}", bulkStockVal)
                              : `Set stock to ${bulkStockVal} for all variants`
                          );
                          setShowBulkStockModal(false);
                        }
                      }}
                      className="flex-1 py-3.5 px-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl transition-all shadow-md shadow-accent/20 active:scale-95 text-sm"
                    >
                      {dict.common?.apply || "Apply Stock"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

VariationsSection.displayName = "VariationsSection";

export function NewProductClient({ artisanId, dict }: NewProductClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "ceramics",
    images: ["", "", "", "", "", "", "", "", "", ""],
    canPersonalize: false,
    personalizationPrompt: "",
    requiresClientImage: false,
    clientImagePrompt: "",
    badge: "",
    stock: "1"
  });

  const [options, setOptions] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState<Record<number, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [resolutions, setResolutions] = useState<Record<number, string>>({});

  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Detect resolutions for existing media
  useEffect(() => {
    formData.images.forEach((img, idx) => {
      if (img && !resolutions[idx]) {
        if (img.includes('video') || img.match(/\.(mp4|webm|ogg|mov)/i)) {
          const video = document.createElement('video');
          video.src = img;
          video.onloadedmetadata = () => {
            setResolutions(prev => ({ ...prev, [idx]: `${video.videoWidth}×${video.videoHeight}` }));
          };
        } else {
          const i = new (window as any).Image();
          i.onload = () => {
            setResolutions(prev => ({ ...prev, [idx]: `${i.width}×${i.height}` }));
          };
          i.src = img;
        }
      }
    });
  }, [formData.images, resolutions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { id: "ceramics", label: dict.common.categories_list?.["ceramics"] || dict.common.ceramics },
    { id: "jewelry", label: dict.common.categories_list?.["jewelry"] || dict.common.jewelry },
    { id: "gift-boxes-sets", label: dict.common.categories_list?.["gift-boxes-sets"] || "Gift Boxes & Sets" },
    { id: "textiles", label: dict.common.categories_list?.["textiles"] || dict.common.textiles },
    { id: "woodwork", label: dict.common.categories_list?.["woodwork"] || dict.common.woodwork },
    { id: "leatherwork", label: dict.common.categories_list?.["leatherwork"] || dict.common.leatherwork },
    { id: "culinary-arts", label: dict.common.categories_list?.["culinary-arts"] || "Culinary Arts" },
    { id: "beauty-apothecary", label: dict.common.categories_list?.["beauty-apothecary"] || "Beauty & Apothecary" },
    { id: "metalwork", label: dict.common.categories_list?.["metalwork"] || dict.common.metalwork },
    { id: "glasswork", label: dict.common.categories_list?.["glasswork"] || dict.common.glasswork },
    { id: "basketry", label: dict.common.categories_list?.["basketry"] || dict.common.basketry },
    { id: "fashion", label: dict.common.categories_list?.["fashion"] || dict.common.fashion },
    { id: "wedding", label: dict.common.categories_list?.["wedding"] || dict.common.wedding },
    { id: "personalized", label: dict.common.categories_list?.["personalized"] || dict.common.personalized },
    { id: "art-collectibles", label: dict.common.categories_list?.["art-collectibles"] || dict.common.art_collectibles },
    { id: "vintage", label: dict.common.categories_list?.["vintage"] || dict.common.vintage },
    { id: "stationery", label: dict.common.categories_list?.["stationery"] || dict.common.stationery }
  ];

  const handleImageChange = useCallback((index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev: any) => ({ ...prev, images: newImages }));
    if (!value) {
      setResolutions(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  }, [formData.images]);

  // Media Gallery Best Practice Helpers
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleSetAsCover = useCallback((idx: number) => {
    if (idx === 0 || !formData.images[idx]) return;
    setFormData((prev: any) => {
      const newImages = [...prev.images];
      const temp = newImages[0];
      newImages[0] = newImages[idx];
      newImages[idx] = temp;
      return { ...prev, images: newImages };
    });

    setResolutions(prev => {
      const next = { ...prev };
      const tempRes = next[0];
      next[0] = next[idx];
      next[idx] = tempRes;
      return next;
    });

    toast.success(dict.new_product?.set_as_cover_success || "Set as main cover photo!");
  }, [formData.images, dict]);

  const processSingleFile = useCallback((file: File, idx: number) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(dict.home?.upload_rules?.format_error || "Invalid file format");
      return;
    }

    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      toast.error(dict.home?.upload_rules?.image_size_error || "Image size exceeds limit");
      return;
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      toast.error(dict.home?.upload_rules?.video_size_error || "Video size exceeds limit");
      return;
    }

    setIsCompressing(prev => ({ ...prev, [idx]: true }));

    if (file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > MAX_VIDEO_DURATION) {
          toast.error(dict.home?.upload_rules?.video_duration_error || "Video duration exceeds limit");
          setIsCompressing(prev => ({ ...prev, [idx]: false }));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          handleImageChange(idx, reader.result as string);
          setResolutions(prev => ({ ...prev, [idx]: `${videoElement.videoWidth}×${videoElement.videoHeight}` }));
          setIsCompressing(prev => ({ ...prev, [idx]: false }));
        };
        reader.readAsDataURL(file);
      };
      videoElement.src = URL.createObjectURL(file);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new (window as any).Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_RES = 1280;
          if (width > height) { if (width > MAX_RES) { height *= MAX_RES / width; width = MAX_RES; } }
          else { if (height > MAX_RES) { width *= MAX_RES / height; height = MAX_RES; } }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, width, height); }
          const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          handleImageChange(idx, canvas.toDataURL(outType, 0.85));
          setResolutions(prev => ({ ...prev, [idx]: `${width}×${height}` }));
          setIsCompressing(prev => ({ ...prev, [idx]: false }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [dict, handleImageChange]);

  const handleBatchFilesUpload = useCallback((files: FileList | File[], targetStartIdx?: number) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    let emptyIndices = formData.images
      .map((img: string, idx: number) => (img ? -1 : idx))
      .filter((idx: number) => idx !== -1);

    if (targetStartIdx !== undefined && !formData.images[targetStartIdx]) {
      emptyIndices = [targetStartIdx, ...emptyIndices.filter((i: number) => i !== targetStartIdx)];
    }

    fileArray.forEach((file, i) => {
      if (i < emptyIndices.length) {
        processSingleFile(file, emptyIndices[i]);
      }
    });
  }, [formData.images, processSingleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleBatchFilesUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.price || !formData.images[0]) {
      toast.error(dict.new_product.validation_error);
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price.trim());
    form.append("category", formData.category);
    form.append("canPersonalize", formData.canPersonalize.toString());
    form.append("personalizationPrompt", formData.personalizationPrompt);
    form.append("requiresClientImage", formData.requiresClientImage.toString());
    form.append("clientImagePrompt", formData.clientImagePrompt);
    form.append("badge", formData.badge);
    form.append("stock", formData.stock.trim());

    formData.images.forEach((img, i) => {
      if (img) form.append(`image-${i}`, img);
    });

    form.append("variants", JSON.stringify(variants));

    try {
      const res = await createProduct(artisanId, form);

      if (res.success) {
        toast.success(dict.new_product.success_message || "Product listed successfully!");
        window.location.href = "/studio";
      } else {
        toast.error(res.error || "Failed to create product.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(dict.common?.error || "A connection error occurred. Please check your signal.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-primary/40 hover:text-primary text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {dict.studio_profile.back_to_studio}
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              {dict.new_product.list_new_treasure}{" "}
              <span className="serif italic font-normal text-accent">{dict.new_product.treasure_accent}</span>
            </h1>
            <p className="text-charcoal/40 mt-1">{dict.new_product.share_craftsmanship}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-primary/5">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading font-bold text-primary">{dict.new_product.the_essentials}</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3 h-3" /> {dict.new_product.product_title_label}
                  </label>
                  <span className={cn("text-[10px] font-mono font-bold", formData.name.length > 90 ? "text-amber-500" : "text-primary/30")}>
                    {formData.name.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={dict.new_product.product_title_placeholder}
                  className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> {dict.new_product.price_label}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder={dict.new_product.price_placeholder}
                      className="w-full py-4 px-8 pe-16 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm"
                    />
                    <div className="absolute end-4 px-3 py-1 bg-cream/60 border border-primary/10 rounded-xl text-xs font-black text-primary/60 pointer-events-none">
                      EGP
                    </div>
                  </div>
                </div>
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" /> {dict.new_product.category_label}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-start flex items-center justify-between shadow-sm"
                  >
                    <span className={cn("font-medium", formData.category ? "text-primary" : "text-primary/50")}>
                      {categories.find(c => c.id === formData.category)?.label || dict.new_product.select_category}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-primary/40 transition-transform", isCategoryOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 top-full start-0 end-0 mt-2 bg-white border border-primary/10 rounded-[2rem] shadow-2xl p-4 space-y-1 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10"
                      >
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category: cat.id });
                              setIsCategoryOpen(false);
                            }}
                            className={cn(
                              "w-full px-5 md:px-6 py-2.5 md:py-3 text-start rounded-xl transition-all font-bold text-xs md:text-sm active:scale-[0.98]",
                              formData.category === cat.id
                                ? "bg-primary text-white shadow-lg"
                                : "text-primary/60 hover:bg-primary/5"
                            )}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2">
                    {dict.new_product.description_label}
                  </label>
                  <span className={cn("text-[10px] font-mono font-bold", formData.description.length > 1400 ? "text-amber-500" : "text-primary/30")}>
                    {formData.description.length}/1500
                  </span>
                </div>
                <textarea
                  required
                  maxLength={1500}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={dict.new_product.description_placeholder}
                  className="w-full h-32 md:h-40 p-5 md:p-6 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-medium resize-none shadow-sm text-sm md:text-base"
                />
              </div>
            </div>
          </section>

          <section
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border transition-all duration-300 space-y-6 md:space-y-8 relative overflow-hidden",
              isDraggingOver ? "border-accent ring-4 ring-accent/10 bg-accent/5" : "border-primary/5"
            )}
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 md:pb-6 border-b border-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                  <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-primary flex items-center gap-2">
                    {dict.new_product.media_gallery}
                    <span className="text-xs font-bold text-primary/40 font-mono">
                      ({formData.images.filter(Boolean).length}/10)
                    </span>
                  </h2>
                  <p className="text-xs text-charcoal/50 italic mt-0.5">{dict.new_product.media_desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent">
                    {dict.new_product.optimal_size}
                  </span>
                </div>

                {/* Batch Upload Button */}
                <label className="cursor-pointer px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-all flex items-center gap-2 shadow-md active:scale-95">
                  <Upload className="w-4 h-4" />
                  <span>{dict.new_product?.add_media || "Add Media"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleBatchFilesUpload(e.target.files);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Upload Rules Warning Banner */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50/60 border border-amber-200/60 rounded-2xl">
              <div className="w-8 h-8 bg-amber-100/80 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-2">
                  {dict.home?.upload_rules?.no_logos_note || "NO LOGOS OR WATERMARKS ALLOWED"}
                </p>
                <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                  {dict.home?.upload_rules?.clean_media_note || "High quality photos without text, borders or studio logos."}
                </p>
              </div>
            </div>

            {/* Drag & Drop Visual Indicator overlay when dragging files */}
            {isDraggingOver && (
              <div className="absolute inset-0 z-50 bg-accent/10 backdrop-blur-md border-2 border-dashed border-accent rounded-[2rem] flex flex-col items-center justify-center text-accent animate-in fade-in zoom-in-95">
                <Upload className="w-12 h-12 animate-bounce mb-3" />
                <p className="text-base font-black uppercase tracking-widest">Drop your files here to upload</p>
                <p className="text-xs font-bold text-accent/70 mt-1">Supports JPG, PNG, WEBP, MP4 (Max 10)</p>
              </div>
            )}

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {formData.images.map((img, idx) => {
                const isCover = idx === 0;
                const isFilled = Boolean(img);

                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div
                      className={cn(
                        "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 group border",
                        isCover && isFilled
                          ? "border-2 border-accent shadow-lg shadow-accent/10"
                          : isFilled
                          ? "border-primary/10 bg-white shadow-sm hover:shadow-md"
                          : "border-dashed border-primary/20 bg-cream/30 hover:border-accent/40 hover:bg-accent/5"
                      )}
                    >
                      {/* FILLED CARD CONTENT */}
                      {isFilled ? (
                        <>
                          {img.includes("video") || img.match(/\.(mp4|webm|ogg|mov)/i) ? (
                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                              <video
                                src={img}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                onMouseOver={(e) => e.currentTarget.play()}
                                onMouseOut={(e) => e.currentTarget.pause()}
                              />
                              <div className="absolute bottom-2 end-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase flex items-center gap-1">
                                <Video className="w-2.5 h-2.5" /> Video
                              </div>
                            </div>
                          ) : (
                            <Image src={img} alt={`Media ${idx + 1}`} fill className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105" />
                          )}

                          {/* COVER BADGE */}
                          {isCover && (
                            <div className="absolute top-2 start-2 z-20 px-2 py-0.5 bg-gradient-to-r from-accent to-amber-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 pointer-events-none">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              <span>{dict.new_product.main_cover}</span>
                            </div>
                          )}

                          {/* RESOLUTION BADGE */}
                          {resolutions[idx] && (
                            <div className="absolute bottom-2 start-2 z-20 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-mono font-bold text-white/90 pointer-events-none">
                              {resolutions[idx]}
                            </div>
                          )}

                          {/* ALWAYS-VISIBLE DELETE BUTTON ON SMALL SCREENS / HOVER ON DESKTOP */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageChange(idx, "");
                            }}
                            className="absolute top-2 end-2 z-40 p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg border border-white/20 transition-all active:scale-90 cursor-pointer flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                            title={dict.new_product.remove}
                            aria-label={dict.new_product.remove || "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* BOTTOM GRADIENT OVERLAY & CONTROLS */}
                          <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2 sm:p-2.5 gap-1.5 rounded-2xl overflow-hidden">
                            {/* Make Main Cover Button (if not already cover) */}
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(idx)}
                                className="w-full py-1 px-2 bg-amber-500/90 hover:bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 border border-amber-300/30"
                              >
                                <Star className="w-2.5 h-2.5 fill-white" />
                                <span>{dict.new_product?.set_as_cover || "Set Cover"}</span>
                              </button>
                            )}

                            <div className="flex items-center gap-1.5 w-full">
                              {/* Change File Button */}
                              <label className="w-full py-1.5 px-2 bg-white hover:bg-cream text-primary font-extrabold text-[10px] sm:text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-white/40">
                                <Upload className="w-3.5 h-3.5 text-accent shrink-0" />
                                <span className="font-bold">{dict.new_product.change}</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) processSingleFile(file, idx);
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Compression Spinner */}
                          {isCompressing[idx] && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center rounded-2xl">
                              <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                          )}
                        </>
                      ) : (
                        /* EMPTY SLOT CONTENT */
                        <label className="w-full h-full flex flex-col items-center justify-center p-3 cursor-pointer group/upload rounded-2xl">
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleBatchFilesUpload(e.target.files, idx);
                              }
                            }}
                          />
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 group-hover/upload:bg-accent/10 group-hover/upload:scale-110 transition-all flex items-center justify-center mb-2">
                            {isCover ? (
                              <Star className="w-5 h-5 text-accent/60 group-hover/upload:text-accent" />
                            ) : (
                              <Plus className="w-5 h-5 text-primary/30 group-hover/upload:text-accent" />
                            )}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 group-hover/upload:text-accent text-center">
                            {isCover
                              ? dict.new_product.main_cover
                              : typeof dict.new_product.angle === "string" && dict.new_product.angle.includes("{count}")
                              ? dict.new_product.angle.replace("{count}", (idx + 1).toString())
                              : `Angle ${idx + 1}`}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <VariationsSection 
            options={options}
            setOptions={setOptions}
            variants={variants}
            setVariants={setVariants}
            basePrice={formData.price}
            dict={dict}
          />

          <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-5 md:pb-6 border-b border-primary/5">
              <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-accent" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary">{dict.new_product.special_details}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {/* Interactive Personalization Toggle Card */}
              <div
                onClick={() => setFormData((prev: any) => ({ ...prev, canPersonalize: !prev.canPersonalize }))}
                className={cn(
                  "flex items-start gap-4 p-6 rounded-2xl md:rounded-[2rem] border transition-all cursor-pointer select-none",
                  formData.canPersonalize
                    ? "bg-accent/5 border-accent/40 shadow-md ring-2 ring-accent/10"
                    : "bg-cream/20 border-primary/5 hover:border-primary/20"
                )}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="personalize"
                    checked={formData.canPersonalize}
                    onChange={(e) => setFormData({ ...formData, canPersonalize: e.target.checked })}
                    className="w-5 h-5 rounded border-primary/20 text-accent focus:ring-accent cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm md:text-base flex items-center justify-between">
                    <span>{dict.new_product.allow_personalization}</span>
                    {formData.canPersonalize && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">Active</span>
                    )}
                  </p>
                  <p className="text-[10px] md:text-xs text-charcoal/50 mt-1">{dict.new_product.personalization_desc}</p>
                </div>
              </div>

              <AnimatePresence>
                {formData.canPersonalize && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="col-span-full space-y-3 overflow-hidden">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.personalization_prompt_label}</label>
                    <textarea value={formData.personalizationPrompt} onChange={(e) => setFormData({ ...formData, personalizationPrompt: e.target.value })} placeholder={dict.new_product.personalization_prompt_placeholder} className="w-full h-24 p-5 bg-accent/5 border border-accent/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-medium resize-none text-sm" />
                    
                    {/* Live Buyer Preview Pill */}
                    <div className="p-3 bg-cream/40 border border-primary/10 rounded-xl text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-bold text-primary/60">Live Buyer Preview:</span>
                      <span className="text-primary font-medium italic">"{formData.personalizationPrompt || "Enter custom name or message..."}"</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Client Image Toggle Card */}
              <div
                onClick={() => setFormData((prev: any) => ({ ...prev, requiresClientImage: !prev.requiresClientImage }))}
                className={cn(
                  "flex items-start gap-4 p-6 rounded-2xl md:rounded-[2rem] border transition-all cursor-pointer select-none",
                  formData.requiresClientImage
                    ? "bg-accent/5 border-accent/40 shadow-md ring-2 ring-accent/10"
                    : "bg-cream/20 border-primary/5 hover:border-primary/20"
                )}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="requireClientImage"
                    checked={formData.requiresClientImage}
                    onChange={(e) => setFormData({ ...formData, requiresClientImage: e.target.checked })}
                    className="w-5 h-5 rounded border-primary/20 text-accent focus:ring-accent cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm md:text-base flex items-center justify-between">
                    <span>{dict.new_product.require_client_image || "Require Customer Image Upload"}</span>
                    {formData.requiresClientImage && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">Active</span>
                    )}
                  </p>
                  <p className="text-[10px] md:text-xs text-charcoal/50 mt-1">{dict.new_product.client_image_desc || "Require buyers to upload an image/photo before purchasing."}</p>
                </div>
              </div>

              <AnimatePresence>
                {formData.requiresClientImage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="col-span-full space-y-3 overflow-hidden">
                    <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.client_image_prompt_label || "Image Upload Instructions"}</label>
                    <textarea value={formData.clientImagePrompt} onChange={(e) => setFormData({ ...formData, clientImagePrompt: e.target.value })} placeholder={dict.new_product.client_image_prompt_placeholder || "What photo should the buyer upload?"} className="w-full h-24 p-5 bg-accent/5 border border-accent/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-medium resize-none text-sm" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Promo Badge Input with Presets */}
              <div className="space-y-3 col-span-full md:col-span-1">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.promo_badge_label}</label>
                
                {/* Preset Badge Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {["One of a Kind", "Handmade", "Gift Ready", "Made to Order", "Rare Product"].map((badgePreset) => (
                    <button
                      key={badgePreset}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: badgePreset })}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border",
                        formData.badge === badgePreset
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-cream/40 text-primary/70 border-primary/10 hover:border-accent/40"
                      )}
                    >
                      {badgePreset}
                    </button>
                  ))}
                </div>

                <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder={dict.new_product.promo_badge_placeholder} className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm text-sm" />
              </div>

              {/* Initial Stock Input (for non-variant products) */}
              <div className="space-y-3 col-span-full md:col-span-1">
                <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest">{dict.new_product.initial_stock_label}</label>
                <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder={dict.new_product.initial_stock_placeholder} className="w-full py-4 px-8 bg-white border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/50 text-primary font-bold shadow-sm text-sm" />
              </div>
            </div>
          </section>

          {/* Form Bottom Submit Button */}
          <div className="flex justify-end pt-8 pb-20">
            <button type="submit" disabled={isLoading} className="py-5 w-full md:w-auto md:px-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 duration-200 text-base">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span>{dict.new_product.listing_treasure}</span>
                </>
              ) : (
                <>
                  <span>{dict.new_product.list_product_btn}</span>
                  <Sparkles className="w-5 h-5 text-accent" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Floating Sticky Action Bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-primary/10 py-3.5 px-4 md:px-8 shadow-2xl transition-all">
          <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
            <div className="min-w-0 hidden sm:block">
              <p className="text-xs font-bold text-primary truncate max-w-xs">
                {formData.name || "Untitled Product"}
              </p>
              <p className="text-[10px] font-medium text-primary/40 font-mono">
                {formData.price ? `${formData.price} EGP` : "Set Price"} • {formData.images.filter(Boolean).length}/10 Photos
              </p>
            </div>

            <div className="flex items-center gap-3 ms-auto">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2.5 text-xs font-bold text-primary/60 hover:text-primary transition-colors hidden md:block"
              >
                ↑ Top
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="py-3 px-8 bg-primary text-white font-bold text-xs md:text-sm rounded-xl hover:bg-primary-light transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                ) : (
                  <Sparkles className="w-4 h-4 text-accent" />
                )}
                <span>{dict.new_product.list_product_btn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
