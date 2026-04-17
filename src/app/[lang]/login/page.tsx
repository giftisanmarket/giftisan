import { LoginClient } from "@/components/login-client";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";

export const metadata: Metadata = {
  title: "Login | Join the Giftisan Circle",
  description: "Access your artisan studio or customer profile to discover and manage handcrafted treasures.",
};

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return <LoginClient dict={dict} />;
}
