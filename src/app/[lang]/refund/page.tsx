import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { RefreshCcw, Heart, ShieldCheck, Clock, FileText, ChevronRight } from "lucide-react";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common?.refund || "Refund Policy",
    description: "Information about Giftisan's fair refund and return policy for handcrafted treasures.",
  };
}

export default async function RefundPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  
  const sections = [
    {
      title: dict.refund.section1_title,
      content: dict.refund.section1_desc,
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: dict.refund.section2_title,
      content: dict.refund.section2_desc,
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: dict.refund.section3_title,
      content: dict.refund.section3_desc,
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: dict.refund.section4_title,
      content: dict.refund.section4_desc,
      icon: <RefreshCcw className="w-6 h-6" />
    },
    {
      title: dict.refund.section5_title,
      content: dict.refund.section5_desc,
      icon: <Clock className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/10">
      <Navbar dict={dict} />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
            <RefreshCcw className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{dict.refund.refund_status}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-primary mb-6 tracking-tighter">
            {dict.refund.title_base} <br /><span className="serif italic text-accent font-normal underline decoration-accent/20 underline-offset-8">{dict.refund.title_accent}</span>.
          </h1>
          <p className="text-xl text-primary/60 font-medium leading-relaxed">
            {dict.refund.description}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-6 border-b border-primary/5 pb-10 transition-colors group-hover:border-primary/20">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5 shrink-0">
                   {section.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary mb-4">{section.title}</h2>
                  <p className="text-primary/70 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 bg-primary rounded-[3rem] text-cream relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-heading font-black mb-6">{dict.refund.more_details}</h3>
            <p className="text-white/70 mb-10 max-w-lg mx-auto font-medium">
              {dict.refund.more_details_desc}
            </p>
            <Link 
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-accent-light transition-all shadow-xl shadow-black/20"
            >
              {dict.refund.contact_support} <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </main>

      <footer className="py-12 border-t border-primary/5 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">{dict.refund.footer_copyright}</p>
          <div className="flex gap-8">
            <Link href={`/${lang}`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.refund.home}</Link>
            <Link href={`/${lang}/shipping`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.common.shipping}</Link>
            <Link href={`/${lang}/privacy`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.common.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
