import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ChevronRight, Shield, Scale, FileText } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.common?.terms || "Terms of Service",
    description: "Read the Giftisan terms and conditions for artisans and buyers.",
  };
}

import { getDictionary } from "../dictionaries";

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const sections = [
    {
      title: dict.terms.section1_title,
      content: dict.terms.section1_desc,
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: dict.terms.section2_title,
      content: dict.terms.section2_desc,
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: dict.terms.section3_title,
      content: dict.terms.section3_desc,
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: dict.terms.section4_title,
      content: dict.terms.section4_desc,
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: dict.terms.section5_title,
      content: dict.terms.section5_desc,
      icon: <FileText className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/10">
      <Navbar dict={dict} />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
            <Scale className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{dict.terms.legal_framework}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-primary mb-6 tracking-tighter">
            {dict.terms.title_base} <br /><span className="serif italic text-accent font-normal underline decoration-accent/20 underline-offset-8">{dict.terms.title_accent}</span>.
          </h1>
          <p className="text-xl text-primary/60 font-medium leading-relaxed">
            {dict.terms.description}
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
            <h3 className="text-3xl font-heading font-black mb-6">{dict.terms.questions}</h3>
            <p className="text-white/70 mb-10 max-w-lg mx-auto font-medium">
              {dict.terms.questions_desc}
            </p>
            <Link 
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-accent-light transition-all shadow-xl shadow-black/20"
            >
              {dict.terms.contact_support} <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </main>

      <footer className="py-12 border-t border-primary/5 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">{dict.terms.footer_copyright}</p>
          <div className="flex gap-8">
            <Link href={`/${lang}`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.terms.home}</Link>
            <Link href={`/${lang}/shipping`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.common.shipping || 'Shipping'}</Link>
            <Link href={`/${lang}/refund`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.common.refund || 'Refund'}</Link>
            <Link href={`/${lang}/privacy`} className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">{dict.terms.privacy}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
