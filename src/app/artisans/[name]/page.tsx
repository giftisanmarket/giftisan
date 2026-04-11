import { MOCK_PRODUCTS } from "@/lib/data";
import { Metadata } from "next";
import { ArtisanClient } from "@/components/artisan-client";
import { notFound } from "next/navigation";

interface Props {
  params: { name: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: nameSlug } = await params;
  const product = MOCK_PRODUCTS.find(
    p => p.artisan.name.toLowerCase().replace(/ /g, "-") === nameSlug
  );
  
  if (!product) return { title: "Artisan Not Found" };
  const artisan = product.artisan;

  return {
    title: `${artisan.name} Studio`,
    description: artisan.bio,
    openGraph: {
      title: `${artisan.name} | Master Artisan at Giftisan`,
      description: artisan.bio,
      images: [artisan.avatar],
    }
  };
}

export default async function ArtisanPage({ params }: Props) {
  const { name: nameSlug } = await params;
  const product = MOCK_PRODUCTS.find(
    p => p.artisan.name.toLowerCase().replace(/ /g, "-") === nameSlug
  );
  
  if (!product) {
    notFound();
  }

  return <ArtisanClient nameSlug={nameSlug} />;
}
