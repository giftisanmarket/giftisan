import { CategoriesClient } from "@/components/categories-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common.all_categories || "Browse Categories",
    description: dict.home.category_desc || "Explore our diverse range of artisanal categories.",
    alternates: {
      canonical: `${SITE_URL}/${lang}/categories`,
      languages: {
        "en-US": `${SITE_URL}/en/categories`,
        "ar-EG": `${SITE_URL}/ar/categories`,
      }
    },
    openGraph: {
      title: dict.common.all_categories || "Browse Categories",
      description: dict.home.category_desc || "Explore our diverse range of artisanal categories.",
      images: [`${SITE_URL}/hero.webp`],
    }
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": dict.common?.home || "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": dict.common?.all_categories || "Categories",
        "item": `${SITE_URL}/${lang}/categories`
      }
    ]
  };

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

  const categories = categoryNames
    .map(name => ({
      name,
      count: categoryCountsMap.get(name.toLowerCase()) || 0
    }))
    .sort((a, b) => b.count - a.count);




  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoriesClient categories={categories} dict={dict} />
    </>
  );
}
