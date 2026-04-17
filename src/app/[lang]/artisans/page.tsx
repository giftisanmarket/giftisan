import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllArtisans } from "@/lib/actions";
import { ArtisansClient } from "@/components/artisans-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.home.artisans_registry,
    description: dict.home.artisans_desc,
  };
}

export default async function ArtisansPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const artisans = await getAllArtisans();

  return <ArtisansClient artisans={artisans} dict={dict} />;
}
