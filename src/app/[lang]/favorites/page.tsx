import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import FavoritesClient from "@/components/favorites-client";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: `${dict.home.favorites_title || "Your Favorites"} | Giftisan`,
    description: "Your curated collection of artisanal treasures.",
  };
}

export default async function FavoritesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);

  return <FavoritesClient dict={dict} />;
}
