import { SignupClient } from "@/components/signup-client";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";

export const metadata: Metadata = {
  title: "Join the Circle | Signup for Giftisan",
  description: "Become a Giftisan curator or open your own master studio today. Join a global community of creators and treasure hunters.",
};

export default async function SignupPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return <SignupClient dict={dict} />;
}
