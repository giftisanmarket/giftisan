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
          title="The Guild is Preparing for Launch" 
          description="Giftisan is currently being handcrafted by our global collective of artisans and makers. We're refining every detail to ensure your experience is nothing short of extraordinary."
          featureName="Grand Opening Soon"
        />
      </div>
    </main>
  );
}
