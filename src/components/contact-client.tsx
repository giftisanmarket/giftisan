"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Mail, Send, Sparkles, MessageCircle, HelpCircle, Loader2, CheckCircle2 } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { submitInquiry } from "@/lib/actions";
import { useParams } from "next/navigation";

export function ContactClient({ dict }: { dict: any }) {
  const params = useParams();
  const lang = params?.lang as string || "en";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError(dict.contact.fill_fields);
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
      setError(result.error || dict.contact.error_generic);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar dict={dict} />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16 px-4">
            <h1 className="text-5xl md:text-7xl font-heading font-black text-primary tracking-tighter">
              {dict.contact.title_base} <span className="serif italic text-accent font-normal">{dict.contact.title_accent}</span>.
            </h1>
            <p className="text-xl text-charcoal/60 max-w-2xl mx-auto font-medium leading-relaxed">
              {dict.contact.subtitle}
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
                  <h3 className="font-bold text-primary text-xl mb-1">{dict.contact.email_team}</h3>
                  <p className="text-charcoal/60 font-medium">support@giftisan.com</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-primary/30 mt-2">{dict.contact.response_time}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-white rounded-2xl text-accent shadow-sm border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-xl mb-1">{dict.contact.dm_social}</h3>
                  <p className="text-charcoal/60 font-medium font-m">{dict.contact.dm_desc}</p>
                  <div className="flex gap-4 mt-4">
                     <a href="https://www.instagram.com/gifttisan/" target="_blank" rel="noopener noreferrer" className="text-primary/40 hover:text-accent transition-colors"><FaInstagram className="w-5 h-5" /></a>
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
                  <h3 className="font-bold text-primary text-xl mb-1">{dict.contact.our_role}</h3>
                  <p className="text-charcoal/60 font-medium leading-relaxed">
                    {dict.contact.role_desc}
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/5 relative overflow-hidden">
                 <Sparkles className="absolute top-4 end-4 w-12 h-12 text-primary/5" />
                 <h4 className="font-bold text-primary mb-2">{dict.contact.artisan_support}</h4>
                 <p className="text-sm text-primary/60 font-medium leading-relaxed">
                   {dict.contact.artisan_desc} <a href={`/${lang}/become-artisan`} className="text-accent underline decoration-accent/20">{dict.contact.artisan_portal}</a> {dict.contact.artisan_inquiries}
                 </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-primary/5 shadow-2xl relative z-10 order-1 md:order-2">
              <div className="mb-8">
                 <h2 className="text-2xl font-black text-primary mb-2">{dict.contact.send_msg}</h2>
                 <p className="text-sm text-primary/50 font-medium">{dict.contact.send_msg_desc}</p>
              </div>
              
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                   <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-primary">{dict.contact.msg_sent}</h3>
                   <p className="text-primary/60 font-medium">{dict.contact.msg_sent_desc.replace('{email}', formData.email || "your email")}</p>
                   <button 
                     onClick={() => setStatus("idle")}
                     className="text-accent font-black uppercase tracking-widest text-xs hover:underline"
                   >
                     {dict.contact.send_another}
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.contact.your_name}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={dict.contact.name_placeholder}
                      required
                      className="w-full h-14 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.contact.email_address}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={dict.contact.email_placeholder}
                      required
                      className="w-full h-14 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.contact.how_can_help}</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={dict.contact.help_placeholder}
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
                        {dict.contact.send_inquiry}
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

