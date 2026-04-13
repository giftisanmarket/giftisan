import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ProductClient } from "@/components/product-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
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
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
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

  return <ProductClient product={product as any} relatedProducts={relatedProducts} />;
}
