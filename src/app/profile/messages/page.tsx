import { auth } from "@/auth";
import { getInbox } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { MessagesClient } from "@/components/messages-client";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const initialMessages = await getInbox(session.user.id);

  return (
    <main className="min-h-screen bg-cream font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <MessagesClient initialMessages={initialMessages} userId={session.user.id} />
      </div>
    </main>
  );
}
