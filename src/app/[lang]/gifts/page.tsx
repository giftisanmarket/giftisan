import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
    ? "دليل الهدايا الحرفية | هدايا لها، هدايا له، لست الحبايب، وللعروسين"
    : "Handcrafted Gift Guide | Gifts for Her, Him, Mom, & Couples";
  const description = isAr
    ? "وجهتك الأولى للهدايا اليدوية المميزة والفريدة من الحرفيين والمبدعين في مصر."
    : "THE place for meaningful handcrafted presents from independent Egyptian artisans.";
  const ogImage = `${SITE_URL}/images/gifts/gifts-for-her.webp`;

  return {
    title,
    description,
    keywords: [
      isAr ? "هدايا لها" : "Gifts for Her",
      isAr ? "هدايا له" : "Gifts for Him",
      isAr ? "هدايا لست الحبايب" : "Gifts for Mom",
      isAr ? "هدايا للعروسين" : "Wedding Gifts",
      isAr ? "هدايا للأصدقاء" : "Gifts for Friends",
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

export const dynamic = "force-dynamic";

export default async function GiftsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const resolvedSearchParams = await searchParams;
  const initialRecipient = typeof resolvedSearchParams?.recipient === "string" ? resolvedSearchParams.recipient : undefined;
  
  let initialPrice = typeof resolvedSearchParams?.price === "string" ? resolvedSearchParams.price : undefined;
  if (!initialPrice) {
    if (resolvedSearchParams?.maxPrice === "250") {
      initialPrice = "UNDER_250";
    } else if (resolvedSearchParams?.maxPrice === "500") {
      initialPrice = "UNDER_500";
    } else if (resolvedSearchParams?.maxPrice === "1000") {
      initialPrice = "UNDER_1000";
    } else if (resolvedSearchParams?.minPrice === "1000") {
      initialPrice = "OVER_1000";
    }
  }

  // Gracefully redirect legacy query URLs to clean dedicated subpages
  if (initialRecipient && initialRecipient !== "all") {
    const slugMap: Record<string, string> = {
      her: "for-her",
      him: "for-him",
      mom: "for-mom",
      couples: "for-couples",
      friends: "for-friends",
      kids: "for-kids",
    };
    const targetSlug = slugMap[initialRecipient] || initialRecipient;
    redirect(`/${lang}/gifts/${targetSlug}${initialPrice ? `?price=${initialPrice}` : ""}`);
  }

  if (initialPrice && (!initialRecipient || initialRecipient === "all")) {
    redirect(`/${lang}/gifts/all?price=${initialPrice}`);
  }

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GiftsHubClient 
        initialProducts={products} 
        dict={dict} 
        lang={lang}
      />
    </>
  );
}
