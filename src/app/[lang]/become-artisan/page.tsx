import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BecomeArtisanClient from "./BecomeArtisanClient";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.home.become_artisan_title,
    description: dict.home.become_artisan_desc,
  };
}

export default async function BecomeArtisanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  const session = await auth();

  // If user is already an artisan, redirect them to the studio on the server
  // This avoids the client-side loading flash and transition screen
  if (session?.user?.role === "ARTISAN") {
    redirect(`/${lang}/studio`);
  }

  return <BecomeArtisanClient dict={dict} />;
}
