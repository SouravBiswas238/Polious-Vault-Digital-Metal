import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="relative h-[520px] overflow-hidden bg-secondary md:h-[600px]">
      <AnimatePresence mode="sync">
        <motion.img
          key={s.image}
          src={s.image}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
              {s.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              {s.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
              {s.desc}
            </p>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-gold-foreground transition-shadow hover:shadow-[0_10px_40px_-10px_oklch(0.78_0.13_80/0.6)]">
              {s.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 md:bottom-10 md:right-12">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
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
              idx === i ? "w-10 bg-gold" : "w-5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
