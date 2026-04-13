import { Navbar } from "@/components/navbar";
import { ComingSoon } from "@/components/coming-soon";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudioSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <ComingSoon 
          title="Refining Your Digital Workshop" 
          description="We're building advanced studio management tools. Soon you'll be able to customize your storefront appearance, manage payouts, and set your crafting schedule."
          featureName="Studio Settings"
        />
      </div>
    </main>
  );
}
