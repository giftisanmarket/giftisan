import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";

export default async function Home() {
  const products = await prisma.product.findMany({
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
    include: {
      user: true
    },
    take: 5
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
          } 
        }
      });
      return { name, count };
    })
  );

  return <HomeClient products={products} artisans={artisans} categoryCounts={categoryCounts} />;
}
