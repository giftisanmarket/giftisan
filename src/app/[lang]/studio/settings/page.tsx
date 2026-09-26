import { redirect } from "next/navigation";

export default async function StudioSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/studio?tab=settings`);
}
