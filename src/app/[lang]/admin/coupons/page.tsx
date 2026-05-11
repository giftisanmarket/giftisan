import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Metadata } from "next";
import { CouponsClient } from "@/components/admin/coupons-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as any)) as any;
  return {
    title: `${dict.admin?.coupons || "Manage Promo Coupons"} | Giftisan Admin`,
  };
}

export default async function AdminCouponsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const dict = (await getDictionary(lang as any)) as any;

  // Fetch all coupons from the database
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Calculate high-fidelity stats
  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.isActive).length,
    totalRedemptions: coupons.reduce((sum, c) => sum + c.usedCount, 0),
  };

  // Convert Date fields to ISO strings safely for Client Component serialization
  const serializedCoupons = coupons.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null
  }));

  return (
    <CouponsClient 
      initialCoupons={serializedCoupons} 
      stats={stats} 
      dict={dict} 
      lang={lang} 
    />
  );
}
