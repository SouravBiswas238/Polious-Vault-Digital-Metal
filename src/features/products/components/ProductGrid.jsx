import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle2, XCircle, Star, Loader2 } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { productApi } from "@/lib/api";
import { METALS } from "@/features/products/data/products";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function ProductCard({ p, index }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [hovered, setHovered] = useState(false);

  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => q + 1);

  // find the correct tier based on current qty
  const activeTier = useMemo(() => {
    if (!p.pricingTiers?.length) return null;
    // tiers are like "1+", "5+", "10+" — pick the highest matching floor
    const sorted = [...p.pricingTiers].sort((a, b) => {
      const numA = parseInt(a.qty) || 0;
      const numB = parseInt(b.qty) || 0;
      return numA - numB;
    });
    let match = sorted[0];
    for (const tier of sorted) {
      const floor = parseInt(tier.qty) || 0;
      if (qty >= floor) match = tier;
    }
    return match;
  }, [qty, p.pricingTiers]);

  const handleAdd = () => {
    if (!p.inStock) return;
    for (let i = 0; i < qty; i++) addItem({ ...p, id: p._id || p.id, price: activeTier?.wireCheck ?? p.price });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
    }, 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/8 hover:border-gold/30"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-secondary/40">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-secondary/60 text-muted-foreground text-xs">
            No image
          </div>
        )}

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
          {p.isBestseller && (
            <span className="rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Bestseller
            </span>
          )}
        </div>

        {/* Category chip */}
        {p.category && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/70 uppercase tracking-wider">
              {p.category}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-5 overflow-hidden">
        {/* Default card info */}
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/80">
            {p.metal}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
            {p.name}
          </h3>
          {p.weight && (
            <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-gold/60 text-gold/60" />
              {p.weight}
            </p>
          )}
        </div>

        {/* Price row (default) */}
        <div className="mt-4 border-t border-border/50 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">As Low As:</p>
          <p className="font-display text-2xl font-semibold text-gradient-gold tabular-nums">
            {fmt(p.price)}
          </p>
        </div>

        {/* Hover overlay — pricing table + qty + add to cart */}
        <div
          className="absolute inset-0 flex flex-col bg-card p-4 transition-transform duration-300 ease-out"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          {/* Pricing table */}
          <div className="flex-1 overflow-auto">
            {p.pricingTiers?.length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary text-muted-foreground">
                    <th className="py-1.5 px-2 text-left font-semibold">Qty</th>
                    <th className="py-1.5 px-2 text-right font-semibold">Wire/Check</th>
                    <th className="py-1.5 px-2 text-right font-semibold leading-tight">Credit Card/<br/>PayPal</th>
                    <th className="py-1.5 px-2 text-right font-semibold">Bitcoin</th>
                  </tr>
                </thead>
                <tbody>
                  {p.pricingTiers.map((tier, i) => {
                    const isActive = activeTier?.qty === tier.qty;
                    return (
                      <tr
                        key={i}
                        className={`border-t border-border/40 ${isActive ? "bg-amber-50" : ""}`}
                      >
                        <td className={`py-1.5 px-2 font-semibold ${isActive ? "text-amber-600" : "text-foreground"}`}>
                          {tier.qty}
                        </td>
                        <td className="py-1.5 px-2 text-right text-foreground">
                          {typeof tier.wireCheck === "number" ? fmt(tier.wireCheck) : tier.wireCheck}
                        </td>
                        <td className="py-1.5 px-2 text-right text-foreground">
                          {typeof tier.creditCard === "number" ? fmt(tier.creditCard) : tier.creditCard}
                        </td>
                        <td className="py-1.5 px-2 text-right text-foreground">
                          {typeof tier.bitcoin === "number" ? fmt(tier.bitcoin) : tier.bitcoin}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full pb-4">
                <p className="text-xs text-muted-foreground">{fmt(p.price)} per unit</p>
              </div>
            )}
          </div>

          {/* Qty + Add to Cart */}
          <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
            {p.inStock ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={decrement}
                    className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 bg-transparent py-2 text-center text-sm font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={increment}
                    className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  aria-label={`Add ${p.name} to cart`}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    added
                      ? "bg-emerald-500 text-white"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Added!
                      </motion.span>
                    ) : (
                      <motion.span key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ) : (
              <button disabled className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold bg-secondary text-muted-foreground cursor-not-allowed">
                <XCircle className="h-3.5 w-3.5" /> Sold Out
              </button>
            )}

            {p.availableInUS === false && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <svg className="h-3 w-3 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Currently Available in the US only.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid() {
  const [active, setActive] = useState("Gold");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productApi.list()
      .then((data) => { if (!cancelled) setAllProducts(Array.isArray(data) ? data : []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const items = useMemo(() => allProducts.filter((p) => p.metal === active), [allProducts, active]);
  const meta = METALS.find((m) => m.key === active);

  return (
    <section id="shop" className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      {/* Section header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Shop by Metal</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {meta?.label}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{meta?.tagline}</p>
        </div>
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {items.length} product{items.length !== 1 ? "s" : ""} available
          </p>
        )}
      </div>

      {/* Metal tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-0">
        {METALS.map((m) => {
          const count = allProducts.filter((p) => p.metal === m.key).length;
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

      {/* Loading */}
      {loading && (
        <div className="mt-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold/60" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Could not load products. Please try again later.
        </div>
      )}

      {/* Empty for this metal */}
      {!loading && !error && items.length === 0 && (
        <div className="mt-16 text-center text-sm text-muted-foreground">
          No {active} products available yet.
        </div>
      )}

      {/* Product grid */}
      {!loading && items.length > 0 && (
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
              <ProductCard key={p._id || p.id} p={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
