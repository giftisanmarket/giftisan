import { getAllArtisans } from "@/lib/actions";
import { ArtisansClient } from "@/components/artisans-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Master Artisans | Giftisan",
  description: "Meet the world-class creators and independent studios behind Giftisan's handcrafted treasures.",
};

export default async function ArtisansPage() {
  const artisans = await getAllArtisans();

  return <ArtisansClient artisans={artisans} />;
}
