"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Mail, Send, Sparkles, MessageCircle, HelpCircle, Loader2, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { submitInquiry } from "@/lib/actions";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    const result = await submitInquiry(formData);

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16 px-4">
            <h1 className="text-5xl md:text-7xl font-heading font-black text-primary tracking-tighter">
              Let&apos;s <span className="serif italic text-accent font-normal">Connect</span>.
            </h1>
            <p className="text-xl text-charcoal/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Giftisan is a bridge between creators and collectors. While we don&apos;t have a physical store, our digital doors are always open.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-10 order-2 md:order-1">
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-white rounded-2xl text-accent shadow-sm border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-1">Email Our Team</h3>
                  <p className="text-charcoal/60 font-medium">support@giftisan.com</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-primary/30 mt-2">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-white rounded-2xl text-accent shadow-sm border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-1">DM on Social</h3>
                  <p className="text-charcoal/60 font-medium font-m">We are very active on Instagram and TikTok for quick questions.</p>
                  <div className="flex gap-4 mt-4">
                     <a href="https://www.instagram.com/giftisanmarket/" target="_blank" rel="noopener noreferrer" className="text-primary/40 hover:text-accent transition-colors"><FaInstagram className="w-5 h-5" /></a>
                     <a href="https://www.facebook.com/profile.php?id=61570726340692" target="_blank" rel="noopener noreferrer" className="text-primary/40 hover:text-accent transition-colors"><FaFacebook className="w-5 h-5" /></a>
                     <a href="https://www.tiktok.com/@giftisanmarket" target="_blank" rel="noopener noreferrer" className="text-primary/40 hover:text-accent transition-colors"><FaTiktok className="w-5 h-5" /></a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-white rounded-2xl text-accent shadow-sm border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-1">Our Role</h3>
                  <p className="text-charcoal/60 font-medium leading-relaxed">
                    Giftisan acts as a curated middle-ground. We don&apos;t have a physical showroom yet, as we focus on empowering artisans in their own studios everywhere.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/5 relative overflow-hidden">
                 <Sparkles className="absolute top-4 right-4 w-12 h-12 text-primary/5" />
                 <h4 className="font-bold text-primary mb-2">Artisan Support</h4>
                 <p className="text-sm text-primary/60 font-medium leading-relaxed">
                   Are you a creator? Check our <a href="/become-artisan" className="text-accent underline decoration-accent/20">Artisan Portal</a> for specific inquiries about opening your studio.
                 </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-primary/5 shadow-2xl relative z-10 order-1 md:order-2">
              <div className="mb-8">
                 <h2 className="text-2xl font-black text-primary mb-2">Send a Message</h2>
                 <p className="text-sm text-primary/50 font-medium">Use the form below and we&apos;ll get back to you shortly.</p>
              </div>
              
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                   <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-primary">Message Sent!</h3>
                   <p className="text-primary/60 font-medium">Thank you for reaching out. A human from our team will get back to you at {formData.email || "your email"} very soon.</p>
                   <button 
                     onClick={() => setStatus("idle")}
                     className="text-accent font-black uppercase tracking-widest text-xs hover:underline"
                   >
                     Send another message
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Jane Doe"
                      required
                      className="w-full h-14 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="jane@example.com"
                      required
                      className="w-full h-14 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">How can we help?</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your inquiry..."
                      required
                      className="w-full p-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary resize-none"
                    />
                  </div>
                  
                  {status === "error" && (
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Send Inquiry
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
