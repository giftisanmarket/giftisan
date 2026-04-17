"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Lock, ArrowRight, Paintbrush, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn as socialSignIn } from "next-auth/react";

export function SignupClient({ dict }: { dict: any }) {
  const [role, setRole] = useState<"CLIENT" | "ARTISAN">("CLIENT");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      setStep(2);
    } else {
      setIsLoading(true);
      const res = await signUp(formData, role);
      setIsLoading(false);

      if (res.error) {
        setError(res.error);
      } else {
        if (res.autoLogin) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/login?signup=success");
        }
      }
    }
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col justify-center items-center py-12 px-6 md:p-20 relative">
      <Link 
        href="/" 
        className="absolute top-12 start-12 flex items-center gap-2 text-primary/60 hover:text-primary font-bold transition-all group z-10"
      >
        <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary/5">
          <ArrowLeft className="w-4 h-4" />
        </div>
        {dict.auth.back_to_shop}
      </Link>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 md:opacity-100" />
        <div className="absolute bottom-0 start-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-50 md:opacity-100" />
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] p-8 py-12 md:p-20 shadow-2xl shadow-primary/5 border border-primary/5 relative z-10 mt-20 md:mt-32"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="space-y-4 text-center">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary">
                  {(dict.auth.signup_title_base || dict.auth.signup_title?.split(' ')[0])}{" "}
                  <span className="serif italic font-normal text-accent">
                    {(dict.auth.signup_title_accent || dict.auth.signup_title?.split(' ').slice(1).join(' '))}
                  </span>
                </h1>
                <p className="text-sm md:text-base text-charcoal/60">{dict.auth.signup_subtitle}</p>
              </div>

              <button 
                type="button"
                onClick={() => socialSignIn("google", { callbackUrl: "/" })}
                className="w-full h-14 md:h-16 bg-white border border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all shadow-sm flex items-center justify-center gap-3 group text-sm md:text-base"
              >
                <FcGoogle className="w-6 h-6" />
                {dict.auth.signup_google}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                  <span className="bg-white px-4 text-primary/20 italic serif">{dict.auth.signup_path}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <button 
                  onClick={() => setRole("CLIENT")}
                  className={cn(
                    "p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-4 md:gap-6 group",
                    role === "CLIENT" 
                      ? "border-accent bg-accent/5 shadow-xl shadow-accent/5" 
                      : "border-primary/5 bg-cream/20 hover:border-accent/40 lg:hover:-translate-y-2"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all",
                    role === "CLIENT" ? "bg-accent text-white" : "bg-white text-primary/40 group-hover:text-accent shadow-sm"
                  )}>
                    <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-primary mb-1 md:mb-2">{dict.auth.signup_treasure_hunter}</h3>
                    <p className="text-[10px] md:text-sm text-charcoal/50 leading-relaxed">{dict.auth.signup_treasure_hunter_desc}</p>
                  </div>
                </button>

                <button 
                  onClick={() => setRole("ARTISAN")}
                  className={cn(
                    "p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-4 md:gap-6 group",
                    role === "ARTISAN" 
                      ? "border-accent bg-accent/5 shadow-xl shadow-accent/5" 
                      : "border-primary/5 bg-cream/20 hover:border-accent/40 lg:hover:-translate-y-2"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all",
                    role === "ARTISAN" ? "bg-accent text-white" : "bg-white text-primary/40 group-hover:text-accent shadow-sm"
                  )}>
                    <Paintbrush className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-primary mb-1 md:mb-2">{dict.auth.signup_master_artisan}</h3>
                    <p className="text-[10px] md:text-sm text-charcoal/50 leading-relaxed">{dict.auth.signup_master_artisan_desc}</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group text-sm md:text-base"
              >
                {dict.auth.signup_set_purpose}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 md:space-y-12"
            >
              <div className="space-y-4">
                <button 
                  onClick={() => setStep(1)}
                  className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline mb-2 block"
                >
                  ← {dict.auth.signup_previous}
                </button>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary italic serif">{dict.auth.signup_details.replace('{role}', role === "ARTISAN" ? dict.auth.signup_studio : dict.auth.signup_account)}</h2>
                <p className="text-sm md:text-base text-charcoal/60">{dict.auth.signup_onboarding_desc}</p>
              </div>

              <form onSubmit={handleNext} className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.auth.signup_full_name}</label>
                  <input 
                    type="text" 
                    placeholder={dict.auth.signup_name_placeholder}
                    className="w-full h-14 md:h-16 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary shadow-inner text-sm md:text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.auth.login_email_label}</label>
                  <input 
                    type="email" 
                    placeholder={dict.auth.login_email_placeholder}
                    className="w-full h-14 md:h-16 px-6 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary shadow-inner text-sm md:text-base"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ms-1">{dict.auth.login_password_label}</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full h-14 md:h-16 ps-6 pe-14 rounded-2xl bg-cream/30 border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary shadow-inner text-sm md:text-base relative z-0"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-5 top-1/2 -translate-y-1/2 text-primary/20 hover:text-accent transition-colors z-20"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 italic">
                    {error}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 text-sm md:text-base"
                >
                  {isLoading ? dict.auth.signup_creating : dict.auth.signup_create_presence}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-charcoal/40 font-medium mt-10 md:mt-12 text-sm">
          {dict.auth.signup_already_member}{" "}
          <Link href="/login" className="text-accent font-bold hover:underline">{dict.auth.signup_sign_in}</Link>
        </p>
      </motion.div>
    </main>
  );
}

