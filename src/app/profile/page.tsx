import { auth } from "@/auth";
import { getUserOrders } from "@/lib/actions";
import { ProfileClient } from "@/components/profile-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "View your handcrafted journey and manage your artisanal treasures.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const orders = await getUserOrders(session.user.id as string);

  return <ProfileClient user={session.user} orders={orders} />;
}
