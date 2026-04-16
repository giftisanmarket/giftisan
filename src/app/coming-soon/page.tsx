import LandingPage from "@/components/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giftisan | Premium Artisanal Marketplace",
  description: "Something exceptional is here at Giftisan. Explore our handcrafted collection.",
};

export default function Page() {
  return <LandingPage />;
}
