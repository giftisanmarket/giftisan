import { CategoriesClient } from "@/components/categories-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common.all_categories || "Browse Categories",
    description: dict.home.category_desc || "Explore our diverse range of artisanal categories.",
  };
}

export const dynamic = "force-dynamic";

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
