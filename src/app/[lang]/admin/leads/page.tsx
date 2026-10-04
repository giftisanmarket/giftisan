import { getAbandonedCheckouts } from "@/lib/actions";
import { getDictionary } from "../../dictionaries";
import { LeadsClient } from "@/components/admin/leads-client";
import { UserRound } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads & Abandoned Checkouts | Giftisan Admin",
};

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const isAr = lang === "ar";

  const { leads, total } = await getAbandonedCheckouts({ pageSize: 200 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-primary/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter mb-2 leading-none">
            {isAr ? "العملاء المحتملون" : "Leads"}{" "}
            <span className="serif italic text-accent font-normal">
              {isAr ? "و السلات المهجورة" : "& Abandoned Carts"}
            </span>
          </h1>
          <p className="text-charcoal/40 font-medium text-sm md:text-base">
            {isAr
              ? "عملاء اتموا بياناتهم لكن لم يكملوا الدفع"
              : "Customers who filled checkout but did not complete Paymob payment"}
          </p>
        </div>
        <div className="shrink-0 bg-white border border-primary/5 rounded-2xl px-5 py-3 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-0.5">
            {isAr ? "اجمالي السجلات" : "Total Records"}
          </p>
          <p className="text-2xl font-heading font-bold text-primary">{total}</p>
        </div>
      </div>

      <LeadsClient initialLeads={leads as any} total={total} isAr={isAr} />
    </div>
  );
}