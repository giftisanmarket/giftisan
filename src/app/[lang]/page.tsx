import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
const HomeClient = dynamic(() => import("@/components/home-client"), {
  loading: () => <Loading />
});
const LandingPage = dynamic(() => import("@/components/landing-page"), {
  loading: () => <Loading />
});
import { Metadata } from "next";
import { auth } from "@/auth";
import Loading from "./loading";

import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: `${SITE_NAME} | ${dict.home.hero_title || "Premium Artisanal Marketplace"}`,
    description: dict.home.hero_subtitle || SITE_DESCRIPTION,
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const session = await auth();

  // If user is not logged in, show the marketing landing page
  if (!session) {
    return <LandingPage dict={dict} />;
  }

  // If user is logged in, show the marketplace home page
  const products = await prisma.product.findMany({
    where: {
      artisan: {
        status: "APPROVED"
      }
    },
    include: {
      artisan: {
        include: {
          user: true
        }
      }
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      status: "APPROVED"
    },
    include: {
      user: true
    },
    take: 5
  });

  const artisanCount = await prisma.artisanProfile.count({
    where: { status: "APPROVED" }
  });

  // Fetch real counts for the home page category grid
  const categoryNames = [
    "Ceramics", "Jewelry", "Stationery", "Vintage", "Textiles",
    "Woodwork", "Wedding", "Personalized", "Art & Collectibles"
  ];

  const categoryCounts = await Promise.all(
    categoryNames.map(async (name) => {
      const count = await prisma.product.count({
        where: {
          category: {
            equals: name,
            mode: 'insensitive'
          },
          artisan: {
            status: "APPROVED"
          }
        }
      });
      return { name, count };
    })
  );

  // Sanitize data to prevent serialization crashes from oversized images in the DB
  const sanitizedProducts = products.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...p.artisan,
      avatar: (p.artisan.avatar?.length || 0) > 300000 ? "" : p.artisan.avatar
    }
  }));

  const sanitizedArtisans = artisans.map(a => ({
    ...a,
    avatar: (a.avatar?.length || 0) > 300000 ? "" : a.avatar
  }));

  return <HomeClient products={sanitizedProducts} artisans={sanitizedArtisans} categoryCounts={categoryCounts} artisanCount={artisanCount} dict={dict} />;
}
