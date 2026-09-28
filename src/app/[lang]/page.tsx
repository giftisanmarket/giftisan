import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";
import { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  return {
    title: {
      absolute: dict.seo.title
    },
    description: dict.seo.description || SITE_DESCRIPTION,
  };
}

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  stock: true,
  badge: true,
  images: true,
  isFeatured: true,
  category: true,
  canPersonalize: true,
  requiresClientImage: true,
  variants: true,
  artisan: {
    select: {
      id: true,
      studioName: true,
      slug: true,
      avatar: true,
      user: {
        select: {
          name: true
        }
      }
    }
  }
};

function sanitizeProducts(productsList: any[]) {
  return productsList.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...p.artisan,
      avatar: (p.artisan?.avatar?.length || 0) > 300000 ? "" : p.artisan?.avatar
    }
  }));
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);

  // Fetch categorized product rows concurrently — matched to actual DB categories
  const [
    featuredProducts,      // all approved, newest first (hero row)
    bagProducts,           // bags-and-purses (15 in DB)
    homeDecorProducts,     // home-and-living (14 in DB)
    apparelProducts,       // clothing + accessories (13 in DB combined)
    giftSetProducts,       // gifts-sets + toys-and-games + weddings (7 in DB)
    artisanCount
  ] = await Promise.all([
    // 1. Top Picks — all approved products, newest first (10 items)
    prisma.product.findMany({
      where: { status: "APPROVED" },
      select: productSelect,
      take: 10,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 2. Handcrafted Bags & Accessories (bags-and-purses)
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { in: ["bags-and-purses"], mode: "insensitive" }
      },
      select: productSelect,
      take: 8,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 3. Artisan Home & Living (home-and-living)
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { in: ["home-and-living", "woodwork", "ceramics", "accessories"], mode: "insensitive" }
      },
      select: productSelect,
      take: 8,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 4. Fashion, Clothing & Wearables
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { in: ["clothing", "fashion", "textiles", "jewelry"], mode: "insensitive" }
      },
      select: productSelect,
      take: 8,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 5. Gifts, Toys & Celebrations
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { in: ["gifts-sets", "toys-and-games", "weddings", "gifts"], mode: "insensitive" }
      },
      select: productSelect,
      take: 8,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // Artisan Count
    prisma.artisanProfile.count({
      where: { status: "APPROVED" }
    })
  ]);

  return (
    <HomeClient
      featuredProducts={sanitizeProducts(featuredProducts)}
      bagProducts={sanitizeProducts(bagProducts)}
      homeDecorProducts={sanitizeProducts(homeDecorProducts)}
      apparelProducts={sanitizeProducts(apparelProducts)}
      giftSetProducts={sanitizeProducts(giftSetProducts)}
      artisanCount={artisanCount}
      dict={dict}
    />
  );
}

