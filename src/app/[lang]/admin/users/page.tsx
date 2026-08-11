import { getAllUsers } from "@/lib/actions";
export const dynamic = "force-dynamic";
import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: `${dict.admin?.artisans_title || "Artisans"} & ${dict.admin?.users_accent || "Users"}`,
  };
}

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const users = await getAllUsers();

  return <AdminUsersClient initialUsers={users} dict={dict} lang={lang} />;
}
