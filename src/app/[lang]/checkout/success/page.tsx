import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { SuccessClient } from "@/components/success-client";

export default async function SuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  return <SuccessClient dict={dict} lang={lang} />;
}
