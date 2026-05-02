import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, Lock } from "lucide-react";
import { useCart } from "./CartContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.45 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/60 bg-card shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-display text-xl font-semibold">Your Vault</h2>
                <span className="text-sm text-muted-foreground">({count})</span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/60">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-display text-lg">Your vault is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add precious metals to begin your collection.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 py-5"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-background">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {item.category}
                              </p>
                              <h3 className="mt-0.5 font-display text-base font-semibold leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">{item.weight}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove"
                              className="text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-border/80">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-gold"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium tabular-nums">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-gold"
                                aria-label="Increase"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="font-display text-base text-gold">{fmt(item.price * item.qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border/60 px-6 py-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{fmt(total)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Insured shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-4">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-2xl text-gradient-gold tabular-nums">{fmt(total)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-semibold text-gold-foreground transition-shadow hover:shadow-[0_10px_40px_-10px_oklch(0.78_0.13_80/0.6)]"
                >
                  <Lock className="h-4 w-4" />
                  Secure Checkout
                </motion.button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  KYC verification required · Insured by Lloyd's of London
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
