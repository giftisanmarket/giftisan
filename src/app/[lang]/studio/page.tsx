import { auth } from "@/auth";
import { getArtisanData, getArtisanSales, getArtisanReviews } from "@/lib/actions";
import { StudioClient } from "@/components/studio-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";


import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: dict.studio.dashboard,
    description: "Manage your handcrafted treasures and engage with the Giftisan community.",
  };
}

export default async function StudioPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ artisanUserId?: string }> 
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  
  const session = await auth();
  const searchParamsValue = await searchParams; // Await the promise
  const { artisanUserId } = searchParamsValue;

  // Basic Auth Check
  if (!session?.user) {
    redirect(`/login?callbackUrl=/${lang}/studio`);
  }

  // Admins can view any studio, Artisans can only view their own
  const isAdmin = session.user.role === "ADMIN";
  const isArtisan = session.user.role === "ARTISAN";

  if (!isAdmin && !isArtisan) {
    redirect(`/${lang}/profile`);
  }

  // Determine which user's studio to fetch
  const targetUserId = (isAdmin && artisanUserId) 
    ? artisanUserId 
    : session.user.id;

  const artisan = await getArtisanData(targetUserId as string);

  if (!artisan) {
    redirect(isAdmin ? `/${lang}/admin/users` : `/${lang}/profile`);
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
        dict={dict}
      />
    </div>
  );
}
