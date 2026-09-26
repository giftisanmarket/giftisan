import { redirect } from "next/navigation";

export default async function MessagesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/profile`);
}
