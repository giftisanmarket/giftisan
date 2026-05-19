"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { promoteToArtisan } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Store, MapPin, AlignLeft, ArrowRight, ShieldCheck, Loader2, Camera, Rocket, BadgeCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function BecomeArtisanClient({ dict }: { dict: any }) {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

    if (!(session?.user as any)?.emailVerified && !(session?.user as any)?.isOAuth) {
      toast.error(dict.home.verify_email_error);
      setIsLoading(false);
      return;
    }

    if (!formData.studioName || !formData.bio) {
      toast.error(dict.home.form_error);
      setIsLoading(false);
      return;
    }

    const res = await promoteToArtisan(session?.user?.id as string, formData);

    if (res.success) {
      toast.success(dict.home.onboarding_success || "Welcome to the circle!");
      // Force session update so the role reflects in the UI
      await update({
        ...session,
        user: {
          ...session?.user,
          role: "ARTISAN"
        }
      });
    } else {
      toast.error(res.error || "Something went wrong.");
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

  const benefits = [
    {
      title: dict.home.artisan_onboarding?.benefits?.commission_title || "0% Commission",
      desc: dict.home.artisan_onboarding?.benefits?.commission_desc || "Keep 100% of your earnings. No hidden charges. Enjoy 0% platform commission throughout the 2026 season.",
      icon: <Rocket className="w-6 h-6 text-accent" />,
    },
    {
      title: dict.home.artisan_onboarding?.benefits?.marketing_title || "Priority Spotlight",
      desc: dict.home.artisan_onboarding?.benefits?.marketing_desc || "Founding artisans get permanent priority in search results and homepage features.",
      icon: <Sparkles className="w-6 h-6 text-accent" />,
    },
    {
      title: dict.home.artisan_onboarding?.benefits?.badge_title || "Founding Badge",
      desc: dict.home.artisan_onboarding?.benefits?.badge_desc || "A permanent mark of excellence on your studio profile.",
      icon: <BadgeCheck className="w-6 h-6 text-accent" />,
    },
  ];

  const steps = [
    {
      title: dict.home.artisan_onboarding?.steps?.step_1_title || "Apply",
      desc: dict.home.artisan_onboarding?.steps?.step_1_desc || "Tell us your story.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: dict.home.artisan_onboarding?.steps?.step_2_title || "Curate",
      desc: dict.home.artisan_onboarding?.steps?.step_2_desc || "Upload your treasures.",
      icon: <Store className="w-5 h-5" />,
    },
    {
      title: dict.home.artisan_onboarding?.steps?.step_3_title || "Sell",
      desc: dict.home.artisan_onboarding?.steps?.step_3_desc || "Connect with collectors.",
      icon: <Rocket className="w-5 h-5" />,
    },
  ];

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

      <div className="container mx-auto px-4 pt-24 md:pt-32 max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6"
          >
            <BadgeCheck className="w-3 h-3" />
            {dict.home.artisan_onboarding?.founding_member_badge || "Founding Member Program"}
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

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 group hover:border-accent/30 transition-all"
            >
              <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-primary mb-3">{benefit.title}</h3>
              <p className="text-charcoal/40 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* How it Works */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-8">
                {dict.home.artisan_onboarding?.how_it_works_title || "How it Works"}
              </h2>
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-primary mb-1">{step.title}</h4>
                      <p className="text-charcoal/40 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-primary rounded-[2rem] text-white space-y-4">
              <h4 className="font-heading font-bold text-xl">Need Help?</h4>
              <p className="text-white/60 text-sm">
                Our curation team is here to help you set up your studio and showcase your unique treasures.
              </p>
              <a href="mailto:support@giftisan.com" className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
                Contact Curation <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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

              <div className="pt-6 md:pt-8 flex flex-col items-center gap-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 text-base md:text-lg active:scale-95 group"
                >
                  {isLoading ? dict.home.launch_loading : (dict.home.launch_button || "Open Your Studio")}
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
