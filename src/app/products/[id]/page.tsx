import { MOCK_PRODUCTS } from "@/lib/data";
import { Metadata } from "next";
import { ProductClient } from "@/components/product-client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find(p => p.id === id);
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
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
