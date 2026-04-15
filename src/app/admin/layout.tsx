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
import { AdminNavClient } from "@/components/admin-nav-client"; // We'll move the client parts to a client component for pathname access

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
    <div className="flex min-h-screen bg-cream font-sans pb-24 lg:pb-0">
      <AdminNavClient navItems={navItems as any}>
        {children}
      </AdminNavClient>
    </div>
  );
}
