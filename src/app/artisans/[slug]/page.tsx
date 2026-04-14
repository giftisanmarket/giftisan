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

  if (artisanBySlug) return { 
    artisanProfile: artisanBySlug, 
    name: artisanBySlug.studioName || artisanBySlug.user.name 
  };

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
  return matchingUser ? { 
    artisanProfile: matchingUser.artisanProfile, 
    name: matchingUser.artisanProfile?.studioName || matchingUser.name 
  } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArtisanBySlug(slug);
  
  if (!data || !data.artisanProfile) return { title: "Artisan Not Found" };
  const artisan = data.artisanProfile;

  const description = artisan.bio || `Explore the handcrafted world of ${data.name}. Discover unique treasures made with passion.`;
  const keywords = [data.name, artisan.studioName, artisan.location, "Artisan", "Handmade", "Giftisan"].filter(Boolean) as string[];
  
  const siteUrl = process.env.NEXTAUTH_URL || "https://www.giftisan.com";
  const ogImage = artisan.bannerImage || artisan.avatar || `${siteUrl}/api/image/artisan/${artisan.id}`;

  return {
    title: `${data.name} Studio`,
    description: description.slice(0, 160),
    keywords,
    alternates: {
      canonical: `${siteUrl}/artisans/${slug}`,
    },
    openGraph: {
      title: `${data.name} | Master Artisan at Giftisan`,
      description: description.slice(0, 160),
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `The ${data.name} Studio`
      }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} | Giftisan Artisan`,
      description: description.slice(0, 160),
      images: [ogImage],
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
