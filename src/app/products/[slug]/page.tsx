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
  });
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Giftisan`,
      description: product.description,
      images: [product.images[0]],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Giftisan`,
      description: product.description,
      images: [product.images[0]],
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
