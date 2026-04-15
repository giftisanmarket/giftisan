import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="flex min-h-screen bg-cream font-sans pb-24 lg:pb-0">
      <AdminNavClient>
        {children}
      </AdminNavClient>
    </div>
  );
}
