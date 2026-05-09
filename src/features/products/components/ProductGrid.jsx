import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle2, XCircle, Star } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { METALS, PRODUCTS } from "@/features/products/data/products";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function ProductCard({ p, index }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!p.inStock) return;
    addItem(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/8 hover:border-gold/30"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-secondary/40">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {!p.inStock && (
            <span className="rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
              Sold Out
            </span>
          )}
          {p.inStock && (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              In Stock
            </span>
          )}
        </div>

        {/* Category chip */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/70 uppercase tracking-wider">
            {p.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">
            {p.metal}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
            {p.name}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-gold/60 text-gold/60" />
            {p.weight}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="font-display text-2xl font-semibold text-gradient-gold tabular-nums">
              {fmt(p.price)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={!p.inStock}
            aria-label={`Add ${p.name} to cart`}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
              added
                ? "bg-emerald-500 text-white scale-95"
                : p.inStock
                ? "bg-gold text-gold-foreground hover:shadow-[0_8px_24px_-8px_oklch(0.78_0.13_80/0.6)] hover:scale-105"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Added!
                </motion.span>
              ) : p.inStock ? (
                <motion.span
                  key="buy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="sold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" /> Sold Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid() {
  const [active, setActive] = useState("Gold");

  const items = useMemo(() => PRODUCTS.filter((p) => p.metal === active), [active]);
  const meta = METALS.find((m) => m.key === active);

  return (
    <section id="shop" className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      {/* Section header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Shop by Metal</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {meta.label}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{meta.tagline}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {items.length} product{items.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Metal tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-0">
        {METALS.map((m) => {
          const count = PRODUCTS.filter((p) => p.metal === m.key).length;
          const isActive = active === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`relative rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                isActive
                  ? "border-gold text-foreground bg-card"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {m.label}
              <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isActive ? "bg-gold text-gold-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
