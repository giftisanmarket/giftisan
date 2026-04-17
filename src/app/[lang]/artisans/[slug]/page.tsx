import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArtisanClient } from "@/components/artisan-client";
import { notFound } from "next/navigation";



async function getArtisanBySlug(slug: string) {
  // Try to find by the new slug field first
  const artisanBySlug = await prisma.artisanProfile.findFirst({
    where: { 
      slug: slug,
      status: "APPROVED"
    },
    include: {
      products: {
        include: {
          reviews: true,
          orderItems: true
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
    where: { 
      role: 'ARTISAN',
      artisanProfile: {
        status: 'APPROVED'
      }
    },
    include: {
      artisanProfile: {
        include: {
          products: {
            include: {
              reviews: true,
              orderItems: true
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

import { getDictionary, hasLocale } from "../../dictionaries";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string, lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  const data = await getArtisanBySlug(slug);
  
  if (!data || !data.artisanProfile) return { title: "Not Found" };
  const artisan = data.artisanProfile;

  const description = artisan.bio || `${dict.home.category_desc_prefix} ${data.name}. Discover unique treasures made with passion.`;
  const keywords = [data.name, artisan.studioName, artisan.location, "Artisan", "Handmade", "Giftisan"].filter(Boolean) as string[];
  
  const ogImage = artisan.bannerImage || artisan.avatar || `${SITE_URL}/api/image/artisan/${artisan.id}`;

  return {
    title: `${data.name} | Giftisan`,
    description: description.slice(0, 160),
    keywords,
    alternates: {
      canonical: `${SITE_URL}/${lang}/artisans/${slug}`,
      languages: {
        "en-US": `${SITE_URL}/en/artisans/${slug}`,
        "ar-EG": `${SITE_URL}/ar/artisans/${slug}`,
      }
    },
    openGraph: {
      title: `${data.name} | Giftisan`,
      description: description.slice(0, 160),
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `The ${data.name} Studio`
      }],
      type: "profile",
    }
  };
}

export default async function ArtisanPage({ params }: Props) {
  const { slug, lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  
  const data = await getArtisanBySlug(slug);
  
  if (!data || !data.artisanProfile) {
    notFound();
  }

  return <ArtisanClient artisan={data.artisanProfile} dict={dict} />;
}
