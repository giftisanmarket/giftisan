import { LoginClient } from "@/components/login-client";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common?.login || "Login",
    description: "Access your artisan studio or customer profile to discover and manage handcrafted products.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return <LoginClient dict={dict} />;
}
