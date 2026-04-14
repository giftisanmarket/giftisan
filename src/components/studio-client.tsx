"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle2,
  Truck,
  Phone,
  Mail,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { updateOrderItemStatus, deleteProduct } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { EditProductModal } from "@/components/edit-product-modal";


interface StudioClientProps {
  artisan: any;
  sales: any[];
  reviews: any[];
}

export function StudioClient({ artisan, sales, reviews }: StudioClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"inventory" | "sales" | "reviews">("inventory");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemToPrint, setItemToPrint] = useState<any | null>(null);
  const [shippingItem, setShippingItem] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(productToDelete);
    const res = await deleteProduct(productToDelete);
    
    if (res.success) {
      router.refresh();
      setProductToDelete(null);
      setIsDeleting(null);
    } else {
      alert(res.error || "Failed to delete product");
      setIsDeleting(null);
      setProductToDelete(null);
    }
  };

  const products = artisan.products || [];
  const totalFavorites = products.reduce((acc: number, p: any) => acc + (p.favoritedBy?.length || 0), 0);
  const totalReviews = products.reduce((acc: number, p: any) => acc + (p.reviews?.length || 0), 0);

  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price * sale.quantity), 0);

  return (
    <>
      <main className="min-h-screen bg-cream">
      <Navbar />

      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-10 md:p-12 max-w-lg w-full shadow-2xl border border-primary/5 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-heading font-bold text-primary">Remove Treasure?</h3>
                <p className="text-charcoal/40 text-sm leading-relaxed">
                  Are you sure you want to remove this piece from your studio? This action is permanent and your client reviews for this item will be lost.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 h-14 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all"
                >
                  Keep It
                </button>
                <button 
                  disabled={isDeleting === productToDelete}
                  onClick={handleDelete}
                  className="flex-1 h-14 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting === productToDelete ? "Removing..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Studio Header */}
        <div className="relative bg-primary text-white rounded-[3rem] p-8 md:p-16 mb-12 shadow-2xl shadow-primary/20 overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                <Image src={artisan.avatar} alt={artisan.studioName || artisan.user.name} fill className="object-cover" />
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
            { label: "Studio Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "bg-green-500" },
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
        <div className="flex gap-4 mb-8 overflow-x-auto pt-4 pb-4 scrollbar-hide whitespace-nowrap relative z-20">
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
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-white text-xs flex items-center justify-center rounded-full border-2 border-white shadow-2xl animate-bounce z-50">
                {sales.filter(s => s.status === "PENDING").length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "px-8 h-12 rounded-full font-bold transition-all flex items-center gap-2",
              activeTab === "reviews" ? "bg-primary text-white" : "bg-white text-primary border border-primary/5"
            )}
          >
            <Star className="w-4 h-4" /> Studio Community
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
                        <button 
                          onClick={() => {
                            setSelectedProductForEdit(p);
                            setIsEditModalOpen(true);
                          }}
                          className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setProductToDelete(p.id)}
                          disabled={isDeleting === p.id}
                          className="w-12 h-12 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <Link href={`/products/${p.slug || p.id}`} className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl">
                          <ArrowUpRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-heading font-bold text-primary">{p.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight whitespace-nowrap",
                            (p.stock || 0) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {(p.stock || 0)} in stock
                          </span>
                        </div>
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
        ) : activeTab === 'sales' ? (
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
                                  <span className="text-[10px] font-bold text-accent flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" /> 
                                    {item.order.clientPhone || "N/A"}
                                  </span>
                                  <span className="text-[10px] font-bold text-accent flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> 
                                    {item.order.clientEmail || item.order.user.email}
                                  </span>
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
                            onClick={() => {
                              setShippingItem(item);
                            }}
                            className="px-6 h-10 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-light transition-all font-bold"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {item.status === "SHIPPED" && (
                          <button 
                            disabled={isUpdating === item.id}
                            onClick={async () => {
                              setIsUpdating(item.id);
                              await updateOrderItemStatus(item.id, "DELIVERED");
                              router.refresh();
                              setIsUpdating(null);
                            }}
                            className="px-6 h-10 bg-green-500 text-white text-xs font-bold rounded-full hover:bg-green-600 transition-all font-bold"
                          >
                            {isUpdating === item.id ? "Updating..." : "Mark as Delivered"}
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                            className={cn(
                              "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                              openMenuId === item.id ? "bg-primary text-white border-primary" : "border-primary/5 text-primary/40 hover:text-primary hover:border-primary/20"
                            )}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          <AnimatePresence>
                            {openMenuId === item.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-primary/5 p-2 z-50 overflow-hidden"
                                >
                                  <Link 
                                    href={`/profile/messages?userId=${item.order.userId}`}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                  >
                                    <Mail className="w-4 h-4 text-accent" />
                                    Contact Buyer
                                  </Link>
                                  <button 
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setSelectedItem(item);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                  >
                                    <BarChart3 className="w-4 h-4 text-accent" />
                                    Full Order Details
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setItemToPrint(item);
                                      setTimeout(() => {
                                        window.print();
                                        setItemToPrint(null);
                                      }, 100);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-primary hover:bg-cream rounded-xl transition-colors"
                                  >
                                    <Package className="w-4 h-4 text-accent" />
                                    Print Packing Slip
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === "reviews" ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.length === 0 ? (
                <div className="col-span-full py-20 px-10 text-center bg-white rounded-[3rem] border border-primary/5">
                  <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                    <Star className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">No Reviews Yet</h3>
                  <p className="text-charcoal/40 max-w-xs mx-auto">Treasures are being shipped! Reviews will appear here once your collectors share their joy.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div 
                    layout
                    key={review.id}
                    className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col justify-between group hover:border-accent/20 transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-cream shrink-0">
                            <Image src={review.user.image || "/icon.png"} alt="" width={40} height={40} className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-primary">{review.user.name}</p>
                            <p className="text-[10px] text-charcoal/30 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn("w-3 h-3", i < review.rating ? "fill-accent text-accent" : "text-primary/10")} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-charcoal/60 text-sm leading-relaxed italic mb-8 italic">"{review.comment}"</p>
                    </div>
                    
                    <Link 
                      href={`/products/${review.product.slug || review.product.id}`}
                      className="mt-auto pt-6 border-t border-primary/5 flex items-center gap-4 group/p"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream border border-primary/5 shadow-sm shrink-0">
                        <Image src={review.product.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest mb-0.5 group-hover/p:text-accent transition-colors">Reviewed Item</p>
                        <p className="font-bold text-xs text-primary group-hover/p:underline underline-offset-4 decoration-accent/30 leading-snug">{review.product.name}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      {selectedProductForEdit && (
        <div className="no-print">
          <EditProductModal 
            product={selectedProductForEdit} 
            isOpen={isEditModalOpen} 
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProductForEdit(null);
            }} 
          />
        </div>
      )}
    </main>

    {/* Order Details Modal */}
    <AnimatePresence>
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="absolute inset-0 bg-primary/20 backdrop-blur-xl" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden no-print"
          >
            <div className="p-12 md:p-16 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Sale Receipt #{selectedItem.orderId.slice(-6).toUpperCase()}
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-primary">Order <span className="serif italic">Details</span></h2>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-12 h-12 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-12 pt-4">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Item Information</h3>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cream border border-primary/5 shadow-sm">
                      <Image src={selectedItem.product.images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-primary leading-tight">{selectedItem.product.name}</p>
                      <p className="text-sm text-charcoal/60 mt-1 font-medium">Qty: {selectedItem.quantity}</p>
                      <p className="text-lg font-heading font-bold mt-2 text-accent">${selectedItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                  {selectedItem.status === "SHIPPED" && selectedItem.trackingNumber && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-1">Shipment Tracking</p>
                      <p className="text-xs font-bold text-primary flex items-center gap-2">
                        <Truck className="w-3 h-3 text-accent" />
                        {selectedItem.carrier}: {selectedItem.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Buyer Details</h3>
                  <div>
                    <p className="font-bold text-primary">{selectedItem.order.user.name}</p>
                    <p className="text-charcoal/60 text-sm font-medium mt-1">{selectedItem.order.user.email}</p>
                    {selectedItem.order.clientPhone && (
                      <p className="text-accent text-sm font-bold mt-2">{selectedItem.order.clientPhone}</p>
                    )}
                    <div className="mt-6 pt-6 border-t border-primary/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-2">Shipping To</p>
                      <p className="text-sm text-charcoal/60 leading-relaxed font-medium">
                        {selectedItem.order.shippingAddress}<br />
                        {selectedItem.order.shippingCity}, {selectedItem.order.shippingZip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedItem.order.orderNotes && (
                <div className="mt-10 p-6 bg-accent/5 rounded-[2rem] border border-accent/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Order Notes from Client</h3>
                  </div>
                  <p className="text-sm italic text-charcoal/60 leading-relaxed">
                    "{selectedItem.order.orderNotes}"
                  </p>
                </div>
              )}

              <div className="pt-10 flex flex-col md:flex-row items-center gap-6">
                <Link 
                  href={`/profile/messages?userId=${selectedItem.order.userId}`}
                  className="w-full h-16 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-light transition-all shadow-xl shadow-primary/20"
                >
                  <Mail className="w-5 h-5" />
                  Message Customer
                </Link>
                <button 
                  onClick={() => {
                    setItemToPrint(selectedItem);
                    setTimeout(() => {
                      window.print();
                      setItemToPrint(null);
                    }, 100);
                  }}
                  className="w-full md:w-fit px-10 h-16 border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all"
                >
                  Print Summary
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Shipping Modal */}
    <AnimatePresence>
      {shippingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShippingItem(null)}
            className="absolute inset-0 bg-primary/20 backdrop-blur-xl" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-12 no-print"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Fulfillment Status
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-primary">Ship <span className="serif italic">Item</span></h2>
                </div>
                <button 
                  onClick={() => setShippingItem(null)}
                  className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {shippingItem.order.orderNotes && (
                <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Client Notes</p>
                  <p className="text-xs italic text-charcoal/60 leading-relaxed">"{shippingItem.order.orderNotes}"</p>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Shipment Carrier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aramex, DHL, FedEx"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Tracking Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter tracking ID..."
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full h-14 px-6 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={async () => {
                    setIsUpdating(shippingItem.id);
                    const res = await updateOrderItemStatus(shippingItem.id, "SHIPPED", trackingNumber, carrier);
                    if (res.success) {
                      toast.success("Shipment data saved & buyer notified!", {
                        icon: <div className="p-1 bg-green-500 rounded-full text-white"><CheckCircle2 className="w-4 h-4" /></div>,
                        style: { borderRadius: '20px', background: '#1a4332', color: '#fff' }
                      });
                      setShippingItem(null);
                      setTrackingNumber("");
                      setCarrier("");
                      router.refresh();
                    } else {
                      toast.error("Failed to update status");
                    }
                    setIsUpdating(null);
                  }}
                  disabled={!carrier || !trackingNumber || isUpdating === shippingItem.id}
                  className="w-full h-16 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-light transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isUpdating === shippingItem.id ? "Updating..." : "Confirm & Mark as Shipped"}
                </button>
                <button 
                  onClick={() => setShippingItem(null)}
                  className="w-full h-16 text-primary/40 font-bold hover:text-primary transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Hidden Printable Area */}
    {itemToPrint && (
      <div className="hidden print:flex print:flex-col print-isolated p-10 bg-white min-h-[25cm]">
        <div className="flex items-center justify-between border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">GIFTISAN</h1>
            <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">Official Packing Slip</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">Order #{itemToPrint.orderId.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-charcoal/40 font-medium">{new Date(itemToPrint.order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-3">Ship To</h3>
            <p className="font-bold text-primary">{itemToPrint.order.user.name}</p>
            <p className="text-sm text-charcoal/60 leading-relaxed font-medium mt-1">
              {itemToPrint.order.shippingAddress}<br />
              {itemToPrint.order.shippingCity}, {itemToPrint.order.shippingZip}<br />
              {itemToPrint.order.shippingCountry || "Egypt"}<br />
              {itemToPrint.order.clientPhone && <span className="font-bold text-primary">{itemToPrint.order.clientPhone}</span>}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-3">From</h3>
            <p className="font-bold text-primary">{artisan.studioName || artisan.user.name}</p>
            <p className="text-sm text-charcoal/60 leading-relaxed font-medium mt-1">
              {artisan.location || "Egypt"}<br />
              {artisan.user.email}
            </p>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b text-left">
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40">Item</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Qty</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-6 font-bold text-primary">{itemToPrint.product.name}</td>
              <td className="py-6 text-center font-bold text-charcoal/60">{itemToPrint.quantity}</td>
              <td className="py-6 text-right font-bold text-primary">${itemToPrint.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-auto text-center pt-8 border-t border-primary/5">
          <p className="text-xs italic font-serif text-primary/60">"Thank you for supporting handcrafted excellence."</p>
          <p className="text-[8px] uppercase font-black tracking-[0.2em] text-accent mt-4">giftisan.com</p>
        </div>
      </div>
    )}
    </>
  );
}
