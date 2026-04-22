import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ProductClient } from "@/components/product-client";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ slug: string; lang: string }>;
}

import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { getDictionary } from "@/app/[lang]/dictionaries";

import { cookies } from "next/headers";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  let product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: { equals: slug, mode: "insensitive" } },
        { slug: { equals: slug, mode: "insensitive" } }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      images: true,
      slug: true,
      status: true,
      artisan: {
        select: {
          userId: true,
          status: true
        }
      }
    }
  });

  if (!product) return { title: lang === 'ar' ? "المنتج غير موجود" : "Product Not Found" };

  const isVisible = (product.status === "APPROVED" || product.status === "PENDING") && 
                    (product.artisan.status === "APPROVED" || product.artisan.status === "PENDING");
  
  if (!isVisible) {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = session?.user?.id === product.artisan.userId;
    if (!isAdmin && !isOwner) {
      return { title: lang === 'ar' ? "المنتج غير موجود" : "Product Not Found" };
    }
  }

  const getAbsoluteUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const firstImage = getAbsoluteUrl(Array.isArray(product.images) && product.images[0] ? product.images[0] : null) || `${SITE_URL}/api/image/product/${product.id}`;
  const description = product.description.slice(0, 160);

  return {
    title: product.name,
    description: description,
    keywords: [product.name, product.category, lang === 'ar' ? "صنع يدوياً" : "Handcrafted", SITE_NAME, lang === 'ar' ? "مصر" : "Egypt"],
    alternates: {
      canonical: `${SITE_URL}/${lang}/products/${product.slug || product.id}`,
      languages: {
        "en-US": `${SITE_URL}/en/products/${product.slug || product.id}`,
        "ar-EG": `${SITE_URL}/ar/products/${product.slug || product.id}`,
      }
    },
    openGraph: {
      title: product.name,
      description: description,
      images: [{
        url: firstImage,
        width: 1200,
        height: 630,
        alt: product.name
      }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: [firstImage],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as any);
  
  // Try finding exactly what's in the URL
  let product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: { equals: slug, mode: "insensitive" } },
        { slug: { equals: slug, mode: "insensitive" } }
      ]
    },
    include: {
      artisan: {
        include: {
          user: true
        }
      },
      variants: true,
      reviews: {
        include: {
          user: true
        }
      }
    }
  });

  // RESILIENCE FALLBACK: If not found, try a hyphenated version
  if (!product) {
    const cleanSlug = slug.replace(/%20/g, '-').replace(/\s+/g, '-');
    product = await prisma.product.findFirst({
      where: { slug: { equals: cleanSlug, mode: "insensitive" } },
      include: {
        artisan: { include: { user: true } },
        variants: true,
        reviews: { include: { user: true } }
      }
    });
  }
  
  if (!product) {
    notFound();
  }

  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isOwner = session?.user?.id === product.artisan.userId;
  const isVisible = (product.status === "APPROVED" || product.status === "PENDING") && 
                    (product.artisan.status === "APPROVED" || product.artisan.status === "PENDING");
  
  if (!isVisible && !isAdmin && !isOwner) {
    notFound();
  }

  // Views will be tracked on the client side to avoid cookie mutations in SSR

  const baseUrl = SITE_URL;

  const relatedProducts = await prisma.product.findMany({
    where: { 
      category: product.category, 
      id: { not: product.id },
      status: "APPROVED",
      artisan: {
        status: "APPROVED"
      }
    },
    include: { 
      artisan: { 
        include: { user: true } 
      },
      variants: true
    },
    take: 3
  });

  // Sanitize data to prevent serialization crashes
  const sanitizedProduct = {
    ...product,
    variants: product.variants || [],
    images: Array.isArray(product.images) ? product.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...product.artisan,
      avatar: (product.artisan.avatar?.length || 0) > 300000 ? "" : product.artisan.avatar
    }
  };

  const sanitizedRelated = relatedProducts.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images.map((img: string) => (img?.length || 0) > 300000 ? "" : img) : [],
    artisan: {
      ...p.artisan,
      avatar: (p.artisan.avatar?.length || 0) > 300000 ? "" : p.artisan.avatar
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.artisan.studioName || SITE_NAME
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${product.slug || product.id}`,
      "priceCurrency": "EGP",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_NAME
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": dict.common?.home || "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": (dict.common?.categories_list as any)?.[product.category.toLowerCase().replace(/ /g, '-')] || product.category,
        "item": `${baseUrl}/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${baseUrl}/products/${product.slug || product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient 
        product={sanitizedProduct as any} 
        relatedProducts={sanitizedRelated} 
        dict={dict} 
        lang={lang} 
        isAdmin={isAdmin || false}
        isOwner={isOwner || false}
      />
    </>
  );
}
