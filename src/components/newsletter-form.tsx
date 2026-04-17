"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { CheckCircle2, Loader2, Sparkles, X } from "lucide-react";

export function NewsletterForm({ dict }: { dict: any }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const res = await subscribeToNewsletter(email);
    setIsLoading(false);

    if (res.success) {
      setIsJoined(true);
      setEmail("");
      toast.success(dict.home.newsletter_toast_welcome, {
        icon: <Sparkles className="w-5 h-5 text-accent" />,
        style: {
          borderRadius: "20px",
          background: "#1a2a21",
          color: "#fff",
          border: "1px solid rgba(218, 123, 90, 0.2)",
        },
      });
    } else {
      toast.error(res.error || "Something went wrong", {
        icon: <X className="w-5 h-5 text-white" />,
        style: {
          borderRadius: "20px",
          background: "#2a1a1a",
          color: "#fff",
        },
      });
    }
  };

  if (isJoined) {
    return (
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-accent ring-8 ring-white/5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="font-heading font-bold text-xl">{dict.home.newsletter_success_title}</p>
        <p className="text-white/60 text-sm">{dict.home.newsletter_success_desc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <div className="flex-1 relative group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.home.newsletter_placeholder}
          required
          className="w-full h-14 px-6 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder:text-white/40 transition-all font-bold"
        />
        <div className="absolute inset-0 rounded-full bg-accent/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="h-14 px-10 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2 group disabled:opacity-50 min-w-[160px]"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          dict.home.newsletter_button
        )}
      </button>
    </form>
  );
}

