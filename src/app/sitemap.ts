import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Fetch real data from Prisma
  const [products, artisans] = await Promise.all([
    prisma.product.findMany({ 
      where: { status: "APPROVED", artisan: { status: "APPROVED" } },
      select: { id: true, slug: true, updatedAt: true } 
    }),
    prisma.artisanProfile.findMany({ 
      where: { status: "APPROVED" },
      select: { id: true, slug: true, updatedAt: true } 
    }),
  ]);

  const locales = ["en", "ar"];

  // Static Core Pages
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/artisans", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/categories", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/become-artisan", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
  ].flatMap(page => 
    locales.map(lang => ({
      url: `${baseUrl}/${lang}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  // Product URLs
  const productUrls = products.flatMap((p) => 
    locales.map(lang => ({
      url: `${baseUrl}/${lang}/products/${p.slug || p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // Artisan URLs
  const artisanUrls = artisans.flatMap((a) => 
    locales.map(lang => ({
      url: `${baseUrl}/${lang}/artisans/${a.slug || a.id}`,
      lastModified: a.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }))
  );

  // Category URLs
  const categoryNames = [
    "ceramics", "jewelry", "stationery", "vintage", "textiles", 
    "woodwork", "wedding", "personalized", "art-collectibles"
  ];
  const categoryUrls = categoryNames.flatMap((cat) => 
    locales.map(lang => ({
      url: `${baseUrl}/${lang}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [
    ...staticPages,
    ...productUrls,
    ...artisanUrls,
    ...categoryUrls,
  ];
}
