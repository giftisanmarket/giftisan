import { searchProducts } from "@/lib/actions";
import { Navbar } from "@/components/navbar";
import { SearchClient } from "@/components/search-client";
import { Suspense } from "react";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  const { q } = await searchParams;
  
  const canonical = `${SITE_URL}/${lang}/search${q ? `?q=${encodeURIComponent(q)}` : ''}`;

  return {
    title: q ? `${dict.home.search_results_for} "${q}"` : dict.common.explore,
    description: dict.home.treasures_desc,
    alternates: {
      canonical,
      languages: {
        "en-US": `${SITE_URL}/en/search${q ? `?q=${encodeURIComponent(q)}` : ''}`,
        "ar-EG": `${SITE_URL}/ar/search${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      }
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: q ? `${dict.home.search_results_for} "${q}"` : dict.common.explore,
      description: dict.home.treasures_desc,
      images: [`${SITE_URL}/hero.webp`],
    }
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": dict.common?.home || "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": dict.common?.explore || "Explore",
        "item": `${SITE_URL}/${lang}/search`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar dict={dict} />
      <div className="pt-20">
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-heading font-bold text-primary">{dict.home.searching_vaults}</div>}>
          <SearchClient query={query} initialProducts={products} dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
