import type { Metadata } from "next";
import { Inter, Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { CartDrawer } from "@/components/cart-drawer";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

import { SITE_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Artisanal Marketplace`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["handcrafted", "artisanal", "vintage", "personalized gifts", "handmade jewelry", "bespoke stationery"],
  authors: [{ name: "Giftisan Team" }],
  creator: SITE_NAME,
  icons: {
    icon: "/icon.png",
  },
  alternates: {
    canonical: "./",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Artisanal Marketplace`,
    description: "Discover unique handcrafted treasures from local artisans.",
    images: ["/hero.png"],
    creator: "@giftisan",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Artisanal Marketplace`,
    description: "Discover the most unique handcrafted treasures, vintage finds, and personalized keepsakes.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Marketplace - Proudly Handcrafted with Heart`,
      },
    ],
  },
};

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "@/components/notification-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${outfit.variable} ${ebGaramond.variable} font-sans text-charcoal bg-white antialiased selection:bg-accent/20`}
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
                <CartDrawer />
              </CartProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
