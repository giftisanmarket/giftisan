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
  title: {
    default: "Giftisan | Premium Artisanal Marketplace",
    template: "%s | Giftisan"
  },
  description: "Discover unique handcrafted treasures, vintage finds, and personalized keepsakes from global artisans. Elevate every gift-giving moment.",
  keywords: ["handcrafted", "artisanal", "vintage", "personalized gifts", "handmade jewelry", "bespoke stationery"],
  authors: [{ name: "Giftisan Artisans" }],
  creator: "Giftisan",
  icons: {
    icon: "/icon.png",
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
  twitter: {
    card: "summary_large_image",
    title: "Giftisan | Premium Artisanal Marketplace",
    description: "Discover unique handcrafted treasures from global artisans.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className={`${inter.variable} ${outfit.variable} ${ebGaramond.variable} font-sans text-charcoal antialiased selection:bg-accent/20`}>
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
        <FavoritesProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
