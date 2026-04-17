import { searchProducts } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { SearchClient } from "@/components/search-client";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  const { q } = await searchParams;
  
  return {
    title: q ? `${dict.home.search_results_for} "${q}"` : dict.common.explore,
    description: dict.home.treasures_desc,
  };
}

import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const { q } = await searchParams;
  const query = q || "";
  const products = await searchProducts(query);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      <div className="pt-20">
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-heading font-bold text-primary">{dict.home.searching_vaults}</div>}>
          <SearchClient query={query} initialProducts={products} dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
