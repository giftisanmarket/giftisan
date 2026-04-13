import { auth } from "@/auth";
import { getInbox, getArtisanData } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { MessagesClient } from "@/components/messages-client";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const artisan = await getArtisanData(session.user.id as string);
  const initialMessages = await getInbox(session.user.id as string);

  return (
    <main className="min-h-screen bg-cream font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <MessagesClient initialMessages={initialMessages} userId={session.user.id} />
      </div>
    </main>
  );
}
