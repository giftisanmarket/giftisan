import { Navbar } from "@/components/navbar";
import { ComingSoon } from "@/components/coming-soon";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <ComingSoon 
          title="Sharing the Artisan Narrative" 
          description="We're currently documenting the heritage and vision behind Giftisan. Soon, you'll be able to explore our journey from a local workshop to a global stage."
          featureName="Our Story"
        />
      </div>
    </main>
  );
}
