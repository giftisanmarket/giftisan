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
    "Ceramics", "Jewelry", "Stationery", "Vintage", "Textiles", 
    "Woodwork", "Wedding", "Personalized", "Art & Collectibles"
  ];

  // Fetch real counts for each category
  const categories = await Promise.all(
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
