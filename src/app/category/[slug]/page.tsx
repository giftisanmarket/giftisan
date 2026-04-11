import { Metadata } from "next";
import { CategoryClient } from "@/components/category-client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${categoryName} Treasures`,
    description: `Browse our curated collection of artisanal ${slug} handcrafted with passion by global makers.`,
    openGraph: {
      title: `${categoryName} | Giftisan`,
      description: `Premium handcrafted ${slug} from independent artisans.`,
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
