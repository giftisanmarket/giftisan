import { CategoriesClient } from "@/components/categories-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
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

  return <CategoriesClient categories={categories} />;
}
