import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArtisanClient } from "@/components/artisan-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArtisanBySlug(slug: string) {
  // Try to find by the new slug field first
  const artisanBySlug = await prisma.artisanProfile.findFirst({
    where: { slug: slug },
    include: {
      products: {
        include: {
          reviews: true
        }
      },
      user: true
    }
  });

  if (artisanBySlug) return { artisanProfile: artisanBySlug, name: artisanBySlug.user.name };

  // Fallback: match by name (old behavior)
  const users = await prisma.user.findMany({
    where: { role: 'ARTISAN' },
    include: {
      artisanProfile: {
        include: {
          products: {
            include: {
              reviews: true
            }
          },
          user: true
        }
      }
    }
  });

  const matchingUser = users.find(u => u.name?.toLowerCase().replace(/ /g, "-") === slug);
  return matchingUser ? { artisanProfile: matchingUser.artisanProfile, name: matchingUser.name } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArtisanBySlug(slug);
  
  if (!data || !data.artisanProfile) return { title: "Artisan Not Found" };
  const artisan = data.artisanProfile;

  return {
    title: `${data.name} Studio`,
    description: artisan.bio,
    openGraph: {
      title: `${data.name} | Master Artisan at Giftisan`,
      description: artisan.bio || "",
      images: [artisan.avatar || ""],
    }
  };
}

export default async function ArtisanPage({ params }: Props) {
  const { slug } = await params;
  const data = await getArtisanBySlug(slug);
  
  if (!data || !data.artisanProfile) {
    notFound();
  }

  return <ArtisanClient artisan={data.artisanProfile} />;
}
