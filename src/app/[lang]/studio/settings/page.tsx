import { Navbar } from "@/components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StudioSettingsClient } from "@/components/studio-settings-client";
import { getArtisanData } from "@/lib/actions";

export default async function StudioSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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
    slug: artisan.slug,
    instagram: artisan.instagram,
    website: artisan.website,
    pinterest: artisan.pinterest,
    tiktok: artisan.tiktok,
    facebook: artisan.facebook,
    brandColor: artisan.brandColor,
    bannerImage: artisan.bannerImage,
    phoneNumber: artisan.phoneNumber,
    user: {
      email: artisan.user.email
    }
  };

  const { getDictionary } = await import("@/app/[lang]/dictionaries");
  const dict = await getDictionary(lang as any);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      <div className="container mx-auto px-4 pt-24 md:pt-40 pb-20">
        <StudioSettingsClient artisan={sanitizedArtisan} dict={dict} />
      </div>
    </main>
  );
}
