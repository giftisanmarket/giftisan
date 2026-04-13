import { auth } from "@/auth";
import { getArtisanData } from "@/lib/actions";
import { NewProductClient } from "@/components/new-product-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List a New Treasure",
  description: "Share your handcrafted masterpiece with the global Giftisan community.",
};

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/studio/new-product");
  }

  if (session.user.role !== "ARTISAN") {
    redirect("/profile");
  }

  const artisan = await getArtisanData(session.user.id as string);

  if (!artisan) {
    redirect("/profile");
  }

  return <NewProductClient artisanId={artisan.id} />;
}
