"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Mail, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Store, 
  Gift, 
  Heart,
  ChevronRight,
  Search,
  ShoppingBag,
  Menu,
  X
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaPinterest } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { subscribeToNewsletter } from "@/lib/actions";

const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus("success");
      setMessage("You're in! Welcome to our community.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Texture Layer */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] -z-10" />
      
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#064e3b08_1px,transparent_1px),linear-gradient(to_bottom,#064e3b08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      {/* Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-[60] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/60 backdrop-blur-xl border border-primary/5 rounded-2xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-md shadow-sm">
              <Image src="/icon.png" alt="Giftisan" fill className="object-contain" />
            </div>
            <span className="text-lg md:text-2xl font-heading font-black text-primary tracking-tighter uppercase">Giftisan</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/search" className="text-sm font-bold text-primary/70 hover:text-primary transition-colors tracking-tight">Explore Treasures</Link>
            <a href="#artisans" className="text-sm font-bold text-primary/70 hover:text-primary transition-colors tracking-tight">For Artisans</a>
            {session ? (
              <Link href="/profile" className="flex items-center gap-2 group italic serif text-primary hover:text-accent font-bold transition-colors">
                 Hi, {session.user?.name?.split(' ')[0]} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                href="/login"
                className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Join the Circle
              </Link>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-3">
             {session && (
               <Link href="/profile" className="p-2 bg-primary/5 rounded-full">
                  <span className="text-[10px] font-black uppercase text-primary">{session.user?.name?.charAt(0)}</span>
               </Link>
             )}
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="p-2 transition-colors hover:bg-primary/5 rounded-lg"
             >
               {isMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-50 bg-cream lg:hidden flex flex-col p-8 pt-32"
          >
             <div className="flex flex-col gap-10 text-center">
                <Link href="/search" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">Discover</Link>
                <a href="#artisans" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">Sell</a>
                <Link href="/become-artisan" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">Artisan Portal</Link>
                <div className="h-px bg-primary/10 w-24 mx-auto" />
                {session ? (
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-accent italic serif">Manage Profile</Link>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-primary">Sign In</Link>
                )}
             </div>
             <div className="mt-auto flex justify-center gap-8 pb-10">
                <a href="https://www.instagram.com/giftisanmarket/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61570726340692" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
                </a>
                <a href="https://www.tiktok.com/@giftisanmarket" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
                </a>
                <a href="https://pin.it/6f6NNG46N" target="_blank" rel="noopener noreferrer">
                  <FaPinterest className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
                </a>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 md:pt-32 pb-20 px-4 md:px-6 min-h-[95vh] flex flex-col items-center justify-center text-center">
        <motion.div style={{ opacity }} className="max-w-6xl z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 md:mb-10"
          >
            <Sparkles className="w-4 h-4 fill-accent" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-balance">Proudly Handcrafted with Soul</span>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-heading font-black leading-[0.85] tracking-tighter text-primary mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            WHERE ART <br />
            <span className="serif italic text-accent font-normal underline decoration-accent/20 underline-offset-[12px] md:underline-offset-[20px]">Meets</span> <br />
            HEART.
          </motion.h1>

          <motion.p 
            className="text-lg md:text-2xl text-primary/70 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover a curated world of high-end artisanal treasures. We connect the world&apos;s most skilled creators with collectors who value soul over speed.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/search"
              className="w-full sm:w-auto px-10 md:px-14 h-16 md:h-20 bg-primary text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[2rem] hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 group"
            >
              Start Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/become-artisan"
              className="w-full sm:w-auto px-10 md:px-14 h-16 md:h-20 bg-white text-primary border border-primary/10 font-black text-lg md:text-xl rounded-2xl md:rounded-[2rem] hover:bg-cream transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              Open Your Studio <Store className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visuals */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none -z-10 flex justify-between px-10 opacity-10 md:opacity-100">
           <motion.div 
             initial={{ x: -100, opacity: 0, rotate: -10 }}
             animate={{ x: 0, opacity: 0.6, rotate: -5 }}
             transition={{ duration: 1.5, delay: 0.5 }}
             className="relative w-40 h-56 md:w-56 md:h-80 rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
           >
             <Image src="/marketing/artisan-working.png" alt="Artisan" fill className="object-cover" />
           </motion.div>
           <motion.div 
             initial={{ x: 100, opacity: 0, rotate: 10 }}
             animate={{ x: 0, opacity: 0.6, rotate: 5 }}
             transition={{ duration: 1.5, delay: 0.7 }}
             className="relative w-40 h-56 md:w-56 md:h-80 rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
           >
             <Image src="/marketing/gift-box.png" alt="Gift" fill className="object-cover" />
           </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 py-24 md:py-32 px-6 border-y border-primary/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
            <FadeInView>
              <h2 className="text-4xl md:text-6xl font-heading font-black text-primary mb-20 md:mb-32 tracking-tight">The Giftisan <span className="serif italic text-accent font-normal">Journey</span>.</h2>
            </FadeInView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-24">
              {[
                { step: "01", title: "Discover", desc: "Browse a hand-vetted collection of the finest handcrafted items from around the world." },
                { step: "02", title: "Connect", desc: "Interact directly with artisans to personalize your request or hear their story." },
                { step: "03", title: "Cherish", desc: "Receive a piece of art that carries a story, a soul, and a piece of timeless heritage." }
              ].map((item, i) => (
                <FadeInView key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center group">
                    <div className="relative mb-8 md:mb-12">
                      <span className="text-[120px] md:text-[160px] font-heading font-black text-primary/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none group-hover:text-accent/[0.05] transition-colors">{item.step}</span>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-white shadow-xl shadow-primary/5 border border-primary/5 flex items-center justify-center text-primary relative z-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <span className="text-xl font-black">{item.step}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-primary mb-5 relative z-10">{item.title}</h3>
                    <p className="text-primary/60 font-medium relative z-10 leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </FadeInView>
              ))}
            </div>
        </div>
      </section>

      {/* For Artisans Section */}
      <section id="artisans" className="relative z-10 py-24 md:py-40 px-6 bg-primary text-cream overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeInView>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
              <Store className="w-4 h-4 text-accent-light" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white text-center">Empowering Creators</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-heading font-black mb-10 leading-[0.9] md:leading-tight">
              Scale Your <br /> <span className="serif italic text-accent-light font-normal text-6xl md:text-9xl">Craft.</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/70 mb-14 font-medium leading-relaxed">
              Stop fighting algorithms on mass-market platforms. Giftisan is designed specifically for master artisans who demand excellence.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10 md:gap-12 mb-16">
              {[
                { icon: ShieldCheck, title: "Curated Only", desc: "Join an elite community where quality is the top priority." },
                { icon: Users, title: "Direct Sales", desc: "Keep the relationship with your collectors." },
                { icon: Star, title: "Pro Tools", desc: "Professional studio tools to manage orders and portfolio." },
                { icon: Mail, title: "Built-in Audience", desc: "We handle the marketing while you handle the craft." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 text-accent-light" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                    <p className="text-sm md:text-base text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/become-artisan"
              className="inline-flex items-center gap-3 bg-accent text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-accent-light transition-all shadow-2xl shadow-black/30 w-full sm:w-auto justify-center"
            >
              Apply to Join <ArrowRight className="w-6 h-6" />
            </Link>
          </FadeInView>

          <FadeInView delay={0.2}>
            <div className="relative aspect-square md:aspect-[4/5] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <Image src="/marketing/artisan-working.png" alt="Artisan Studio" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row gap-6 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem]">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-xl">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg md:text-xl leading-tight mb-2">&quot;Giftisan transformed my small hobby into a thriving global studio.&quot;</p>
                  <p className="text-white/60 text-sm md:text-base uppercase tracking-widest font-black">— Amira Hassan, Boutique Studio Potter</p>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* For Buyers Section */}
      <section id="buyers" className="relative z-10 py-24 md:py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <FadeInView>
            <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-8">
                <Gift className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Gifts with Soul</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-black text-primary mb-10 leading-tight">
                Discover the <br /> <span className="serif italic text-accent font-normal text-6xl md:text-9xl">Extraordinary.</span>
              </h2>
              <p className="text-lg md:text-2xl text-primary/60 font-medium leading-relaxed px-4">
                Every item on Giftisan is more than a product—it&apos;s a timestamp of someone&apos;s creativity. Crafted for those who seek meaning in every gift.
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full">
            {[
              { img: "/marketing/jewelry.png", title: "Bespoke Jewelry", tag: "Handmade", link: "/category/jewelry" },
              { img: "/marketing/gift-box.png", title: "Luxury Gift Sets", tag: "Exclusive", link: "/category/personalized" },
              { img: "/marketing/home-decor.png", title: "Unique Home Décor", tag: "Limited", link: "/category/ceramics" },
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Link href={item.link}>
                  <div className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl hover:-translate-y-4 transition-all duration-700">
                    <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent p-1 bg-white/10 backdrop-blur-md rounded-md mb-3 inline-block">{item.tag}</span>
                      <h3 className="text-white text-3xl md:text-4xl font-black mb-4">{item.title}</h3>
                      <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-xs font-black uppercase tracking-widest group-hover:text-accent transition-colors">
                        Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid / Trust */}
      <section className="relative z-10 py-24 md:py-40 px-6 border-y border-primary/5 bg-primary/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
            {[
              { icon: Heart, title: "Built with Passion", desc: "We celebrate the makers and the heritage behind every craft in our collection." },
              { icon: ShieldCheck, title: "Verified Artisans", desc: "Every creator is manually vetted to ensure premium quality and originality." },
              { icon: Users, title: "Direct Contact", desc: "Message artisans directly to personalize your treasures or hear the story." },
              { icon: Sparkles, title: "Unique Selection", desc: "No mass production. Only one-of-a-kind and limited editions for the soul." }
            ].map((feature, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-primary/5 border border-primary/5 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-4">{feature.title}</h3>
                  <p className="text-primary/50 text-base leading-relaxed max-w-xs">{feature.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-24 md:py-40 px-6 bg-cream border-t border-primary/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-20">
          <div className="flex flex-col items-center lg:items-start gap-8 max-w-lg">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-md shadow-lg">
                <Image src="/icon.png" alt="Giftisan" fill className="object-contain" />
              </div>
              <span className="text-4xl font-heading font-black text-primary tracking-tighter uppercase">Giftisan</span>
            </div>
            <p className="text-primary/50 text-xl font-medium leading-relaxed text-center lg:text-left">
              The premier curated artisanal marketplace. 
              Join a movement of conscious gifting and professional craftsmanship.
            </p>
            <div className="flex gap-4">
               <a href="https://www.instagram.com/giftisanmarket/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                 <FaInstagram className="w-5 h-5" />
               </a>
               <a href="https://www.facebook.com/profile.php?id=61570726340692" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                 <FaFacebook className="w-5 h-5" />
               </a>
               <a href="https://www.tiktok.com/@giftisanmarket" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                 <FaTiktok className="w-5 h-5" />
               </a>
               <a href="https://pin.it/6f6NNG46N" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                 <FaPinterest className="w-5 h-5" />
               </a>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <h4 className="font-bold text-primary mb-6 text-center lg:text-left uppercase tracking-[0.3em] text-xs">Stay in the Loop</h4>
            <div className="bg-white p-2 rounded-3xl border border-primary/5 shadow-2xl flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full h-16 md:h-20 pl-16 pr-6 bg-transparent outline-none font-bold text-primary placeholder:text-primary/20 text-lg md:text-xl"
                  />
                </div>
                <button 
                  onClick={handleSubscribe}
                  disabled={status === "loading" || status === "success"}
                  className="h-16 md:h-20 px-10 md:px-14 bg-primary text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[1.5rem] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : status === "success" ? <CheckCircle2 className="w-6 h-6" /> : "Subscribe"}
                </button>
            </div>
            {message && (
              <p className={`mt-6 text-sm font-black text-center lg:text-left uppercase tracking-widest ${status === "error" ? "text-red-500" : "text-primary"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] md:text-xs font-black text-primary/30 uppercase tracking-[0.4em]">© 2026 Giftisan. Every Gift Tells a Story.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/contact" className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] hover:text-primary transition-colors">Support</Link>
            <Link href="/terms" className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/become-artisan" className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.4em] hover:text-primary transition-colors">Artisan Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
