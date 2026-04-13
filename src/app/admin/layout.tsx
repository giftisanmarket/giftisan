import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Mail, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Artisans & Users", href: "/admin/users", icon: Users },
    { label: "Global Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Site Orders", href: "/admin/orders", icon: Package },
    { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-primary text-white p-8 hidden lg:flex flex-col z-50">
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

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all font-bold group"
            >
              <item.icon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-4">
          <Link href="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/10 transition-all font-bold group text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
