import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giftisan | Home of Handcrafted Treasures",
  description: "Explore a curated collection of artisanal gifts, bespoke jewelry, and unique handcrafted items from the world's most talented creators.",
};

export default async function Home() {
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
