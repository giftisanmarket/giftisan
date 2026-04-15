import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SettingsClient } from "@/components/settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/");

  // Sanitize user object to prevent large image serialization issues
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: (user.image?.length || 0) > 300000 ? null : user.image, // Cap at ~300KB to prevent RSC crashes
  };

  return (
    <main className="min-h-screen bg-cream font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-20 md:py-32">
        <SettingsClient user={sanitizedUser} />
      </div>
    </main>
  );
}
