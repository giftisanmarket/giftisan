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

  // Fetch categorized product rows concurrently in parallel
  const [
    featuredProducts,
    personalizedProducts,
    textileFashionProducts,
    homeDecorProducts,
    artisanCount
  ] = await Promise.all([
    // 1. Top Featured & Best Finds (10 items = 2 complete 5-card rows)
    prisma.product.findMany({
      where: {
        status: "APPROVED"
      },
      select: productSelect,
      take: 10,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 2. Personalized & Bespoke Gifts (5 items = 1 full row)
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { canPersonalize: true },
          { requiresClientImage: true },
          { category: { contains: "personalized", mode: "insensitive" } }
        ]
      },
      select: productSelect,
      take: 5,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 3. Handcrafted Textiles & Wearables (5 items = 1 full row)
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { in: ["fashion", "textiles", "apparel", "wearables"], mode: "insensitive" }
      },
      select: productSelect,
      take: 5,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),

    // 4. Authentic Handcrafted Woodwork (5 items = 1 full row)
    prisma.product.findMany({
      where: {
        status: "APPROVED",
        category: { equals: "woodwork", mode: "insensitive" }
      },
      select: productSelect,
      take: 5,
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
      personalizedProducts={sanitizeProducts(personalizedProducts)}
      textileFashionProducts={sanitizeProducts(textileFashionProducts)}
      homeDecorProducts={sanitizeProducts(homeDecorProducts)}
      artisanCount={artisanCount}
      dict={dict}
    />
  );
}
