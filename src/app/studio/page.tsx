import { auth } from "@/auth";
import { getArtisanData, getArtisanSales, getArtisanReviews } from "@/lib/actions";
import { StudioClient } from "@/components/studio-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisan Studio Dashboard",
  description: "Manage your handcrafted treasures and engage with the Giftisan community.",
};

export default async function StudioPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ artisanUserId?: string }> 
}) {
  const session = await auth();
  const searchParamsValue = await searchParams; // Await the promise
  const { artisanUserId } = searchParamsValue;

  // Basic Auth Check
  if (!session?.user) {
    redirect("/login?callbackUrl=/studio");
  }

  // Admins can view any studio, Artisans can only view their own
  const isAdmin = session.user.role === "ADMIN";
  const isArtisan = session.user.role === "ARTISAN";

  if (!isAdmin && !isArtisan) {
    redirect("/profile");
  }

  // Determine which user's studio to fetch
  // Admins can override via query param, artisans always see their own
  const targetUserId = (isAdmin && artisanUserId) 
    ? artisanUserId 
    : session.user.id;

  const artisan = await getArtisanData(targetUserId as string);

  if (!artisan) {
    // If an admin tries to view a non-existent studio, or artisan profile is missing
    redirect(isAdmin ? "/admin/users" : "/profile");
  }

  const [sales, reviews] = await Promise.all([
    getArtisanSales(artisan.id),
    getArtisanReviews(artisan.id)
  ]);

  return (
    <div className="relative">
      {isAdmin && artisanUserId && (
        <div className="bg-accent text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-widest sticky top-0 z-[100] shadow-lg">
          ADMIN PREVIEW MODE: Viewing {artisan.studioName || artisan.user.name}&apos;s Studio
        </div>
      )}
      <StudioClient 
        artisan={artisan} 
        sales={sales} 
        reviews={reviews} 
        isAdminPreview={!!(isAdmin && artisanUserId)}
      />
    </div>
  );
}
