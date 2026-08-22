import { ForgotPasswordClient } from "@/components/forgot-password-client";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.auth.forgot_password_title,
    description: "Reset your Giftisan password to continue discovering unique handcrafted products.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  
  return <ForgotPasswordClient dict={dict} />;
}
