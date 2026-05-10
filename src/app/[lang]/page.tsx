import { prisma } from "@/lib/prisma";
import nextDynamic from "next/dynamic";
const HomeClient = nextDynamic(() => import("@/components/home-client"), {
  loading: () => <Loading />
});
import { Metadata } from "next";
import { auth } from "@/auth";
import Loading from "./loading";

import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export const revalidate = 60;


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: {
      absolute: dict.seo.title
    },
    description: dict.seo.description || SITE_DESCRIPTION,
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  // Removed session check to show marketplace home to everyone

  // If user is logged in, show the community platform home page
  const products = await prisma.product.findMany({
    where: {
      status: "APPROVED",
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
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' }
    ]
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
    "Ceramics", "Jewelry", "Gift Boxes & Sets", "Stationery", "Vintage", "Textiles", 
    "Woodwork", "Leatherwork", "Culinary Arts", "Beauty & Apothecary", "Metalwork",
    "Glasswork", "Basketry", "Fashion",
    "Wedding", "Personalized", "Art & Collectibles"
  ];

  const categoryCountsRaw = await prisma.product.groupBy({
    by: ['category'],
    where: {
      status: "APPROVED",
      artisan: {
        status: "APPROVED"
      }
    },
    _count: {
      _all: true
    }
  });

  // Initialize a map with 0 counts for all official category names (case-insensitive keys)
  const categoryCountsMap = new Map<string, number>();
  categoryNames.forEach(name => {
    categoryCountsMap.set(name.toLowerCase(), 0);
  });

  // Accumulate counts from the database grouping, translating various database formats back to official names
  categoryCountsRaw.forEach(item => {
    const rawCategory = item.category;
    if (!rawCategory) return;
    
    const officialName = categoryNames.find(name => {
      const slug1 = name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      const slug2 = name.toLowerCase().replace(/\s+/g, "-");
      const slug3 = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      return slug1 === rawCategory.toLowerCase() || 
             slug2 === rawCategory.toLowerCase() || 
             slug3 === rawCategory.toLowerCase() || 
             name.toLowerCase() === rawCategory.toLowerCase();
    }) || rawCategory;

    const currentCount = categoryCountsMap.get(officialName.toLowerCase()) || 0;
    categoryCountsMap.set(officialName.toLowerCase(), currentCount + item._count._all);
  });

  const categoryCounts = categoryNames
    .map(name => ({
      name,
      count: categoryCountsMap.get(name.toLowerCase()) || 0
    }))
    .sort((a, b) => b.count - a.count);




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
