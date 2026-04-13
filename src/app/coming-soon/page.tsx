import { ComingSoon } from "@/components/coming-soon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giftisan | Crafting Something Special",
  description: "Our master artisans are currently preparing the marketplace. Join the guild to be first in line for our grand opening.",
  robots: { index: true, follow: true }
};

export default function GlobalComingSoonPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <ComingSoon 
          title="The Marketplace for Master Makers is Arriving" 
          description="We're currently building the world's premier platform for independent artisans. Soon, you'll be able to discover and support a global collective of creators through our curated marketplace."
          featureName="Platform Launch"
        />
      </div>
    </main>
  );
}
