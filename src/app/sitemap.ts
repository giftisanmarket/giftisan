import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Fetch real data from Prisma
  const [products, artisans] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.artisanProfile.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  // Product URLs
  const productUrls = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Artisan URLs
  const artisanUrls = artisans.map((a) => ({
    url: `${baseUrl}/artisans/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Category URLs
  const categoryNames = [
    "ceramics", "jewelry", "stationery", "vintage", "textiles", 
    "woodwork", "wedding", "personalized", "art-collectibles"
  ];
  const categoryUrls = categoryNames.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Static Core Pages
  const staticPages = [
    { url: baseUrl, priority: 1, changeFrequency: "daily" as const },
    { url: `${baseUrl}/artisans`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${baseUrl}/categories`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/become-artisan`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return [
    ...staticPages,
    ...productUrls,
    ...artisanUrls,
    ...categoryUrls,
  ];
}
