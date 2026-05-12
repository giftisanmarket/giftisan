import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { PayoutsManagerClient } from "@/components/admin/payouts-manager-client";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  return {
    title: `${(dict.admin as any)?.payouts || "Payouts Management"} | Admin`,
  };
}

export default async function AdminPayoutsPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch pending payouts
  const pendingPayouts = await prisma.artisanTransaction.findMany({
    where: {
      type: "PAYOUT",
      status: "PENDING"
    },
    include: {
      artisan: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Fetch past payouts (last 100)
  const pastPayouts = await prisma.artisanTransaction.findMany({
    where: {
      type: "PAYOUT",
      status: {
        in: ["COMPLETED", "FAILED"]
      }
    },
    include: {
      artisan: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  return (
    <PayoutsManagerClient 
      pendingPayouts={pendingPayouts} 
      pastPayouts={pastPayouts} 
      dict={dict} 
      lang={lang} 
    />
  );
}
