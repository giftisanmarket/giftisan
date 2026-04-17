import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminNavClient } from "@/components/admin-nav-client"; // We'll move the client parts to a client component for pathname access

import { getDictionary } from "../dictionaries";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const dict = await getDictionary(lang as any);

  return (
    <div className="flex min-h-screen bg-cream font-sans pb-24 lg:pb-0">
      <AdminNavClient dict={dict}>
        {children}
      </AdminNavClient>
    </div>
  );
}
