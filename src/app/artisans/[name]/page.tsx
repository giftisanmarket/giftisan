import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArtisanClient } from "@/components/artisan-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ name: string }>;
}

async function getArtisanBySlug(slug: string) {
  // In a real app, we'd have a slug field. For now, we fetch artisans and match.
  const users = await prisma.user.findMany({
    where: { role: 'ARTISAN' },
    include: {
      artisanProfile: {
        include: {
          products: true,
          user: true
        }
      }
    }
  });

  return users.find(u => u.name?.toLowerCase().replace(/ /g, "-") === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: nameSlug } = await params;
  const user = await getArtisanBySlug(nameSlug);
  
  if (!user || !user.artisanProfile) return { title: "Artisan Not Found" };
  const artisan = user.artisanProfile;

  return {
    title: `${user.name} Studio`,
    description: artisan.bio,
    openGraph: {
      title: `${user.name} | Master Artisan at Giftisan`,
      description: artisan.bio || "",
      images: [artisan.avatar || ""],
    }
  };
}

export default async function ArtisanPage({ params }: Props) {
  const { name: nameSlug } = await params;
  const user = await getArtisanBySlug(nameSlug);
  
  if (!user || !user.artisanProfile) {
    notFound();
  }

  return <ArtisanClient artisan={user.artisanProfile} />;
}
