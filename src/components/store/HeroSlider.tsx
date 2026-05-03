import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";

const slides = [
  {
    image: slide1,
    eyebrow: "Featured · Gold",
    title: "Invest in timeless gold.",
    desc: "Investment-grade bars and sovereign coins from the world's most accredited refineries.",
    cta: "Shop Gold",
  },
  {
    image: slide2,
    eyebrow: "Featured · Silver",
    title: "The everyman's metal.",
    desc: "Stack silver bullion at the tightest premiums in the market with insured vaulted storage.",
    cta: "Shop Silver",
  },
  {
    image: slide3,
    eyebrow: "Featured · Platinum & Palladium",
    title: "Diversify with rare metals.",
    desc: "Platinum, palladium and rhodium — for collectors and serious portfolios.",
    cta: "Explore Rare Metals",
  },
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
    <section className="relative h-[560px] overflow-hidden bg-neutral-950 md:h-[680px]">
      {/* Background image with cinematic crossfade */}
      <AnimatePresence mode="sync">
        <motion.img
          key={s.image}
          src={s.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Layered overlays for richness */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 80% 30%, oklch(0.78 0.14 80 / 0.35), transparent 55%)",
        }}
      />
      {/* Subtle film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3.5 py-1.5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
                {s.eyebrow}
              </p>
            </div>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.25rem]">
              <span className="text-gradient-gold drop-shadow-[0_2px_20px_oklch(0.78_0.14_80/0.35)]">
                {s.title.split(" ").slice(0, -1).join(" ")}
              </span>{" "}
              <span className="italic font-display text-white/95">
                {s.title.split(" ").slice(-1)}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
              {s.desc}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-gold-foreground shadow-[0_10px_40px_-10px_oklch(0.78_0.13_80/0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_oklch(0.78_0.13_80/0.85)]">
                {s.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-gold/60 hover:text-gold">
                Live Spot Prices
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-xs uppercase tracking-widest text-white/55">
              <span>LBMA Accredited</span>
              <span className="hidden h-1 w-1 rounded-full bg-gold/70 sm:block" />
              <span>Insured Vaulting</span>
              <span className="hidden h-1 w-1 rounded-full bg-gold/70 sm:block" />
              <span>Free Shipping $500+</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 md:bottom-10 md:right-12">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 md:left-12 md:translate-x-0">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-10 bg-gold" : "w-5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
