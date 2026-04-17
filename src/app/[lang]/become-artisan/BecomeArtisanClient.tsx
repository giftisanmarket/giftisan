"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { promoteToArtisan } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Store, MapPin, AlignLeft, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BecomeArtisanClient({ dict }: { dict: any }) {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    studioName: "",
    bio: "",
    location: "",
  });

  useEffect(() => {
    if (session?.user?.role === "ARTISAN") {
      router.push("/studio");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!(session?.user as any)?.emailVerified) {
      setError(dict.home.verify_email_error);
      setIsLoading(false);
      return;
    }

    if (!formData.studioName || !formData.bio) {
      setError(dict.home.form_error);
      setIsLoading(false);
      return;
    }

    const res = await promoteToArtisan(session?.user?.id as string, formData);

    if (res.success) {
      // Force session update so the role reflects in the UI
      await update({
        ...session,
        user: {
          ...session?.user,
          role: "ARTISAN"
        }
      });
    } else {
      setError(res.error || "Something went wrong.");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar dict={dict} />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-heading font-bold text-primary mb-6">{dict.home.join_circle_title}</h1>
          <p className="text-charcoal/60 mb-8 max-w-md mx-auto">{dict.home.join_circle_desc}</p>
          <button
            onClick={() => router.push("/login?callbackUrl=/become-artisan")}
            className="px-10 h-14 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/20"
          >
            {dict.home.sign_in_continue}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pb-20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {(isLoading || session?.user?.role === "ARTISAN") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mb-8"
            >
              <Store className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              {session?.user?.role === "ARTISAN" ? dict.home.redirecting_studio : dict.home.curating_studio}
            </h2>
            <div className="flex items-center gap-2 text-charcoal/40 font-bold uppercase tracking-[0.3em] text-[10px]">
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-accent rounded-full"
              />
              {dict.home.preparing_workspace}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar dict={dict} />

      <div className="container mx-auto px-4 pt-24 md:pt-32 max-w-4xl">
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6"
          >
            <Sparkles className="w-3 h-3" />
            {dict.home.empowering_craftsmanship}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-4 md:mb-6 leading-[1.1]">
            {(dict.home.become_artisan_title_base || dict.home.become_artisan_title?.split(' ')[0])}{" "}
            <span className="serif italic font-normal text-accent">
              {(dict.home.become_artisan_title_accent || dict.home.become_artisan_title?.split(' ').slice(1).join(' '))}
            </span>
          </h1>
          <p className="text-charcoal/40 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {dict.home.become_artisan_desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-12">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-8"
            >
              <div className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Store className="w-3 h-3" /> {dict.home.studio_name_label} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studioName}
                    onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                    placeholder={dict.home.studio_name_placeholder}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-bold shadow-sm text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <MapPin className="w-3 h-3" /> {dict.home.location_label}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={dict.home.location_placeholder}
                    className="w-full h-14 px-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-bold shadow-sm text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-primary/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <AlignLeft className="w-3 h-3" /> {dict.home.bio_label} *
                  </label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder={dict.home.bio_placeholder}
                    className="w-full h-32 md:h-40 p-5 md:p-6 bg-white border border-primary/20 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-primary/30 text-primary font-medium resize-none shadow-sm text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-xl text-center text-xs md:text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="pt-6 md:pt-8 flex flex-col items-center gap-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 text-base md:text-lg active:scale-95 group"
                >
                  {isLoading ? dict.home.launch_loading : dict.home.launch_button}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-charcoal/40 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                  {dict.home.no_fees}
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </main>
  );
}
