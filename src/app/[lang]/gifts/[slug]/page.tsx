import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/actions";
import { SITE_URL } from "@/lib/constants";
import { getDictionary, hasLocale } from "../../dictionaries";
import { RecipientGiftsClient, RecipientSlug } from "@/components/recipient-gifts-client";

const VALID_SLUGS: RecipientSlug[] = [
  "for-her",
  "for-him",
  "for-mom",
  "for-couples",
  "for-friends",
  "for-kids",
  "all",
];

const META_MAP: Record<RecipientSlug, { titleEn: string; titleAr: string; descEn: string; descAr: string }> = {
  "for-her": {
    titleEn: "Handcrafted Gifts for Her | Artisan Jewelry, Bags & Wraps | Giftisan Egypt",
    titleAr: "هدايا لها | حلي، حقائب، وشموع معطرة مصنوعة يدوياً | جيفتيزان مصر",
    descEn: "Discover unique gifts for her handcrafted by independent Egyptian artisans.",
    descAr: "اكتشف أروع الهدايا الحرفية لها من مجوهرات وحقائب وأوشحة من صانعين مصريين مستقلين.",
  },
  "for-him": {
    titleEn: "Handcrafted Gifts for Him | Genuine Leather & Woodwork | Giftisan Egypt",
    titleAr: "هدايا له | مصنوعات جلدية وأخشاب فخمة مخصصة | جيفتيزان مصر",
    descEn: "Curated leather goods, desk accents, and woodwork accessories handcrafted for him.",
    descAr: "تشكيلة مختارة من المصنوعات الجلدية الطبيعية والإكسسوارات الخشبية المصنوعة يدوياً له.",
  },
  "for-mom": {
    titleEn: "Thoughtful Gifts for Mom | Keepsakes & Home Treasures | Giftisan Egypt",
    titleAr: "هدايا لست الحبايب | تذكارات دافئة وديكورات بيت مميزة | جيفتيزان مصر",
    descEn: "Warm, heartfelt artisan keepsakes and home treasures to celebrate Mom.",
    descAr: "عبر لأغلى الناس بلمسات دافئة، صواني خشبية، وشموع معطرة تليق بمقام ست الحبايب.",
  },
  "for-couples": {
    titleEn: "Wedding & Couples Gifts | Custom Keepsakes & Sets | Giftisan Egypt",
    titleAr: "هدايا للعروسين والمناسبات | صواني خطوبة وتذكارات بالاسم | جيفتيزان مصر",
    descEn: "Custom embroidery hoops, engagement trays, and heirloom keepsakes for couples.",
    descAr: "صواني خطوبة، طارات تطريز محفورة بالأسماء، وهدايا تذكارية توثق أسعد لحظات العمر.",
  },
  "for-friends": {
    titleEn: "Gifts for Friends | Fun Crochet, Mugs & Keychains | Giftisan Egypt",
    titleAr: "هدايا للأصدقاء | كروشيه مرح، أكواب، وميداليات بالاسم | جيفتيزان مصر",
    descEn: "Delightful surprises, playful crochet companions, and handmade tokens for close friends.",
    descAr: "مفاجآت مرحة ولمسات مبهجة وأكواب خزفية لأعز الرفاق.",
  },
  "for-kids": {
    titleEn: "Handmade Gifts for Kids | Wooden Toys & Knit Dolls | Giftisan Egypt",
    titleAr: "هدايا للأطفال | ألعاب خشبية وعرائس كروشيه يدوية | جيفتيزان مصر",
    descEn: "Safe, imaginative Montessori wooden blocks and hand-knit plush dolls for kids.",
    descAr: "ألعاب خشبية تعليمية آمنة وعرائس كروشيه يدوية تشعل خيال ومرح الأطفال.",
  },
  "all": {
    titleEn: "All Handcrafted Gifts | Curated Egyptian Artisan Marketplace | Giftisan",
    titleAr: "جميع الهدايا الحرفية | تسوق هدايا يدوية أصلية من مصر | جيفتيزان",
    descEn: "Browse all curated gifts from independent Egyptian makers and heritage workshops.",
    descAr: "تصفح جميع الهدايا الحرفية المميزة المصنوعة بأيدي أمهر الصناع والورش في مصر.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !VALID_SLUGS.includes(slug as RecipientSlug)) return {};
  const isAr = lang === "ar";
  const validSlug = slug as RecipientSlug;
  const meta = META_MAP[validSlug];

  const title = isAr ? meta.titleAr : meta.titleEn;
  const description = isAr ? meta.descAr : meta.descEn;
  const ogImage = `${SITE_URL}/images/gifts/gifts-for-her.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/gifts/${slug}`,
      languages: {
        "en-US": `${SITE_URL}/en/gifts/${slug}`,
        "ar-EG": `${SITE_URL}/ar/gifts/${slug}`,
        "x-default": `${SITE_URL}/en/gifts/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/gifts/${slug}`,
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

export default async function RecipientGiftsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !VALID_SLUGS.includes(slug as RecipientSlug)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
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

  const dict = await getDictionary(lang as any);
  const products = await getProductsByCategory("gifts");

  const validSlug = slug as RecipientSlug;
  const meta = META_MAP[validSlug];
  const isAr = lang === "ar";

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
        name: dict.gifts_hub?.all_gifts || "Gift Guide",
        item: `${SITE_URL}/${lang}/gifts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: isAr ? meta.titleAr : meta.titleEn,
        item: `${SITE_URL}/${lang}/gifts/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <RecipientGiftsClient
        initialProducts={products}
        dict={dict}
        slug={validSlug}
        initialPrice={initialPrice}
        lang={lang}
      />
    </>
  );
}
