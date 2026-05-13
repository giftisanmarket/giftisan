import { getAllOrders } from "@/lib/actions";
import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import { AdminOrdersClient } from "@/components/admin/admin-orders-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.global_orders_title || "Orders"} | ${dict.admin?.marketplace || "Platform"}`,
  };
}

export default async function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const orders = await getAllOrders();

  return <AdminOrdersClient orders={orders} dict={dict} />;
}
