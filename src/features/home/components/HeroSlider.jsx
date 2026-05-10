import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";

const slides = [
  {
    image: slide1,
    eyebrow: "Featured · Gold Bullion",
    title: "Invest in timeless gold.",
    desc: "Investment-grade bars and sovereign coins from the world's most accredited refineries.",
    cta: "Shop Gold",
    ctaTo: "/#shop",
    badge: "99.99% Purity",
  },
  {
    image: slide2,
    eyebrow: "Featured · Silver Bullion",
    title: "The everyman's metal.",
    desc: "Stack silver bullion at the tightest premiums in the market with insured vaulted storage.",
    cta: "Shop Silver",
    ctaTo: "/#shop",
    badge: "Best Value",
  },
  {
    image: slide3,
    eyebrow: "Featured · Rare Metals",
    title: "Diversify with rare metals.",
    desc: "Platinum, palladium and rhodium — for collectors and serious portfolios.",
    cta: "Explore Rare Metals",
    ctaTo: "/#shop",
    badge: "Limited Stock",
  },
];

const trustBadges = [
  { icon: Shield, label: "Insured Storage", sub: "Lloyd's of London" },
  { icon: Award, label: "Certified Dealer", sub: "LBMA Accredited" },
  { icon: TrendingUp, label: "Live Pricing", sub: "Real-time spot rates" },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const s = slides[i];

  return (
    <section className="relative h-130 sm:h-140 md:h-160 lg:h-175 overflow-hidden bg-[oklch(0.12_0.04_255)]">
      {/* Background image */}
      <AnimatePresence mode="sync">
        <motion.img
          key={s.image}
          src={s.image}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay — stronger on left for text legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-black/92 via-black/65 to-black/15" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-12 pb-20 md:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {s.eyebrow}
              </p>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {s.badge}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {s.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-white/75 md:text-lg">{s.desc}</p>
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link
                to={s.ctaTo}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-[0_12px_40px_-10px_oklch(0.78_0.13_80/0.65)] hover:scale-[1.02]"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/live-charts"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white"
              >
                View Live Prices
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Trust badges */}
        <div className="absolute bottom-8 left-6 lg:left-12 flex flex-wrap gap-3 md:gap-4">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 rounded-lg border border-white/12 bg-black/40 backdrop-blur-sm px-3 py-2">
              <b.icon className="h-4 w-4 text-gold/80 shrink-0" />
              <div className="leading-none">
                <p className="text-[11px] font-semibold text-white/90">{b.label}</p>
                <p className="text-[10px] text-white/45">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 right-6 flex items-center gap-2 md:bottom-10 md:right-12">
        <div className="flex items-center gap-1.5 mr-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === i ? "w-8 bg-gold" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
