import { Navbar } from "@/components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StudioSettingsClient } from "@/components/studio-settings-client";
import { getArtisanData } from "@/lib/actions";

export default async function StudioSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  const artisan = await getArtisanData(session.user.id);
  if (!artisan) redirect("/studio");

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <StudioSettingsClient artisan={artisan} />
      </div>
    </main>
  );
}
