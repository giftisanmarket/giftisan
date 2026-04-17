import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import { OutreachClient } from "@/components/outreach-client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `Artisan Outreach | ${dict.admin?.marketplace || "Marketplace"}`,
  };
}

export default async function AdminOutreachPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  
  const session = await auth();
  if (!session?.user?.email) redirect(`/${lang}/login`);
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (user?.role !== "ADMIN") redirect(`/${lang}`);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Artisan Outreach</h1>
        <p className="text-charcoal/40 font-medium">Send personalized, beautifully formatted Arabic invitations directly to artisans.</p>
      </div>

      <OutreachClient dict={dict} />
    </div>
  );
}
