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

  return <HomeClient products={products} artisans={artisans} />;
}
