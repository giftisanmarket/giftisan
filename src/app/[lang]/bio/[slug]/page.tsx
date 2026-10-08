import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { ArtisanBioView } from "@/components/bio/ArtisanBioView";

const getArtisanBioBySlug = cache(async (rawSlug: string) => {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug).trim();
  } catch (e) {
    console.error("Failed to decode bio slug:", e);
  }

  const artisan = await prisma.artisanProfile.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        { slug: rawSlug },
        { id: rawSlug },
        { slug: { equals: decodedSlug, mode: "insensitive" } },
      ],
      status: { in: ["APPROVED", "PENDING"] },
    },
    include: {
      user: {
        select: { name: true, image: true },
      },
      bioLinks: {
        orderBy: { order: "asc" },
      },
      products: {
        where: { status: "APPROVED" },
        include: {
          reviews: { select: { rating: true } },
          orderItems: {
            where: {
              order: {
                status: { notIn: ["PENDING", "CANCELLED", "REFUNDED"] },
              },
            },
            select: { id: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: "desc" },
        ],
        take: 50,
      },
    },
  });

  if (artisan) return artisan;

  // Fallback match by user name slug
  const users = await prisma.user.findMany({
    where: {
      role: "ARTISAN",
      artisanProfile: {
        status: { in: ["APPROVED", "PENDING"] },
      },
    },
    include: {
      artisanProfile: {
        include: {
          user: { select: { name: true, image: true } },
          bioLinks: { orderBy: { order: "asc" } },
          products: {
            where: { status: "APPROVED" },
            include: {
              reviews: { select: { rating: true } },
              orderItems: {
                where: {
                  order: {
                    status: { notIn: ["PENDING", "CANCELLED", "REFUNDED"] },
                  },
                },
                select: { id: true },
              },
            },
            orderBy: [
              { isFeatured: "desc" },
              { createdAt: "desc" },
            ],
            take: 50,
          },
        },
      },
    },
  });

  const matchingUser = users.find(
    (u) => u.name?.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );

  return matchingUser?.artisanProfile || null;
});

interface Props {
  params: Promise<{ slug: string; lang: string }>;
}

import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { auth } from "@/auth";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const artisan = await getArtisanBioBySlug(slug);

  if (!artisan) {
    return {
      title: "Artisan Not Found | Giftisan Bio",
      robots: { index: false, follow: false },
    };
  }

  const isApproved = artisan.status === "APPROVED";
  if (!isApproved) {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = session?.user?.id === artisan.userId;
    if (!isAdmin && !isOwner) {
      return {
        title: "Artisan Not Found | Giftisan Bio",
        robots: { index: false, follow: false },
      };
    }
  }

  const name = artisan.studioName || artisan.user.name || "Artisan";
  const bioDesc = artisan.bio || `Explore handcrafted creations and bio links for ${name} on Giftisan.`;
  
  const getAbsoluteUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const ogImage = getAbsoluteUrl(artisan.avatar || artisan.bannerImage) || `${SITE_URL}/hero.webp`;

  return {
    title: `${name} | Giftisan Bio`,
    description: bioDesc.slice(0, 160),
    robots: isApproved ? { index: true, follow: true } : { index: false, follow: false },
    alternates: {
      canonical: `${SITE_URL}/${lang}/bio/${slug}`,
    },
    openGraph: {
      title: `${name} | ${SITE_NAME} Studio Bio`,
      description: bioDesc.slice(0, 160),
      url: `${SITE_URL}/${lang}/bio/${slug}`,
      siteName: SITE_NAME,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${name} Studio`
      }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${SITE_NAME} Studio Bio`,
      description: bioDesc.slice(0, 160),
      images: [ogImage],
    }
  };
}

export default async function BioPage({ params }: Props) {
  const { slug, lang } = await params;
  const artisan = await getArtisanBioBySlug(slug);

  if (!artisan) {
    notFound();
  }

  if (artisan.status !== "APPROVED") {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = session?.user?.id === artisan.userId;
    if (!isAdmin && !isOwner) {
      notFound();
    }
  }

  return <ArtisanBioView artisan={artisan as any} lang={lang} />;
}
