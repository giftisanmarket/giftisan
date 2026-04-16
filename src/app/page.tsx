import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";
import LandingPage from "@/components/landing-page";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Giftisan | Premium Artisanal Marketplace",
  description: "Discover Egypt's most unique handcrafted treasures, vintage finds, and personalized keepsakes. Connect directly with master artisans.",
};

export default async function Home() {
  const session = await auth();

  // If user is not logged in, show the marketing landing page
  if (!session) {
    return <LandingPage />;
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

  return <HomeClient products={sanitizedProducts} artisans={sanitizedArtisans} categoryCounts={categoryCounts} artisanCount={artisanCount} />;
}
