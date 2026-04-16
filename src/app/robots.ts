import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout/", 
        "/admin/", 
        "/profile/", 
        "/studio/", 
        "/api/",
        "/reset-password",
        "/forgot-password"
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
