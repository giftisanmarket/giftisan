import { Metadata } from "next";
import { CategoryClient } from "@/components/category-client";
import { getProductsByCategory } from "@/lib/actions";

interface Props {
  params: Promise<{ slug: string }>;
}

import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  
  return {
    title: `${categoryName} Treasures`,
    description: `Browse our curated collection of artisanal ${slug} handcrafted with passion by global makers.`,
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
    openGraph: {
      title: `${categoryName} | Giftisan`,
      description: `Premium handcrafted ${slug} from independent artisans.`,
      images: ["/hero.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} Treasures | Giftisan`,
      description: `Discover unique ${slug} from our master artisans.`,
      images: ["/hero.png"],
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  return <CategoryClient slug={slug} initialProducts={products} />;
}
