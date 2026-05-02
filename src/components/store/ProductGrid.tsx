import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "./CartContext";
import { PRODUCTS } from "./products";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function ProductGrid() {
  const { addItem } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Curated Collection</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Featured precious metals
          </h2>
        </div>
        <a href="#" className="text-sm font-medium text-foreground/70 underline-offset-4 hover:text-gold hover:underline">
          Browse all products →
        </a>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <button
                onClick={() => addItem(p)}
                aria-label={`Add ${p.name} to cart`}
                className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 shadow-lg transition-all duration-500 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>
                <h3 className="mt-1 font-display text-xl font-semibold leading-tight">{p.name}</h3>
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
