import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import heroImg from "@/assets/hero-gold.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold">
            <TrendingUp className="h-3.5 w-3.5" />
            Spot Gold · $2,418.40 / oz
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Invest in <span className="text-gradient-gold">timeless</span>
            <br /> precious metals.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Sourced from accredited refineries. Insured vaulted storage in Zurich
            and Singapore. Trusted by collectors and institutions for over 40 years.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-gold-foreground transition-shadow hover:shadow-[0_10px_40px_-10px_oklch(0.78_0.13_80/0.6)]"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground/80 transition-colors hover:border-gold/60 hover:text-gold">
              View Live Charts
            </button>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 border-t border-border/60 pt-8 max-w-md">
            {[
              { v: "40+", l: "Years trusted" },
              { v: "$2B+", l: "Vaulted assets" },
              { v: "180k", l: "Investors" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl text-gradient-gold">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
            <img
              src={heroImg}
              alt="Stacked gold bullion bars on black marble"
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
