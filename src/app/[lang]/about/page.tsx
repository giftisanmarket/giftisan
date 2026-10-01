import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { HeartHandshake, Sparkles, ShieldCheck, Truck, ArrowRight, Store, Compass, CheckCircle2 } from "lucide-react";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  const isAr = lang === "ar";

  const title = isAr ? "قصتنا ورؤيتنا | جيفتيزان" : "Our Story & Mission | Giftisan";
  const description = dict.about?.hero_subtitle || "Discover the mission and story behind Giftisan, connecting independent Egyptian artisans with lovers of authentic handmade crafts.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/about`,
      languages: {
        "en-US": `${SITE_URL}/en/about`,
        "ar-EG": `${SITE_URL}/ar/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/about`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/marketing/artisan-working.webp`,
          width: 1200,
          height: 630,
          alt: "Giftisan Egyptian Artisan Workshop",
        },
      ],
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as any);
  const isAr = lang === "ar";
  const about = dict.about || {};

  const pillars = [
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      title: about.pillar1_title || "Direct Maker Support",
      desc: about.pillar1_desc || "Every order directly supports independent artisans and small family-run workshops across Egypt.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: about.pillar2_title || "Timeless Heritage",
      desc: about.pillar2_desc || "We celebrate Egypt's rich artisanal lineage—embracing traditional techniques passed down through generations.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: about.pillar3_title || "One-of-a-Kind Authenticity",
      desc: about.pillar3_desc || "No generic factory replicas. Every creation is crafted by real hands with love and inspected for quality.",
    },
    {
      icon: <Truck className="w-6 h-6 text-accent" />,
      title: about.pillar4_title || "Trust & Nationwide Care",
      desc: about.pillar4_desc || "Seamless nationwide delivery across all 27 governorates, buyer protection, and direct artisan communication.",
    },
  ];

  const stats = [
    { value: about.stat1_value || "100%", label: about.stat1_label || "Egyptian Handcrafted" },
    { value: about.stat2_value || "27", label: about.stat2_label || "Governorates Delivered" },
    { value: about.stat3_value || "Fairer", label: about.stat3_label || (isAr ? "دعم مباشر للحرفيين" : "Support for Independent Makers") },
    { value: about.stat4_value || "1-of-a-Kind", label: about.stat4_label || "Artisanal Pieces" },
  ];

  const heritageHubs = [
    {
      name: isAr ? "فخار وخزف قرية تونس" : "Fayoum Pottery & Ceramics",
      location: isAr ? "الفيوم، مصر" : "Tunis Village, Fayoum",
      desc: isAr ? "تشكيلات طينية مستوحاة من الطبيعة والطيور والنيل." : "Organic clay pottery shaped by master potters on manual kick wheels.",
    },
    {
      name: isAr ? "نحاس وصدف خان الخليلي" : "Cairo Brass & Inlay",
      location: isAr ? "القاهرة التاريخية" : "Historic Cairo",
      desc: isAr ? "تطعيم يدوي دقيق بعرق الصدف والأرابيسك الخشبي العريق." : "Intricate brass repoussé, geometric arabesque, and mother-of-pearl.",
    },
    {
      name: isAr ? "تطريز ومطرزات بدوية" : "Sinai Heritage Embroidery",
      location: isAr ? "شبه جزيرة سيناء" : "Sinai Peninsula",
      desc: isAr ? "غرز تراثية ملونة تروي قصصاً بدوية أصيلة بأيدي سيدات ماهرات." : "Vibrant tribal cross-stitch patterns telling stories of desert heritage.",
    },
    {
      name: isAr ? "منسوجات ونول أخميم" : "Akhmim Handwoven Textiles",
      location: isAr ? "سوهاج، صعيد مصر" : "Sohag, Upper Egypt",
      desc: isAr ? "حرير وكتان مغزول على أنوال خشبية تعود لآلاف السنين." : "Ancient loom-woven linen and cotton fabrics with unmatched texture.",
    },
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/10">
      <Navbar dict={dict} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 border-b border-primary/5 bg-gradient-to-b from-cream via-cream to-white/60">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/15 text-xs font-bold tracking-wide mb-6 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>{about.badge || (isAr ? "قصتنا ورؤيتنا" : "Our Story & Mission")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-primary tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6">
            {about.hero_title || (isAr ? "حيث تلتقي الأصالة المصرية بالحرفية المعاصرة" : "Where Egyptian Heritage Meets Modern Craft")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto font-normal leading-relaxed">
            {about.hero_subtitle || (isAr ? "جيفتيزان منصة رقمية متميزة للمبدعين والحرفيين المستقلين في مصر، نحتفي بالقطع اليدوية الفريدة ونصل بين الحرفي والمقتني العصري." : "Giftisan is a curated sanctuary for independent Egyptian artisans, heritage workshops, and thoughtful shoppers seeking one-of-a-kind handcrafted treasures.")}
          </p>
        </div>
      </section>

      {/* Origin Story: Split Banner */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{about.origin_title || (isAr ? "قلبنا وروحنا" : "Our Heart & Soul")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-primary leading-tight">
              {about.origin_subtitle || (isAr ? "نصل خيوط التراث المصري العريق ببيوت عشاق الفن اليدوي." : "Connecting the threads of Egyptian heritage with modern homes.")}
            </h2>

            <div className="space-y-4 text-charcoal/75 text-sm sm:text-base leading-relaxed">
              <p>
                {about.origin_p1 || (isAr ? "ولدت جيفتيزان من احترام عميق وتقدير خالص لكبار الصناع والحرفيين في مصر. من دواليب الفخار في قرية تونس بالفيوم، وورش النحاس والتطعيم بالصدف في خان الخليلي، إلى منسوجات أخميم ومشغولات سيناء التراثية؛ تمتلك مصر إرثاً حياً لا مثيل له." : "Giftisan was born out of a deep respect for the master makers of Egypt. From the pottery wheels of Fayoum and the brass workshops of historic Cairo to the woven textiles of Upper Egypt and Sinai beadwork, our land possesses an unmatched legacy of handcrafted brilliance.")}
              </p>
              <p>
                {about.origin_p2 || (isAr ? "في عصر الإنتاج التجاري المتكرر، نؤمن بالقيمة الحقيقية للقطع التي تحمل روحاً وقصة وإتقاناً يدوم. عندما تقتني قطعة من جيفتيزان، فأنت لا تشتري منتجاً فحسب، بل تدعم حلم حرفي مصري مستقل وتسهم في استمرار حرفة تراثية أصيلة للأجيال القادمة." : "In a world of mass-produced, disposable goods, we believe in pieces that carry a soul, a human story, and enduring quality. When you shop on Giftisan, you aren't just buying a product—you are supporting an independent artisan's livelihood and keeping heritage craftsmanship alive for generations to come.")}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-cream font-bold text-sm hover:bg-primary-light transition-all shadow-md active:scale-95"
              >
                <span>{about.cta_shop || (isAr ? "استكشف المجموعات" : "Explore the Collection")}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/become-artisan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary border border-primary/20 hover:border-primary font-bold text-sm transition-all shadow-2xs hover:bg-cream active:scale-95"
              >
                <Store className="w-4 h-4 text-accent" />
                <span>{about.cta_join || (isAr ? "انضم كحرفي" : "Become an Artisan")}</span>
              </Link>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] border border-primary/10 bg-white">
              <Image
                src="/marketing/artisan-working.webp"
                alt="Egyptian Master Artisan at Work"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 end-6 text-white space-y-1">
                <p className="text-xs uppercase tracking-widest text-accent-light font-bold">
                  {isAr ? "حرفية مصرية حقيقية" : "Authentic Egyptian Craftsmanship"}
                </p>
                <p className="text-sm font-medium text-white/90">
                  {isAr ? "كل قطعة تروي قصة صانعها وتخلد مهارة أجداده." : "Every piece is sculpted with passion, skill, and cultural pride."}
                </p>
              </div>
            </div>

            {/* Decorative Floating Pill */}
            <div className="absolute -top-4 -end-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-primary/10 hidden sm:flex items-center gap-2.5 text-primary">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <div className="text-start">
                <p className="text-[11px] font-bold leading-tight">{isAr ? "حرفيون موثقون" : "Vetted Independent Makers"}</p>
                <p className="text-[9px] text-charcoal/60">{isAr ? "فحص الجودة والأصالة" : "100% Curated Quality"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Strip */}
      <section className="bg-primary text-cream py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-accent-light tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-cream/80 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Guiding Values / Mission Pillars */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
            {about.mission_title || (isAr ? "قيمنا الأساسية" : "Our Guiding Values")}
          </h2>
          <p className="text-sm sm:text-base text-charcoal/65">
            {about.mission_subtitle || (isAr ? "أربعة مبادئ توجه مسارنا في كل ما نقدمه." : "Four core promises that define everything we do at Giftisan.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-primary/5 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="font-heading font-bold text-primary text-base sm:text-lg">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/65 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Hubs Across Egypt */}
      <section className="bg-primary/5 border-y border-primary/10 py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">
              {isAr ? "خريطة الحرف المصرية" : "Egyptian Heritage Map"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-primary leading-tight">
              {isAr ? "مبدعون من مختلف بقاع مصر" : "Heritage Crafts from the Heart of Egypt"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {heritageHubs.map((hub, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-primary/10 shadow-2xs space-y-2 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                    {hub.location}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-primary text-sm sm:text-base pt-1">
                  {hub.name}
                </h3>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  {hub.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action Banner */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-[#043327] to-[#022018] text-cream p-8 sm:p-12 md:p-16 text-center shadow-xl border border-primary/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-cream leading-tight">
              {about.cta_title || (isAr ? "كن جزءاً من حكايتنا" : "Ready to be part of our story?")}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-cream/75 leading-relaxed font-normal">
              {about.cta_desc || (isAr ? "استكشف إبداعات أصيلة صُنعت بأيدي حرفيين مصريين، أو انضم إلينا وافتح استوديو خاصاً بك." : "Explore unique treasures crafted by local Egyptian artisans, or join our community of master makers.")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href="/products"
                className="px-7 py-3 rounded-full bg-accent text-white font-bold text-sm hover:bg-accent-light transition-all shadow-md active:scale-95"
              >
                {about.cta_shop || (isAr ? "استكشف المجموعات" : "Explore the Collection")}
              </Link>
              <Link
                href="/become-artisan"
                className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 text-cream border border-cream/20 font-bold text-sm transition-all active:scale-95 backdrop-blur-xs"
              >
                {about.cta_join || (isAr ? "انضم كحرفي" : "Become an Artisan")}
              </Link>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Footer */}
      <Footer dict={dict} />
    </div>
  );
}
