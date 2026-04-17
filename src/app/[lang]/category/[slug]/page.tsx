import { Metadata } from "next";
import { CategoryClient } from "@/components/category-client";
import { getProductsByCategory } from "@/lib/actions";

interface Props {
  params: Promise<{ slug: string }>;
}

import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  
  return {
    title: `${categoryName} | Giftisan`,
    description: `${dict.home.category_desc_prefix} ${slug} ${dict.home.category_desc_suffix}`,
    alternates: {
      canonical: `${SITE_URL}/${lang}/category/${slug}`,
    },
  };
}

import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const products = await getProductsByCategory(slug);

  return <CategoryClient slug={slug} initialProducts={products} dict={dict} />;
}
