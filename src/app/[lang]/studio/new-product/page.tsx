import { auth } from "@/auth";
import { getArtisanData } from "@/lib/actions";
import { NewProductClient } from "@/components/new-product-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const { getDictionary } = await import("@/app/[lang]/dictionaries");
  const dict = await getDictionary(lang as any);
  return {
    title: dict.studio?.add_treasure || "List a New Treasure",
    description: dict.studio?.manage_inventory_desc || "Share your handcrafted masterpiece with the global Giftisan community.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NewProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/login?callbackUrl=/${lang}/studio/new-product`);
  }

  if (session.user.role !== "ARTISAN") {
    redirect(`/${lang}/profile`);
  }

  const artisan = await getArtisanData(session.user.id as string);

  if (!artisan) {
    redirect(`/${lang}/profile`);
  }

  const { getDictionary } = await import("@/app/[lang]/dictionaries");
  const dict = await getDictionary(lang as any);

  return <NewProductClient artisanId={artisan.id} dict={dict} />;
}
