import { ResetPasswordClient } from "@/components/reset-password-client";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.auth.reset_password_page_title,
    description: "Create a new secure password for your Giftisan account.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  
  return <ResetPasswordClient dict={dict} />;
}
