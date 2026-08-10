import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { BioLinkTab } from "@/components/studio/bio-link-tab";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function StudioBioLinkPage({ params }: Props) {
  const { lang } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${lang}/login`);
  }

  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      bioLinks: { orderBy: { order: "asc" } },
      products: { where: { status: "APPROVED" }, select: { id: true, name: true, price: true, images: true, isFeatured: true } },
    },
  });

  if (!artisan) {
    redirect(`/${lang}/become-artisan`);
  }

  const dict = await getDictionary(hasLocale(lang) ? (lang as "en" | "ar") : "en");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#da7b5a] selection:text-white">
      <Navbar dict={dict} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <BioLinkTab artisan={artisan as any} lang={lang} />
      </main>
    </div>
  );
}
