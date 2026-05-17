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
    title: `Artisan Outreach | ${dict.admin?.marketplace || "Platform"}`,
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
      <div className="border-b border-primary/5 pb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-2">
          {(dict.admin.outreach_title || "Artisan Outreach").split(' ')[0]}{" "}
          <span className="serif italic text-accent font-normal">
            {(dict.admin.outreach_title || "Artisan Outreach").split(' ').slice(1).join(' ')}
          </span>
        </h1>
        <p className="text-charcoal/40 font-medium text-sm md:text-base">
          {dict.admin.outreach_desc || "Send personalized, beautifully formatted Arabic invitations directly to artisans."}
        </p>
      </div>

      <OutreachClient dict={dict} />
    </div>
  );
}
