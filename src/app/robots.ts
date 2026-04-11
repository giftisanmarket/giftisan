import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/checkout/", // Don't index the private checkout flow
    },
    sitemap: "https://giftisan.com/sitemap.xml",
  };
}
