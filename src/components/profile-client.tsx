"use client";

import { Navbar } from "@/components/navbar";
import { BespokeImage } from "./bespoke-image";
import Link from "next/link";
import { 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Calendar,
  CreditCard,
  Heart,
  ExternalLink,
  ShieldCheck,
  Truck,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: any;
  orders: any[];
  dict: any;
}

export function ProfileClient({ user, orders, dict }: ProfileClientProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Sidebar / Profile Header */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-primary/5 relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 group">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <BespokeImage 
                      src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt={user.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1">{user.name}</h1>
                <p className="text-charcoal/40 text-xs md:text-sm font-medium mb-6 md:mb-8">{user.email}</p>
                
                <div className="w-full grid grid-cols-1 gap-2">
                  <Link 
                    href="/profile/settings" 
                    className="flex items-center justify-between w-full p-3 md:p-4 bg-primary/5 rounded-2xl text-primary font-bold hover:bg-primary hover:text-white transition-all group text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 md:w-5 md:h-5 opacity-100" />
                      <span>{dict.profile.settings}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-100 lg:opacity-40 lg:group-hover:opacity-100" />
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link 
                      href="/admin"
                      className="flex items-center justify-between w-full p-3 md:p-4 bg-accent/5 rounded-2xl text-accent font-bold hover:bg-accent hover:text-white transition-all group text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 opacity-100 lg:opacity-40 lg:group-hover:opacity-100" />
                        <span>{dict.profile.admin}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-100 lg:opacity-40 lg:group-hover:opacity-100" />
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-between w-full p-3 md:p-4 bg-red-50 rounded-2xl text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all group text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 md:w-5 md:h-5 opacity-100 lg:opacity-40 lg:group-hover:opacity-100" />
                      <span>{dict.profile.sign_out}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-primary/20">
              <h3 className="text-lg md:text-xl font-heading font-bold mb-4 md:mb-6">{dict.profile.order_impact}</h3>
              <div className="space-y-4 md:space-y-6">
Trace
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/60 text-sm">{dict.profile.creations_owned}</span>
                  <span className="text-xl md:text-2xl font-bold">{orders.length}</span>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">{dict.profile.our_mission}</p>
                  <p className="text-[10px] md:text-sm italic leading-relaxed text-white/80">"{dict.profile.mission_quote}"</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            <section>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary">
                    {(dict.profile.journey_title_base || dict.profile.your_journey?.split(' ')[0])}{" "}
                    <span className="serif italic font-normal text-accent">
                      {(dict.profile.journey_title_accent || dict.profile.your_journey?.split(' ').slice(1).join(' '))}
                    </span>
                  </h2>
                  <p className="text-charcoal/40 text-xs md:text-sm mt-1">{dict.profile.track_orders}</p>
                </div>
                <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                  {dict.checkout.continue_shopping} →
                </Link>
              </div>

              <div className="space-y-4 md:space-y-6">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 text-center border border-primary/5 shadow-xl shadow-primary/5">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-8 h-8 md:w-10 md:h-10 text-primary/20" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-primary mb-2">{dict.profile.no_treasures_yet}</h3>
                    <p className="text-charcoal/40 text-xs md:text-sm max-w-xs mx-auto mb-8">{dict.profile.ready_find_first}</p>
                    <Link href="/" className="inline-flex items-center justify-center px-8 md:px-10 h-12 md:h-14 bg-primary text-white font-bold rounded-full text-xs transition-all">
                      {dict.profile.explore_gallery}
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden"
                    >
                    <div className="p-4 md:p-8 border-b border-primary/5 bg-cream/30 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex flex-wrap gap-4 md:gap-8 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
                          <div className="shrink-0">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 mb-0.5 md:mb-1">{dict.profile.reference}</p>
                            <p className="text-xs md:text-sm font-bold text-primary uppercase font-mono tracking-tighter shrink-0">{order.id.slice(0, 8)}</p>
                          </div>
                          <div className="shrink-0">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 mb-0.5 md:mb-1">{dict.profile.placed_on}</p>
                            <p className="text-xs md:text-sm font-bold text-primary shrink-0">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="shrink-0">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 mb-0.5 md:mb-1">{dict.profile.total_paid}</p>
                            <p className="text-xs md:text-sm font-bold text-primary shrink-0">{dict.product.currency} {order.totalAmount}</p>
                          </div>
                          {order.isGift && (
                            <div className="shrink-0 flex items-center gap-2">
                              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-accent">{dict.checkout.mark_as_gift}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 md:p-8 space-y-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="border-b last:border-0 border-primary/5 pb-6 last:pb-0">
                            <div className="flex gap-4 md:gap-6 items-start md:items-center">
                              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-cream shrink-0">
                                <BespokeImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.product.slug || item.product.id}`} className="block text-sm md:text-base font-heading font-bold text-primary hover:text-accent transition-colors line-clamp-1">
                                  {item.product.name}
                                </Link>
                                <p className="text-[10px] md:text-xs text-charcoal/40 font-medium">{dict.profile.qty}: {item.quantity} • {item.product.artisan.studioName || item.product.artisan.user.name}</p>
                                
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <div className={cn(
                                    "px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border shrink-0",
                                    item.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                                    item.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                    "bg-green-50 text-green-600 border-green-200"
                                  )}>
                                    {item.status === "PENDING" ? dict.profile.pending :
                                    item.status === "SHIPPED" ? dict.profile.shipped :
                                    dict.profile.delivered}
                                  </div>
                                  <Link 
                                    href={`/profile/messages?userId=${item.product.artisan.userId}`}
                                    className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-primary/40 hover:text-accent transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    {dict.profile.contact}
                                  </Link>
                                </div>

                                {item.personalization && (
                                  <div className="mt-2 text-[9px] md:text-[10px] italic text-accent flex items-center gap-2">
                                    <span className="w-1 h-1 bg-accent rounded-full shrink-0" />
                                    <span className="line-clamp-1">{dict.profile.personalized}: "{item.personalization}"</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {item.status === "SHIPPED" && item.trackingNumber && (
                              <div className="mt-4 p-4 md:p-5 bg-primary/5 rounded-2xl md:rounded-[2rem] border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-3">
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-accent shadow-sm shrink-0">
                                    <Truck className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div>
                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 leading-none mb-1">{dict.profile.carrier}</p>
                                    <p className="text-xs md:text-sm font-bold text-primary">{item.carrier}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col md:items-end w-full md:w-auto border-t md:border-t-0 border-primary/5 pt-3 md:pt-0">
                                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/20 leading-none mb-1 text-start md:text-end">{dict.profile.tracking_id}</p>
                                  <p className="text-xs md:text-sm font-mono font-bold text-primary text-start md:text-end">{item.trackingNumber}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
        </div>
      </div>
    </div>
    </main>
  );
}

