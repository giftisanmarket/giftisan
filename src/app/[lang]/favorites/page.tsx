import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import FavoritesClient from "@/components/favorites-client";
import { Metadata } from "next";
import { getAllArtisans } from "@/lib/actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.home.favorites_title || "Your Favorites",
    description: "Your curated collection of artisanal products.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function FavoritesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const artisans = await getAllArtisans();

  return <FavoritesClient dict={dict} allArtisans={artisans} />;
}
