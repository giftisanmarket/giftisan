import { getSubscribers } from "@/lib/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSubscribersClient } from "@/components/admin/admin-subscribers-client";
import { Metadata } from "next";
import { getDictionary } from "../../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.newsletter_title || "Subscribers"} | ${dict.admin?.marketplace || "Platform"}`,
  };
}

export default async function AdminSubscribersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const rawSubscribers = await getSubscribers();
  const subscribers = rawSubscribers.map(sub => ({
    ...sub,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt
  }));

  return <AdminSubscribersClient initialSubscribers={subscribers} dict={dict} lang={lang} />;
}
