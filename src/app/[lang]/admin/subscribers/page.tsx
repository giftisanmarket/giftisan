import { getSubscribers } from "@/lib/actions";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ExportSubscribersButton from "@/components/admin/export-subscribers-button";
import DeleteSubscriberButton from "@/components/admin/delete-subscriber-button";

export const metadata = {
  title: "Admin | Newsletter Subscribers",
};

import { getDictionary } from "../../dictionaries";

export default async function AdminSubscribersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
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
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter">
            {dict.admin.newsletter_title} <span className="serif italic text-accent font-normal underline decoration-accent/30 underline-offset-8">{dict.admin.subscribers_accent}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium mt-2">{dict.admin.mailing_list_desc}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <ExportSubscribersButton subscribers={subscribers} dict={dict} />
          <div className="bg-white px-5 py-3 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center min-w-[140px]">
            <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-0.5">{dict.admin.total_interest}</p>
            <p className="text-xl md:text-2xl font-black text-primary leading-none">{subscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">{dict.admin.contact_email}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">{dict.admin.joined_date}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">{dict.admin.status}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] text-right">{dict.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {subscribers.length > 0 ? (
                subscribers.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-cream/30 transition-colors group">
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                          <Mail className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                        </div>
                        <span className="font-bold text-primary text-sm line-clamp-1">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-2 text-primary/60 font-medium text-[10px] md:text-xs">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-40 shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-green-100 text-green-700 text-[8px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        {dict.admin.verified}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                      <DeleteSubscriberButton id={sub.id} email={sub.email} dict={dict} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 md:px-8 py-16 md:py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-primary/20" />
                      </div>
                      <p className="text-primary/40 font-bold uppercase tracking-widest text-xs md:text-sm">{dict.admin.no_subscribers}</p>
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
          {dict.admin.admin_footer_info}
        </p>
      </div>
  );
}
