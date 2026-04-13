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
          title="Empowering Your Digital Studio"
          description="We're currently building advanced tools to help you manage your shop, view analytics, and connect with patrons more effectively. Reach out to the support team for manual updates in the meantime."
          featureName="Studio Management"
        />
      </div>
    </main>
  );
}
