import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SettingsClient } from "@/components/settings-client";
import { getDictionary } from "../../dictionaries";

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const session = await auth();
  if (!session) redirect(`/${lang}/login`);

  const dict = await getDictionary(lang as any);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect(`/${lang}`);

  // Sanitize user object to prevent large image serialization issues
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: (user.image?.length || 0) > 300000 ? null : user.image, // Cap at ~300KB to prevent RSC crashes
  };

  return (
    <main className="min-h-screen bg-cream font-sans">
      <Navbar dict={dict} />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <SettingsClient user={sanitizedUser} dict={dict} />
      </div>
    </main>
  );
}
