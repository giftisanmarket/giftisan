import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.checkout.order_summary,
    description: dict.checkout.prelaunch_alert_desc,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  return <CheckoutClient dict={dict} />;
}
