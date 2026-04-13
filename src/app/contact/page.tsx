import { Navbar } from "@/components/navbar";
import { ComingSoon } from "@/components/coming-soon";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <ComingSoon
          title="We're setting up the workshop"
          description="Our support desk is currently being handcrafted. In the meantime, you can reach us through our community channels or check back very soon."
          featureName="Contact Us"
        />
      </div>
    </main>
  );
}
