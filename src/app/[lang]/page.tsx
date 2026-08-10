import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";
import { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const categoryNames = [
    "Ceramics", "Jewelry", "Gift Boxes & Sets", "Stationery", "Vintage", "Textiles", 
    "Woodwork", "Leatherwork", "Culinary Arts", "Beauty & Apothecary", "Metalwork",
    "Glasswork", "Basketry", "Fashion",
    "Wedding", "Personalized", "Art & Collectibles"
  ];

  // Run all database queries concurrently in parallel with Promise.all
  const [products, artisans, artisanCount, categoryCountsRaw] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        artisan: {
          status: "APPROVED"
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        badge: true,
        images: true,
        isFeatured: true,
        category: true,
        artisan: {
          select: {
            id: true,
            studioName: true,
            slug: true,
            avatar: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 6,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),
    prisma.artisanProfile.findMany({
      where: {
        status: "APPROVED"
      },
      select: {
        id: true,
        studioName: true,
        slug: true,
        avatar: true,
        isVerified: true,
        location: true,
        bio: true,
        user: {
          select: {
            name: true
          }
        }
      },
      take: 5
    }),
    prisma.artisanProfile.count({
      where: { status: "APPROVED" }
    }),
    prisma.product.groupBy({
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
    })
  ]);

  // Initialize a map with 0 counts for all official category names (case-insensitive keys)
  const categoryCountsMap = new Map<string, number>();
  categoryNames.forEach(name => {
    categoryCountsMap.set(name.toLowerCase(), 0);
  });

  // Category aliases for custom DB values
  const categoryAliasMap: Record<string, string> = {
    "home decor": "Woodwork",
    "home-decor": "Woodwork",
    "accessories": "Fashion",
    "leatherwork": "Fashion",
    "culinary": "Culinary Arts",
    "beauty": "Beauty & Apothecary"
  };

  // Accumulate counts from the database grouping, translating various database formats back to official names
  categoryCountsRaw.forEach(item => {
    const rawCategory = item.category;
    if (!rawCategory) return;
    
    const normalizedRaw = rawCategory.toLowerCase().trim();
    const aliasedName = categoryAliasMap[normalizedRaw];

    const officialName = aliasedName || categoryNames.find(name => {
      const slug1 = name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      const slug2 = name.toLowerCase().replace(/\s+/g, "-");
      const slug3 = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      return slug1 === normalizedRaw || 
             slug2 === normalizedRaw || 
             slug3 === normalizedRaw || 
             name.toLowerCase() === normalizedRaw;
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
