import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ShieldCheck, Eye, Lock, Database, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Giftisan",
  description: "Learn how Giftisan protects your personal data and creative assets.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us: name, email address, payment information, and product details. We also collect usage data to improve your browsing experience.",
      icon: <Database className="w-6 h-6" />
    },
    {
      title: "2. How We Use Data",
      content: "Your data is used to process transactions, fulfill orders, and communicate with you about your account. We do not sell your personal information to third parties.",
      icon: <Eye className="w-6 h-6" />
    },
    {
      title: "3. Data Sharing",
      content: "We share necessary details (like shipping address) with artisans to ensure your handcrafted items are delivered. We also use secure third-party payment processors like Stripe.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "4. Security Measures",
      content: "We implement robust security protocols, including encryption and secure server environments, to protect your sensitive data from unauthorized access.",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "5. Your Privacy Rights",
      content: "You have the right to access, correct, or delete your personal information at any time. You can manage your notification preferences directly in your profile settings.",
      icon: <ShieldCheck className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/10">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Your Data is Safe</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-primary mb-6 tracking-tighter">
            Privacy <br /><span className="serif italic text-accent font-normal underline decoration-accent/20 underline-offset-8">Policy</span>.
          </h1>
          <p className="text-xl text-primary/60 font-medium leading-relaxed">
            At Giftisan, we respect your privacy and are committed to protecting the creative and personal information you share with us.
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
            <h3 className="text-3xl font-heading font-black mb-6">Want more details?</h3>
            <p className="text-white/70 mb-10 max-w-lg mx-auto font-medium">
              We are happy to provide detailed information about our data encryption and security standards.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-accent-light transition-all shadow-xl shadow-black/20"
            >
              Contact Support <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
      </main>

      <footer className="py-12 border-t border-primary/5 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">© 2026 Giftisan | All Rights Reserved</p>
          <div className="flex gap-8">
            <Link href="/" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
            <Link href="/terms" className="text-[10px] font-bold text-primary/30 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
