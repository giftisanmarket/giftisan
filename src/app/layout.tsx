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

export const metadata: Metadata = {
  metadataBase: new URL("https://giftisan.com"),
  title: {
    default: "Giftisan | Premium Artisanal Marketplace",
    template: "%s | Giftisan"
  },
  description: "Discover unique handcrafted treasures, vintage finds, and personalized keepsakes from global artisans. Elevate every gift-giving moment.",
  keywords: ["handcrafted", "artisanal", "vintage", "personalized gifts", "handmade jewelry", "bespoke stationery"],
  authors: [{ name: "Giftisan Team" }],
  creator: "Giftisan",
  icons: {
    icon: "/icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftisan | Premium Artisanal Marketplace",
    description: "Discover unique handcrafted treasures from global artisans.",
    images: ["/hero.png"],
    creator: "@giftisan",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://giftisan.com",
    siteName: "Giftisan",
    title: "Giftisan | Premium Artisanal Marketplace",
    description: "Discover unique handcrafted treasures from global artisans.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Giftisan Marketplace - Handcrafted Treasures",
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
