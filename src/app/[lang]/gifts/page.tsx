import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/actions";
import { SITE_URL } from "@/lib/constants";
import { getDictionary, hasLocale } from "../dictionaries";
import { GiftsHubClient } from "@/components/gifts-hub-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  const isAr = lang === "ar";

  const title = isAr
    ? "دليل الهدايا | هدايا لها، هدايا له، هدايا للأطفال"
    : "Gifts Guide | Gifts for Her, Him, and Kids";
  const description = isAr
    ? "وجهتك الأولى للهدايا المميزة والفريدة من المبدعين والورش المحلية في مصر."
    : "THE place for meaningful presents from small shops. Discover curated gifts for her, him, and kids.";
  const ogImage = `${SITE_URL}/images/gifts/gifts-for-her.jpg`;

  return {
    title,
    description,
    keywords: [
      isAr ? "هدايا لها" : "Gifts for Her",
      isAr ? "هدايا له" : "Gifts for Him",
      isAr ? "هدايا اطفال" : "Gifts for Kids",
      isAr ? "هدايا يدوية" : "Handmade Gifts",
      isAr ? "هدايا مصرية" : "Egyptian Handmade",
      "Giftisan",
    ],
    alternates: {
      canonical: `${SITE_URL}/${lang}/gifts`,
      languages: {
        "en-US": `${SITE_URL}/en/gifts`,
        "ar-EG": `${SITE_URL}/ar/gifts`,
        "x-default": `${SITE_URL}/en/gifts`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/gifts`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const revalidate = 60;

export default async function GiftsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as any);
  const products = await getProductsByCategory("gifts");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.common?.home || "Home",
        item: `${SITE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.gifts_hub?.all_gifts || "Gifts",
        item: `${SITE_URL}/${lang}/gifts`,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/${lang}/products/${p.slug || p.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <GiftsHubClient initialProducts={products} dict={dict} />
    </>
  );
}
