import { searchProducts } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { SearchClient } from "@/components/search-client";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Explore All Treasures | Giftisan",
    description: "Find the perfect handcrafted gift or artisanal treasure across our global marketplace.",
  };
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || "";
  const products = await searchProducts(query);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-heading font-bold text-primary">Searching our vaults...</div>}>
          <SearchClient query={query} initialProducts={products} />
        </Suspense>
      </div>
    </main>
  );
}
