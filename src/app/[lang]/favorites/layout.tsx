import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favorites",
  description: "A curated collection of your favorite artisanal products. Save them for later or add them to your collection today.",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
