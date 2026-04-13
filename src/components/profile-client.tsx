"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
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
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: any;
  orders: any[];
}

export function ProfileClient({ user, orders }: ProfileClientProps) {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-primary/5 border border-primary/5 relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-6 group">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image 
                      src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt={user.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <h1 className="text-3xl font-heading font-bold text-primary mb-2">{user.name}</h1>
                <p className="text-charcoal/40 text-sm font-medium mb-8">{user.email}</p>
                
                <div className="w-full flex flex-col gap-2">
                  <Link 
                    href="/profile/settings" 
                    className="flex items-center justify-between w-full p-4 bg-primary/5 rounded-2xl text-primary font-bold hover:bg-primary hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                      <span>Account Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link 
                      href="/admin"
                      className="flex items-center justify-between w-full p-4 bg-accent/5 rounded-2xl text-accent font-bold hover:bg-accent hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        <span>Admin Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-between w-full p-4 bg-red-50 rounded-2xl text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl shadow-primary/20">
              <h3 className="text-xl font-heading font-bold mb-6">Treasure Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/60">Total Orders</span>
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-xs text-white/40 uppercase font-black mb-1">Your Impact</p>
                  <p className="text-sm italic">"Every order you place supports independent artisan livelihoods."</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-4xl font-heading font-bold text-primary">Your <span className="serif italic font-normal text-accent">Journey</span></h2>
                  <p className="text-charcoal/40 mt-1">Order History & Status</p>
                </div>
                <Link href="/" className="text-xs font-black uppercase tracking-widest text-accent hover:underline">
                  Continue Shopping →
                </Link>
              </div>

              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-[3rem] p-16 text-center border border-primary/5 shadow-xl shadow-primary/5">
                    <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-primary/20" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary mb-2">No treasures yet...</h3>
                    <p className="text-charcoal/40 max-w-xs mx-auto mb-8">Your journey with our artisans hasn't started yet. Let's find your first piece.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-10 h-14 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 active:translate-y-0">
                      Explore the Gallery
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden"
                    >
                      <div className="p-8 border-b border-primary/5 bg-cream/30 flex flex-wrap justify-between items-center gap-6">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Order Reference</p>
                            <p className="font-bold text-primary uppercase font-mono">{order.id.slice(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Date Placed</p>
                            <p className="font-bold text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Total</p>
                            <p className="font-bold text-primary">${order.totalAmount}.00</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 space-y-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex gap-6 items-center">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-cream">
                              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <Link href={`/products/${item.product.id}`} className="font-heading font-bold text-primary hover:text-accent transition-colors flex items-center gap-2 group">
                                {item.product.name}
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                              </Link>
                              <p className="text-xs text-charcoal/40 font-medium">Qty: {item.quantity} • ${item.price}</p>
                              {item.personalization && (
                                <div className="mt-2 text-[10px] italic text-accent flex items-center gap-2">
                                  <span className="w-1 h-1 bg-accent rounded-full" />
                                  Personalized: "{item.personalization}"
                                </div>
                              )}
                            </div>
                            <Link 
                              href={`/artisans/${item.product.artisan.user.name.toLowerCase().replace(/ /g, "-")}`}
                              className="hidden md:flex flex-col items-end group"
                            >
                              <p className="text-[9px] font-black uppercase tracking-widest text-primary/20">Artisan Studio</p>
                              <p className="text-xs font-bold text-primary group-hover:text-accent transition-colors">{item.product.artisan.user.name}</p>
                            </Link>

                            <div className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                              item.status === "PENDING" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                              item.status === "SHIPPED" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              "bg-green-50 text-green-600 border-green-200"
                            )}>
                              {item.status}
                            </div>
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
