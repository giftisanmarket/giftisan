import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ChevronRight, Shield, Scale, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Giftisan",
  description: "Read the Giftisan terms and conditions for artisans and buyers.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the Giftisan platform, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use our services.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "2. Marketplace Roles",
      content: "Giftisan is a marketplace that connects independent artisans (Sellers) with customers (Buyers). Giftisan does not manufacture or store the items sold; we provide the platform for transaction and connection.",
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: "3. Artisan Responsibilities",
      content: "Artisans must ensure all products are handcrafted or vintage. They are responsible for accurate descriptions, shipping, and fulfilling orders in a timely manner. Giftisan reserves the right to remove any listing that violates our quality standards.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "4. Payments and Fees",
      content: "Giftisan processes payments through secure third-party providers. We collect a commission on each successful sale, which is clearly disclosed to the artisan upon registration. Buyers are responsible for the purchase price and shipping costs.",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "5. Intellectual Property",
      content: "Artisans retain ownership of their designs. By listing products, artisans grant Giftisan a license to use product photos for marketing and promotional purposes. Users may not copy or redistribute content without permission.",
      icon: <FileText className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/10">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
            <Scale className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-primary mb-6 tracking-tighter">
            Terms of <br /><span className="serif italic text-accent font-normal underline decoration-accent/20 underline-offset-8">Service</span>.
          </h1>
          <p className="text-xl text-primary/60 font-medium leading-relaxed">
            Effective starting April 2026. Please read these terms carefully to understand your rights and obligations while using the Giftisan marketplace.
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
            <h3 className="text-3xl font-heading font-black mb-6">Questions about our terms?</h3>
            <p className="text-white/70 mb-10 max-w-lg mx-auto font-medium">
              We&apos;re here to help clarify any aspect of our marketplace agreement.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-accent-light transition-all shadow-xl shadow-black/20"
            >
              Contact Support <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </main>

      <footer className="py-12 border-t border-primary/5 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">© 2026 Giftisan | All Rights Reserved</p>
          <div className="flex gap-8">
            <Link href="/" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
            <Link href="/privacy" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
