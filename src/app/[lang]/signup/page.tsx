import { SignupClient } from "@/components/signup-client";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common?.join_the_circle || "Join the Circle",
    description: "Become a Giftisan curator or open your own master studio today.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SignupPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return <SignupClient dict={dict} />;
}
