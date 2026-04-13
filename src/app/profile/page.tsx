import { auth } from "@/auth";
import { getUserOrders } from "@/lib/actions";
import { ProfileClient } from "@/components/profile-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "View your handcrafted journey and manage your artisanal treasures.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch fresh user data from database to ensure updates are reflected
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return <ProfileClient user={user} orders={orders} />;
}
