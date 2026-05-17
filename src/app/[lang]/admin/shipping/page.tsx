import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AdminShippingClient } from "@/components/admin/admin-shipping-client";
import { getAllShippingMethods } from "@/lib/actions";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: `Shipping Management | Giftisan Admin`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminShippingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    notFound();
  }
  
  const dict = await getDictionary(lang as any);
  const initialMethods = await getAllShippingMethods();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminShippingClient 
        initialMethods={initialMethods} 
        dict={dict} 
      />
    </div>
  );
}
