import type { Metadata } from "next";
import { Outfit, EB_Garamond, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { CartDrawer } from "@/components/cart-drawer";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

import { SITE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.seo.title,
      template: `%s | ${SITE_NAME}`
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords.split(","),
    authors: [{ name: "Giftisan Team" }],
    creator: SITE_NAME,
    icons: {
      icon: "/icon.png",
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        "en-US": `${SITE_URL}/en`,
        "ar-EG": `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.title,
      description: lang === 'ar' ? "اكتشف كنوزاً يدوية فريدة من الحرفيين المحليين." : "Discover unique handcrafted treasures from local artisans.",
      images: ["/hero.webp"],
      creator: "@gifttisan",
    },
    openGraph: {
      type: "website",
      locale: lang === 'ar' ? "ar_EG" : "en_US",
      url: `${SITE_URL}/${lang}`,
      siteName: SITE_NAME,
      title: dict.seo.title,
      description: dict.seo.description,
      images: [
        {
          url: `${SITE_URL}/hero.webp`,
          width: 1200,
          height: 630,
          alt: lang === 'ar' ? "منصة جيفتيزان - صنع بكل فخر وبحب" : `${SITE_NAME} Platform - Proudly Handcrafted with Heart`,
        },
      ],
    },
  };
}

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "@/components/notification-provider";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

import { getDictionary } from "./dictionaries";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await auth();
  const dict = await getDictionary(lang as any);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": SITE_NAME,
              "url": SITE_URL,
              "logo": `${SITE_URL}/icon.png`,
              "sameAs": [
                "https://instagram.com/giftisan",
                "https://tiktok.com/@giftisan"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@giftisan.shop",
                "contactType": "customer service"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": SITE_NAME,
              "url": SITE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/${lang}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${ebGaramond.variable} ${ibmPlexArabic.variable} font-heading text-charcoal bg-white antialiased selection:bg-accent/20 ${lang === 'ar' ? 'font-arabic' : ''}`}
        suppressHydrationWarning
      >
        <Toaster position="bottom-right" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WBXF1TE58B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WBXF1TE58B');
          `}
        </Script>
        <SessionProvider session={session} key={session?.user?.id || "guest"}>
          <NotificationProvider>
            <FavoritesProvider>
              <CartProvider>
                {children}
                <CartDrawer dict={dict} lang={lang} />
              </CartProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
