import { MOCK_PRODUCTS } from "@/lib/data";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://giftisan.com";

  // Product URLs
  const productUrls = MOCK_PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Artisan URLs
  const artisanUrls = Array.from(new Set(MOCK_PRODUCTS.map(p => p.artisan.name))).map((name) => ({
    url: `${baseUrl}/artisans/${name.toLowerCase().replace(/ /g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Category URLs
  const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category.toLowerCase())));
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...productUrls,
    ...artisanUrls,
    ...categoryUrls,
  ];
}
