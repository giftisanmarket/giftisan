import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { ContactClient } from "@/components/contact-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common?.support || "Contact Us",
    description: "Get in touch with the Giftisan team for support, inquiries, and feedback.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return notFound();
  
  const dict = await getDictionary(lang as any);
  
  return <ContactClient dict={dict} />;
}
