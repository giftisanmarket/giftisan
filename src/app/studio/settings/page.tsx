import { Navbar } from "@/components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StudioSettingsClient } from "@/components/studio-settings-client";
import { getArtisanData } from "@/lib/actions";

export default async function StudioSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const artisan = await getArtisanData(session.user.id as string);
  if (!artisan) redirect("/studio");

  // Aggressively sanitize artisan to prevent serialization crashes from deep nesting (products/reviews)
  const sanitizedArtisan = {
    userId: artisan.userId,
    studioName: artisan.studioName,
    bio: artisan.bio,
    location: artisan.location,
    avatar: artisan.avatar,
    instagram: artisan.instagram,
    website: artisan.website,
    pinterest: artisan.pinterest,
    tiktok: artisan.tiktok,
    facebook: artisan.facebook,
    user: {
      email: artisan.user.email
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <StudioSettingsClient artisan={sanitizedArtisan} />
      </div>
    </main>
  );
}
