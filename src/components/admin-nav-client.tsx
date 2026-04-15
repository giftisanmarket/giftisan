"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";

export function AdminNavClient({ 
  navItems, 
  children 
}: { 
  navItems: any[], 
  children: React.ReactNode 
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-primary text-white flex items-center justify-between px-6 z-[100] border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-white/20 shadow-lg">
             <Image src="/icon.png" alt="" fill className="object-cover" />
          </div>
          <span className="font-heading font-black tracking-tighter text-xl">Admin</span>
        </div>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-accent px-4 py-2 bg-white/5 rounded-full border border-white/10 active:scale-95 transition-all">
           Exit
        </Link>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-primary text-white p-8 hidden lg:flex flex-col z-50 shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-3 mb-16 px-4">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/20 shadow-xl">
             <Image
              src="/icon.png"
              alt="Giftisan Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-heading font-black tracking-tighter">Giftisan <span className="text-[10px] text-accent font-black uppercase tracking-widest block leading-none">Admin</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group active:scale-95",
                  isActive 
                    ? "bg-white text-primary shadow-xl shadow-white/5" 
                    : "hover:bg-white/10 text-white/60 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110 opacity-100" : "opacity-40 group-hover:opacity-100 group-hover:scale-110")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-4">
          <Link href="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all font-bold group text-white/60 hover:text-white active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-primary/95 text-white rounded-2xl z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-2 border border-white/10 backdrop-blur-xl">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all transition-transform active:scale-125",
                isActive ? "text-accent scale-110" : "text-white/40 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[6px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-accent mt-0.5 animate-pulse" />}
            </Link>
          );
        })}
        {(() => {
          const isActive = pathname === "/admin/subscribers";
          return (
            <Link 
              href="/admin/subscribers" 
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all transition-transform active:scale-125",
                isActive ? "text-accent scale-110" : "text-white/40 hover:text-white"
              )}
            >
               <Mail className="w-5 h-5" />
               <span className="text-[6px] font-black uppercase tracking-widest">Subs</span>
               {isActive && <div className="w-1 h-1 rounded-full bg-accent mt-0.5 animate-pulse" />}
            </Link>
          );
        })()}
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 pt-24 lg:pt-0">
        <div className="p-5 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </>
  );
}
