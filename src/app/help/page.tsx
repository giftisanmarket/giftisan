import { Navbar } from "@/components/navbar";
import { ComingSoon } from "@/components/coming-soon";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <ComingSoon 
          title="The Guild Guide - Work in Progress" 
          description="We are compiling a master guide for our patrons and artisans. From shipping logistics to care instructions for your treasures, everything you need will be here."
          featureName="Patron Support"
        />
      </div>
    </main>
  );
}
