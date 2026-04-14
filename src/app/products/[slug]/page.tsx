import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ProductClient } from "@/components/product-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: slug },
        { slug: slug }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      images: true,
      slug: true
    }
  });
  
  if (!product) return { title: "Product Not Found" };

  const firstImage = Array.isArray(product.images) && product.images[0] ? product.images[0] : `https://www.giftisan.com/api/image/product/${product.id}`;
  const description = product.description.slice(0, 160);
  const siteUrl = process.env.NEXTAUTH_URL || "https://www.giftisan.com";

  return {
    title: product.name,
    description: description,
    keywords: [product.name, product.category, "Handcrafted", "Giftisan"],
    alternates: {
      canonical: `${siteUrl}/products/${product.slug || product.id}`,
    },
    openGraph: {
      title: `${product.name} | Giftisan`,
      description: description,
      images: [{
        url: firstImage,
        width: 1200,
        height: 630,
        alt: product.name
      }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Giftisan`,
      description: description,
      images: [firstImage],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: slug },
        { slug: slug }
      ]
    },
    include: {
      artisan: {
        include: {
          user: true
        }
      },
      reviews: {
        include: {
          user: true
        }
      }
    }
  });
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: { 
      category: product.category, 
      id: { not: product.id } 
    },
    include: { 
      artisan: { 
        include: { user: true } 
      } 
    },
    take: 3
  });

  // Sanitize data to prevent serialization crashes
  const sanitizedProduct = {
    ...product,
    images: Array.isArray(product.images) ? product.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...product.artisan,
      avatar: (product.artisan.avatar?.length || 0) > 300000 ? "" : product.artisan.avatar
    }
  };

  const sanitizedRelated = relatedProducts.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...p.artisan,
      avatar: (p.artisan.avatar?.length || 0) > 300000 ? "" : p.artisan.avatar
    }
  }));

  return <ProductClient product={sanitizedProduct as any} relatedProducts={sanitizedRelated} />;
}
