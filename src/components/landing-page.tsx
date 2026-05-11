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

export default function LandingPage({ dict }: { dict: any }) {
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
      <nav className="fixed top-0 start-0 end-0 z-[60] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/60 backdrop-blur-xl border border-primary/5 rounded-2xl md:rounded-3xl px-4 md:px-8 py-3 md:py-4 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-md shadow-sm">
              <Image src="/icon.png" alt="Giftisan" fill className="object-contain" />
            </div>
            <span className="text-lg md:text-2xl font-heading font-black text-primary tracking-tighter uppercase">Giftisan</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <Link href="/products" className="text-sm font-bold text-primary/70 hover:text-primary transition-colors tracking-tight">{dict.common.explore}</Link>
            <a href="#artisans" className="text-sm font-bold text-primary/70 hover:text-primary transition-colors tracking-tight">{dict.common.artisans}</a>
            {session ? (
              <Link href="/profile" className="flex items-center gap-2 group italic serif text-primary hover:text-accent font-bold transition-colors">
                Hi, {session.user?.name?.split(' ')[0]} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                {dict.common.login}
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
              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">{dict.common.explore.split(' ')[0]}</Link>
              <a href="#artisans" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">{dict.home.view_studios.split(' ')[0]}</a>
              <Link href="/become-artisan" onClick={() => setIsMenuOpen(false)} className="text-4xl font-heading font-black text-primary capitalize">{dict.common.open_studio.split(' ')[0]}</Link>
              <div className="h-px bg-primary/10 w-24 mx-auto" />
              {session ? (
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-accent italic serif">{dict.common.manage_profile}</Link>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-primary">{dict.common.login}</Link>
              )}
            </div>
            <div className="mt-auto flex justify-center gap-8 pb-10">
              <a href="https://www.instagram.com/giftisan.eg/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
              </a>
              <a href="https://www.facebook.com/giftisan.eg" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
              </a>
              <a href="https://www.tiktok.com/@giftisan.eg" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="w-6 h-6 text-primary/40 hover:text-accent transition-colors" />
              </a>
              <a href="https://www.pinterest.com/giftisaneg" target="_blank" rel="noopener noreferrer">
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
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-balance">{dict.home.proudly_handcrafted}</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-heading font-black leading-[0.85] tracking-tighter text-primary mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {dict.home.hero_title}
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-primary/70 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {dict.home.hero_subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/products"
              className="w-full sm:w-auto px-10 md:px-14 h-16 md:h-20 bg-primary text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[2rem] hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 group"
            >
              {dict.common.start_shopping} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/become-artisan"
              className="w-full sm:w-auto px-10 md:px-14 h-16 md:h-20 bg-white text-primary border border-primary/10 font-black text-lg md:text-xl rounded-2xl md:rounded-[2rem] hover:bg-cream transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              {dict.common.open_studio} <Store className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute top-1/2 start-0 w-full -translate-y-1/2 pointer-events-none -z-10 flex justify-between px-10 opacity-10 md:opacity-100">
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: -10 }}
            animate={{ x: 0, opacity: 0.6, rotate: -5 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="relative w-40 h-56 md:w-56 md:h-80 rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <Image src="/marketing/artisan-working.webp" alt="Artisan" fill className="object-cover" />
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 0.6, rotate: 5 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="relative w-40 h-56 md:w-56 md:h-80 rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <Image src="/marketing/gift-box.webp" alt="Gift" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 py-24 md:py-32 px-6 border-y border-primary/5 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <FadeInView>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-primary mb-20 md:mb-32 tracking-tight">{(dict.home.journey_title_base || dict.home.journey_title.split('Journey')[0])}{' '}<span className="serif italic text-accent font-normal">{(dict.home.journey_title_accent || (dict.home.journey_title.includes('Journey') ? 'Journey' : 'رحلة'))}</span></h2>
          </FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-24">
            {[
              { step: "01", title: dict.home.journey_discover, desc: dict.home.journey_discover_desc },
              { step: "02", title: dict.home.journey_connect, desc: dict.home.journey_connect_desc },
              { step: "03", title: dict.home.journey_cherish, desc: dict.home.journey_cherish_desc }
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center group">
                  <div className="relative mb-8 md:mb-12">
                    <span className="text-[120px] md:text-[160px] font-heading font-black text-primary/[0.03] absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 select-none group-hover:text-accent/[0.05] transition-colors">{item.step}</span>
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
        <div className="absolute top-0 end-0 w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeInView>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
              <Store className="w-4 h-4 text-accent-light" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white text-center">{dict.home.empowering_creators}</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-heading font-black mb-10 leading-[0.9] md:leading-tight">
              {(dict.home.scale_craft_base || dict.home.scale_craft.split('Craft')[0])} <br /> <span className="serif italic text-accent-light font-normal text-6xl md:text-9xl">{(dict.home.scale_craft_accent || (dict.home.scale_craft.includes('Craft') ? 'Craft.' : 'حرفتك.'))}</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/70 mb-14 font-medium leading-relaxed">
              {dict.home.artisan_desc}
            </p>

            <div className="grid sm:grid-cols-2 gap-10 md:gap-12 mb-16">
              {[
                { icon: ShieldCheck, title: dict.home.curated_only, desc: dict.home.curated_only_desc },
                { icon: Users, title: dict.home.direct_sales, desc: dict.home.direct_sales_desc },
                { icon: Star, title: dict.home.pro_tools, desc: dict.home.pro_tools_desc },
                { icon: Mail, title: dict.home.built_audience, desc: dict.home.built_audience_desc }
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
              {dict.home.apply_join} <ArrowRight className="w-6 h-6" />
            </Link>
          </FadeInView>

          <FadeInView delay={0.2}>
            <div className="relative aspect-square md:aspect-[4/5] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <Image src="/marketing/artisan-working.webp" alt="Artisan Studio" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 end-6 md:bottom-12 md:start-12 md:end-12 flex flex-col md:flex-row gap-6 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem]">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-xl">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg md:text-xl leading-tight mb-2">&quot;{dict.home.amira_quote}&quot;</p>
                  <p className="text-white/60 text-sm md:text-base uppercase tracking-widest font-black">— {dict.home.amira_credit}</p>
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
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{dict.home.gifts_soul}</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-black text-primary mb-10 leading-tight">
                {(dict.home.extraordinary_title_base || dict.home.extraordinary_title.split('Extraordinary')[0])} <br /> <span className="serif italic text-accent font-normal text-6xl md:text-9xl">{(dict.home.extraordinary_title_accent || (dict.home.extraordinary_title.includes('Extraordinary') ? 'Extraordinary.' : 'الاستثنائي.'))}</span>
              </h2>
              <p className="text-lg md:text-2xl text-primary/60 font-medium leading-relaxed px-4">
                {dict.home.extraordinary_desc}
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full">
            {[
              { img: "/marketing/jewelry.webp", title: dict.home.bespoke_jewelry, tag: dict.home.handmade_tag, link: "/category/jewelry" },
              { img: "/marketing/gift-box.webp", title: dict.home.luxury_gift_sets, tag: dict.home.exclusive_tag, link: "/category/personalized" },
              { img: "/marketing/home-decor.webp", title: dict.home.unique_home_decor, tag: dict.home.limited_tag, link: "/category/ceramics" },
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Link href={item.link}>
                  <div className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl hover:-translate-y-4 transition-all duration-700">
                    <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-10 start-10 end-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent p-1 bg-white/10 backdrop-blur-md rounded-md mb-3 inline-block">{item.tag}</span>
                      <h3 className="text-white text-3xl md:text-4xl font-black mb-4">{item.title}</h3>
                      <div className="flex items-center gap-3 text-white/50 text-[10px] md:text-xs font-black uppercase tracking-widest group-hover:text-accent transition-colors">
                        {dict.home.explore_collection} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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
              { icon: Heart, title: dict.home.built_passion, desc: dict.home.built_passion_desc },
              { icon: ShieldCheck, title: dict.home.verified_artisans, desc: dict.home.verified_artisans_desc },
              { icon: Users, title: dict.home.direct_contact, desc: dict.home.direct_contact_desc },
              { icon: Sparkles, title: dict.home.unique_selection, desc: dict.home.unique_selection_desc }
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

      {/* Brand Story Section - GEO Optimized */}
      <section className="relative z-10 py-24 md:py-40 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-primary mb-8 tracking-tight">
              {dict.brand_story.title}
            </h2>
            <p className="text-accent italic serif text-xl md:text-2xl mb-12">
              &quot;{dict.brand_story.subtitle}&quot;
            </p>
            <div className="h-px w-24 bg-primary/10 mx-auto mb-12" />
            <p className="text-lg md:text-2xl text-primary/60 font-medium leading-relaxed max-w-3xl mx-auto">
              {dict.brand_story.description}
            </p>
          </FadeInView>
        </div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:60px_60px] -z-10" />
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
            <p className="text-primary/50 text-xl font-medium leading-relaxed text-center lg:text-start">
              {dict.home.premier_marketplace}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/giftisan.eg/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/giftisan.eg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@giftisan.eg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <FaTiktok className="w-5 h-5" />
              </a>
              <a href="https://www.pinterest.com/giftisaneg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <h4 className="font-bold text-primary mb-6 text-center lg:text-start uppercase tracking-[0.3em] text-xs">{dict.home.stay_loop}</h4>
            <div className="bg-white p-2 rounded-3xl border border-primary/5 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute start-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.home.newsletter_placeholder}
                  className="w-full h-16 md:h-20 ps-16 pe-6 bg-transparent outline-none font-bold text-primary placeholder:text-primary/20 text-lg md:text-xl"
                />
              </div>
              <button
                onClick={handleSubscribe}
                disabled={status === "loading" || status === "success"}
                className="h-16 md:h-20 px-10 md:px-14 bg-primary text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[1.5rem] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : status === "success" ? <CheckCircle2 className="w-6 h-6" /> : dict.home.newsletter_button}
              </button>
            </div>
            {message && (
              <p className={`mt-6 text-sm font-black text-center lg:text-start uppercase tracking-widest ${status === "error" ? "text-red-500" : "text-primary"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] md:text-xs font-black text-primary/30 uppercase tracking-[0.4em] text-center md:text-start">© 2026 Giftisan. {dict.home.every_gift_story}</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 md:gap-x-10 gap-y-3">
            <Link href="/contact" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.support}</Link>
            <Link href="/terms" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.terms}</Link>
            <Link href="/shipping" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.shipping?.title_base || 'Shipping'}</Link>
            <Link href="/refund" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.refund?.title_base || 'Refund'}</Link>
            <Link href="/privacy" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.privacy}</Link>
            <Link href="/become-artisan" className="text-[9px] md:text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] hover:text-primary transition-colors whitespace-nowrap">{dict.common.open_studio.split(' ')[0]}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

