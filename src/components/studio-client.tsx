"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  BarChart3, 
  Settings, 
  Heart, 
  ShoppingBag, 
  Star,
  ArrowUpRight,
  MoreVertical,
  Edit2,
  Package,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { updateOrderItemStatus } from "@/lib/actions";

interface StudioClientProps {
  artisan: any;
  sales: any[];
}

export function StudioClient({ artisan, sales }: StudioClientProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "sales">("inventory");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const products = artisan.products || [];
  const totalFavorites = products.reduce((acc: number, p: any) => acc + (p.favoritedBy?.length || 0), 0);
  const totalReviews = products.reduce((acc: number, p: any) => acc + (p.reviews?.length || 0), 0);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Studio Header */}
        <div className="bg-primary text-white rounded-[3rem] p-8 md:p-16 mb-12 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                <Image src={artisan.avatar} alt={artisan.user.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-accent-light font-black uppercase tracking-widest text-xs mb-2">Master Studio</p>
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                  {artisan.studioName || `${artisan.user.name}'s Studio`}
                </h1>
                <p className="text-white/60 max-w-xl italic">"{artisan.bio}"</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link href="/studio/settings" className="h-14 px-8 bg-white text-primary font-bold rounded-full hover:bg-cream transition-all flex items-center gap-2">
                <Settings className="w-5 h-5" /> 
                Studio Settings
              </Link>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Treasures", value: products.length, icon: ShoppingBag, color: "bg-blue-500" },
            { label: "Community Loves", value: totalFavorites, icon: Heart, color: "bg-red-500" },
            { label: "Global Reviews", value: totalReviews, icon: Star, color: "bg-yellow-500" },
            { label: "Studio Reach", value: "Global", icon: BarChart3, color: "bg-green-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-primary/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-heading font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Switching */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "px-8 h-12 rounded-full font-bold transition-all flex items-center gap-2",
              activeTab === "inventory" ? "bg-primary text-white" : "bg-white text-primary border border-primary/5"
            )}
          >
            <ShoppingBag className="w-4 h-4" /> Your Inventory
          </button>
          <button 
            onClick={() => setActiveTab("sales")}
            className={cn(
              "px-8 h-12 rounded-full font-bold transition-all flex items-center gap-2 relative",
              activeTab === "sales" ? "bg-primary text-white" : "bg-white text-primary border border-primary/5"
            )}
          >
            <Package className="w-4 h-4" /> Sales & Fulfillment
            {sales.filter(s => s.status === "PENDING").length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] flex items-center justify-center rounded-full border-2 border-cream animate-bounce">
                {sales.filter(s => s.status === "PENDING").length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "inventory" ? (
          /* Inventory Section */
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-heading font-bold text-primary">Studio <span className="serif italic font-normal text-accent">Inventory</span></h2>
                <p className="text-charcoal/40 mt-1">Manage your storefront and handcrafted pieces</p>
              </div>
              <Link 
                href="/studio/new-product"
                className="h-14 px-10 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all flex items-center gap-2 shadow-xl shadow-accent/20"
              >
                <Plus className="w-5 h-5" /> Add New Treasure
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-primary/20" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary">Your studio is currently quiet</h3>
                  <p className="text-charcoal/40 max-w-xs mx-auto">Share your first creation with the Giftisan community to start your craftsman journey.</p>
                  <button className="inline-flex items-center gap-2 px-8 h-14 bg-primary text-white font-bold rounded-full">
                    Create Your First Piece
                  </button>
                </div>
              ) : (
                products.map((p: any) => (
                  <div key={p.id} className="group relative bg-cream/30 rounded-[2.5rem] border border-primary/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all">
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <Link href={`/products/${p.id}`} className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl">
                          <ArrowUpRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-heading font-bold text-primary">{p.name}</h3>
                        <button className="text-charcoal/30 hover:text-primary transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-heading font-bold text-accent">${p.price}.00</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary/40">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{p.reviews?.length || 0} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Sales & Fulfillment Section */
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5 text-charcoal">
            <div className="mb-12">
              <h2 className="text-4xl font-heading font-bold text-primary">Sales & <span className="serif italic font-normal text-accent">Fulfillment</span></h2>
              <p className="text-charcoal/40 mt-1">Track orders and manage handcrafted requests from your clients</p>
            </div>

            <div className="space-y-6">
              {sales.length === 0 ? (
                <div className="py-20 text-center space-y-6 bg-cream/10 rounded-[2rem] border border-dashed border-primary/10">
                  <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto">
                    <Truck className="w-10 h-10 text-primary/20" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary">No sales yet</h3>
                  <p className="text-charcoal/40 max-w-xs mx-auto">When clients purchase your treasures, they will appear here for fulfillment.</p>
                </div>
              ) : (
                sales.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-[2rem] border border-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:shadow-primary/5 transition-all">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <h4 className="text-xl font-heading font-bold text-primary">{item.product.name}</h4>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          item.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                          item.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          "bg-green-50 text-green-600 border-green-200"
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal/60">
                        Ordered by <span className="font-bold text-primary">{item.order.user.name}</span> • {new Date(item.order.createdAt).toLocaleDateString()}
                      </p>
                      {item.personalization && (
                        <div className="bg-accent/5 border border-accent/10 p-3 rounded-xl inline-block mt-2">
                          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Bespoke Request:</p>
                          <p className="text-sm italic text-primary">"{item.personalization}"</p>
                        </div>
                      )}

                      <div className="mt-4">
                        <button 
                          onClick={() => setExpandedOrder(expandedOrder === item.id ? null : item.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-accent transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          {expandedOrder === item.id ? "Hide Shipping" : "Show Shipping Address"}
                        </button>
                        
                        <AnimatePresence>
                          {expandedOrder === item.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-2 border-t border-primary/5 mt-4">
                                <p className="text-xs font-bold text-primary">
                                  {item.order.shippingAddress || "No address provided"}
                                </p>
                                <p className="text-xs text-charcoal/60">
                                  {item.order.shippingCity}, {item.order.shippingZip}
                                </p>
                                <p className="text-xs text-charcoal/60">
                                  {item.order.shippingCountry}
                                </p>
                                <div className="pt-2 flex flex-wrap gap-4">
                                  <span className="text-[10px] font-bold text-accent">📞 {item.order.clientPhone || "N/A"}</span>
                                  <span className="text-[10px] font-bold text-accent">✉️ {item.order.clientEmail || item.order.user.email}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                      <p className="text-2xl font-heading font-bold text-primary">${item.price * item.quantity}.00</p>
                      <div className="flex gap-2">
                        {item.status === "PENDING" && (
                          <button 
                            disabled={isUpdating === item.id}
                            onClick={async () => {
                              setIsUpdating(item.id);
                              await updateOrderItemStatus(item.id, "SHIPPED");
                              window.location.reload();
                            }}
                            className="px-6 h-10 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-light transition-all flex items-center gap-2"
                          >
                            {isUpdating === item.id ? "Updating..." : "Mark as Shipped"}
                          </button>
                        )}
                        {item.status === "SHIPPED" && (
                          <button 
                            disabled={isUpdating === item.id}
                            onClick={async () => {
                              setIsUpdating(item.id);
                              await updateOrderItemStatus(item.id, "DELIVERED");
                              window.location.reload();
                            }}
                            className="px-6 h-10 bg-green-500 text-white text-xs font-bold rounded-full hover:bg-green-600 transition-all font-bold"
                          >
                            {isUpdating === item.id ? "Updating..." : "Mark as Delivered"}
                          </button>
                        )}
                        <button className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
