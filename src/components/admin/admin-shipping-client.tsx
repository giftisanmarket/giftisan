"use client";

import { useState } from "react";
import { Truck, Plus, Edit, Trash2, Check, X, Clock, MapPin, DollarSign, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createShippingMethod, updateShippingMethod, deleteShippingMethod, toggleShippingMethod } from "@/lib/actions";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string | null;
  isActive: boolean;
}

interface AdminShippingClientProps {
  initialMethods: any[];
  dict: any;
}

export function AdminShippingClient({ initialMethods, dict }: AdminShippingClientProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>(initialMethods);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    estimatedDays: ""
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleShippingMethod(id, !currentStatus);
    if (res.success) {
      setMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !currentStatus } : m));
      toast.success(dict.admin.status_updated);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipping zone?")) return;
    const res = await deleteShippingMethod(id);
    if (res.success) {
      setMethods(prev => prev.filter(m => m.id !== id));
      toast.success(dict.admin.zone_removed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      estimatedDays: formData.estimatedDays
    };

    let res;
    if (editingMethod) {
      res = await updateShippingMethod(editingMethod.id, payload);
    } else {
      res = await createShippingMethod(payload);
    }

    setIsLoading(false);

    if (res.success) {
      if (editingMethod) {
        setMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...payload } : m));
        toast.success("Shipping zone updated");
      } else {
        setMethods(prev => [...prev, res.method]);
        toast.success("New shipping zone added");
      }
      resetForm();
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingMethod(null);
    setFormData({ name: "", price: "", estimatedDays: "" });
  };

  const startEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      price: method.price.toString(),
      estimatedDays: method.estimatedDays || ""
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-3">
            {dict.admin.shipping_management.split(' ')[0]} <span className="serif italic text-accent font-normal">{dict.admin.shipping_management.split(' ')[1] || "Zones"}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">
            Manage your delivery regions and flat-rate costs. Changes here affect checkout instantly.
          </p>
        </motion.div>

        {!isAdding && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsAdding(true)}
            className="group relative px-8 h-14 bg-primary text-white font-bold rounded-2xl flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{dict.admin.add_zone}</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <Sparkles className="w-12 h-12 text-accent/10 animate-pulse" />
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.admin.zone_name}</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Cairo & Giza"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-14 ps-14 pe-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.admin.cost_egp}</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full h-14 ps-14 pe-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.admin.est_delivery}</label>
                <div className="relative group">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. 2-3 business days"
                    value={formData.estimatedDays}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
                    className="w-full h-14 ps-14 pe-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-14 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {editingMethod ? dict.common.save : dict.admin.create_zone}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 h-14 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all"
                >
                  {dict.common.cancel}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {methods.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-primary/10">
                <Truck className="w-12 h-12 text-primary/10 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-primary mb-2">No zones defined yet</h3>
                <p className="text-charcoal/40 text-sm max-w-xs mx-auto mb-8">Start by adding your first shipping region to enable checkout.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-8 h-12 bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold rounded-xl transition-all"
                >
                  Add Your First Zone
                </button>
              </div>
            ) : (
              methods.map((method, idx) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group relative bg-white rounded-3xl p-6 md:p-8 border transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col md:flex-row items-center justify-between gap-6",
                    !method.isActive ? "opacity-60 grayscale border-primary/5" : "border-primary/5 hover:border-accent/20"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                      method.isActive ? "bg-accent/10 text-accent" : "bg-primary/5 text-primary/20"
                    )}>
                      <Truck className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-heading font-black text-primary">{method.name}</h3>
                        {!method.isActive && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary/40 text-[8px] font-black uppercase tracking-widest rounded-full">Inactive</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-charcoal/40 text-xs font-bold uppercase tracking-wider">
                          <DollarSign className="w-3.5 h-3.5" />
                          {method.price === 0 ? dict.checkout.free : `${method.price} ${dict.product.currency}`}
                        </div>
                        {method.estimatedDays && (
                          <div className="flex items-center gap-2 text-charcoal/40 text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            {method.estimatedDays}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(method.id, method.isActive)}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                        method.isActive 
                          ? "bg-green-50 border-green-100 text-green-600 hover:bg-green-100" 
                          : "bg-primary/5 border-primary/5 text-primary/40 hover:bg-primary/10"
                      )}
                      title={method.isActive ? "Disable Zone" : "Enable Zone"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => startEdit(method)}
                      className="w-12 h-12 bg-primary/5 border border-primary/5 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="w-12 h-12 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
