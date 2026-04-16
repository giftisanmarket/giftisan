import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BecomeArtisanClient from "./BecomeArtisanClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Your Studio | Giftisan Artisan Program",
  description: "Join our elite circle of master artisans. Share your story, sell your handcrafted treasures, and connect with global collectors.",
};

export default async function BecomeArtisanPage() {
  const session = await auth();

  // If user is already an artisan, redirect them to the studio on the server
  // This avoids the client-side loading flash and transition screen
  if (session?.user?.role === "ARTISAN") {
    redirect("/studio");
  }

  return <BecomeArtisanClient />;
}
