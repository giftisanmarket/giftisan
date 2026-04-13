import { getSubscribers } from "@/lib/actions";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ExportSubscribersButton from "@/components/admin/export-subscribers-button";

export const metadata = {
  title: "Admin | Newsletter Subscribers",
};

export default async function AdminSubscribersPage() {
  const session = await auth();

  // Basic security: only admins can see this
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const rawSubscribers = await getSubscribers();
  const subscribers = rawSubscribers.map(sub => ({
    ...sub,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt
  }));

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter">
            Newsletter <span className="serif italic text-accent font-normal underline decoration-accent/30 underline-offset-8">Subscribers</span>
          </h1>
          <p className="text-charcoal/40 font-medium mt-2">Manage your community mailing list.</p>
        </div>

        <div className="flex items-center gap-4">
          <ExportSubscribersButton subscribers={subscribers} />
          <div className="bg-white px-6 py-[14px] rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Total Interest</p>
            <p className="text-2xl font-black text-primary leading-none">{subscribers.length}</p>
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10">
                  <th className="px-8 py-5 text-xs font-black text-primary uppercase tracking-[0.2em]">Contact Email</th>
                  <th className="px-8 py-5 text-xs font-black text-primary uppercase tracking-[0.2em]">Joined Date</th>
                  <th className="px-8 py-5 text-xs font-black text-primary uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {subscribers.length > 0 ? (
                  subscribers.map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-primary">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-primary/60 font-medium">
                          <Clock className="w-4 h-4 opacity-40" />
                          {new Date(sub.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                          <Mail className="w-8 h-8 text-primary/20" />
                        </div>
                        <p className="text-primary/40 font-bold uppercase tracking-widest text-sm">No subscribers yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-primary/30 text-[10px] font-bold uppercase tracking-[0.3em]">
          Giftisan Internal Administration • Secure Data View
        </p>
      </div>
  );
}
