"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BespokeImage } from "@/components/bespoke-image";
import { login } from "@/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await login({ email, password });
    
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else if (res?.success) {
      // Deep refresh using window.location to force a 
      // full cache purge and session synchronization
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Visual Side */}
      <div className="hidden lg:block relative overflow-hidden">
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
            <h2 className="text-4xl font-heading font-bold text-white mb-6">Welcome back to the Circle.</h2>
            <p className="text-white/80 text-lg max-w-sm leading-relaxed">
              Continue your journey of discovery and craftsmanship. Your treasures are waiting.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 md:p-20 relative">
        <Link 
          href="/" 
          className="absolute top-12 left-12 flex items-center gap-2 text-primary/60 hover:text-primary font-bold transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary/5">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Shop
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">Login to <span className="serif italic font-normal text-accent">Giftisan</span></h1>
            <p className="text-charcoal/60">Enter your credentials to access your studio or profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {signupSuccess && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                <p className="text-sm font-bold text-green-700 italic">
                  ✨ Welcome to the Circle! Your studio is ready. Please sign in.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-sm font-bold text-red-500 italic">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Password</label>
                <button type="button" className="text-xs font-bold text-accent hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-primary/10 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-primary shadow-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Continue to Circle"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-charcoal/40 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent font-bold hover:underline">Apply to the Circle</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
