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
        take: 6,
        orderBy: { createdAt: "desc" },
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
          products: { where: { status: "APPROVED" }, take: 6, orderBy: { createdAt: "desc" } },
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artisan = await getArtisanBioBySlug(slug);

  if (!artisan) {
    return {
      title: "Artisan Not Found | Giftisan Bio",
    };
  }

  const name = artisan.studioName || artisan.user.name || "Artisan";
  return {
    title: `${name} | Giftisan Bio`,
    description: artisan.bio || `Explore handcrafted creations and bio links for ${name} on Giftisan.`,
    openGraph: {
      title: `${name} | Giftisan Bio Links`,
      description: artisan.bio || `Explore handcrafted creations by ${name}`,
      images: artisan.avatar ? [{ url: artisan.avatar }] : [],
    },
  };
}

export default async function BioPage({ params }: Props) {
  const { slug, lang } = await params;
  const artisan = await getArtisanBioBySlug(slug);

  if (!artisan) {
    notFound();
  }

  return <ArtisanBioView artisan={artisan as any} lang={lang} />;
}
