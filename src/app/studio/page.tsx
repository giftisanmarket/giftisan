import { auth } from "@/auth";
import { getArtisanData, getArtisanSales, getArtisanReviews } from "@/lib/actions";
import { StudioClient } from "@/components/studio-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisan Studio Dashboard",
  description: "Manage your handcrafted treasures and engage with the Giftisan community.",
};

export default async function StudioPage() {
  const session = await auth();

  // Basic Auth Check
  if (!session?.user) {
    redirect("/login?callbackUrl=/studio");
  }

  // Role Check - Only Artisans can access the studio
  if (session.user.role !== "ARTISAN") {
    redirect("/profile"); // Redirect regular clients to their profile
  }

  const artisan = await getArtisanData(session.user.id as string);

  if (!artisan) {
    // This shouldn't happen if they have the role, but just in case
    redirect("/profile");
  }

  const [sales, reviews] = await Promise.all([
    getArtisanSales(artisan.id),
    getArtisanReviews(artisan.id)
  ]);

  return <StudioClient artisan={artisan} sales={sales} reviews={reviews} />;
}
