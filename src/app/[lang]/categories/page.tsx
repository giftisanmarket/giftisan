import { CategoriesClient } from "@/components/categories-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Explore our diverse range of artisanal categories, from handcrafted ceramics to bespoke jewelry.",
};

export const dynamic = "force-dynamic";

import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as any);
  
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

  return <CategoriesClient categories={categories} dict={dict} />;
}
