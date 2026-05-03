import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "./CartContext";
import { METALS, PRODUCTS } from "./products";
import type { Metal } from "./types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ProductGrid() {
  const { addItem } = useCart();
  const [active, setActive] = useState<Metal>("Gold");

  const items = useMemo(() => PRODUCTS.filter((p) => p.metal === active), [active]);
  const meta = METALS.find((m) => m.key === active)!;

  return (
    <section id="shop" className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Shop by metal
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {meta.label}
            <span className="ml-3 text-muted-foreground">— {meta.tagline}</span>
          </h2>
        </div>
      </div>

      {/* Metal tabs */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-2">
        {METALS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === m.key
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-gold"
            }`}
          >
            {m.label}
            <span className="ml-2 text-xs opacity-60">
              {PRODUCTS.filter((p) => p.metal === m.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-card">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {!p.inStock && (
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Sold out
                </span>
              )}
              <button
                onClick={() => p.inStock && addItem(p)}
                disabled={!p.inStock}
                aria-label={`Add ${p.name} to cart`}
                className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 shadow-lg transition-all duration-500 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {p.metal} · {p.category}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.weight}</p>
              </div>
              <div className="font-display text-xl text-gold">{fmt(p.price)}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
