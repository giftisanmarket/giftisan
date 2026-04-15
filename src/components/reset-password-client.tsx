"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ArrowRight, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BespokeImage } from "@/components/bespoke-image";
import { resetPasswordAction } from "@/lib/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Missing reset token. Please request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { id: "validation-error" });
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", { id: "validation-error" });
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await resetPasswordAction(token, password);
    
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Visual Side */}
      <div className="hidden lg:block relative overflow-hidden h-full">
        <BespokeImage 
          src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=2070&auto=format&fit=crop" 
          alt="Artisan workspace" 
          fill 
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 shadow-2xl"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-6">Securing the Circle.</h2>
            <p className="text-white/80 text-lg max-w-sm leading-relaxed">
              Almost there. Choose a strong, memorable secret to keep your treasures and studio safe.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center py-16 px-6 md:p-20 relative overflow-y-auto">
        <Link 
          href="/login" 
          className="md:absolute md:top-12 md:left-12 flex items-center gap-2 text-primary/60 hover:text-primary font-bold transition-all group z-10 mb-8 md:mb-0 self-start md:self-auto"
        >
          <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary/5 active:scale-90">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs md:text-sm">Back to Login</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 md:space-y-12"
        >
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary">Choose <span className="serif italic font-normal text-accent">Wisely</span></h1>
            <p className="text-xs md:text-base text-charcoal/60">Craft a new key to unlock your journey. Make it robust and unique.</p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-5 md:space-y-6"
              >
                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-sm font-bold text-red-900 leading-tight">{error}</div>
                  </div>
                )}

                {!token && (
                  <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <p className="text-xs text-accent font-black uppercase tracking-widest">No token found! Use the link in your email.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors pointer-events-none z-20">
                      <Lock className="w-5 h-5 transition-none" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 md:h-16 pl-14 pr-6 rounded-2xl bg-white border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-[border-color,box-shadow] duration-200 font-medium text-primary shadow-sm text-sm relative z-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Confirm Secret</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors pointer-events-none z-20">
                      <CheckCircle className="w-5 h-5 transition-none" />
                    </div>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 md:h-16 pl-14 pr-6 rounded-2xl bg-white border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-[border-color,box-shadow] duration-200 font-medium text-primary shadow-sm text-sm relative z-0"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !token}
                  className="w-full h-14 md:h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 text-sm md:text-base"
                >
                  {isLoading ? "Rewriting Key..." : "Seal New Password"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="reset-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-green-100">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-heading font-bold text-primary">Success!</h3>
                  <p className="text-charcoal/60 leading-relaxed italic serif">
                    Your password has been reset. Returning you to the login portal...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
