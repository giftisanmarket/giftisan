import type { Metadata } from "next";
import { Inter, Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { CartDrawer } from "@/components/cart-drawer";

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
  title: "Giftisan | Premium Artisanal Marketplace",
  description: "Discover unique handcrafted treasures, vintage finds, and personalized keepsakes from global artisans.",
  icons: {
    icon: "/icon.png",
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
