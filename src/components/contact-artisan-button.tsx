"use client";

import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ContactArtisanButtonProps {
  artisanId: string;
  artisanName: string;
  productId?: string;
  productName?: string;
  artisanUserId: string;
}

export function ContactArtisanButton({ artisanId, artisanName, productId, productName, artisanUserId }: ContactArtisanButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!message.trim()) return;

    setIsLoading(true);
    const res = await sendMessage(session.user.id as string, artisanUserId, message, productId);
    if (res.success) {
      setSent(true);
      setMessage("");
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
      }, 2000);
    } else {
      alert(res.error || "Failed to send message. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-primary/10 rounded-2xl text-sm font-bold text-primary hover:bg-primary/5 hover:border-accent/40 hover:text-accent transition-all shadow-sm"
      >
        <MessageSquare className="w-4 h-4" />
        Message Artisan
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-primary/5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary">Inquiry for <span className="text-accent">{artisanName}</span></h3>
                  {productName && <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest mt-1">Re: {productName}</p>}
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-primary/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-4">
                {sent ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-primary text-xl">Message Sent!</p>
                    <p className="text-charcoal/40 text-sm">The artisan will get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about customization, materials, or shipping..."
                      className="w-full h-40 p-5 bg-cream/30 border border-primary/10 rounded-2xl focus:outline-none focus:border-accent transition-all font-medium text-primary resize-none"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !message.trim()}
                      className="w-full h-14 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
