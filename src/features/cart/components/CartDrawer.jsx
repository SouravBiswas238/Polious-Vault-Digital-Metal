import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, Lock, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      navigate("/login?redirect=checkout");
    } else {
      alert("Checkout coming soon!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.45 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Gold accent top bar */}
            <div className="h-0.5 w-full bg-linear-to-r from-gold/20 via-gold to-gold/20 shrink-0" />

            {/* Header */}
            <header className="flex items-center justify-between border-b border-border/50 px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                  <ShoppingBag className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold leading-none">Your Vault</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                    {count} {count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-gold/40 hover:bg-gold/5 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/5 border border-gold/15">
                    <ShoppingBag className="h-8 w-8 text-gold/50" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Your vault is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground max-w-55 mx-auto leading-relaxed">
                      Add precious metals to begin building your collection.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 text-xs font-semibold text-gold hover:underline underline-offset-4"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                <ul className="space-y-1">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-4 border-b border-border/40 last:border-0">
                          {/* Product image */}
                          <div className="h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/40 shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Product info */}
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold/80">
                                  {item.metal} · {item.category}
                                </p>
                                <h3 className="mt-0.5 text-sm font-semibold leading-snug text-foreground line-clamp-2">
                                  {item.name}
                                </h3>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.weight}</p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label="Remove"
                                className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Qty + price */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center rounded-full border border-border/70 bg-secondary/30 overflow-hidden">
                                <button
                                  onClick={() => updateQty(item.id, item.qty - 1)}
                                  className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-7 text-center text-xs font-semibold tabular-nums text-foreground">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-gold"
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="text-sm font-bold text-gold tabular-nums">
                                {fmt(item.price * item.qty)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="border-t border-border/50 bg-secondary/20 px-6 pt-5 pb-6 shrink-0 space-y-4">
                {/* Order summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums font-medium text-foreground">{fmt(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Insured shipping</span>
                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total</p>
                    <p className="text-2xl font-bold text-gold tabular-nums leading-tight">
                      {fmt(total)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {count} {count === 1 ? "item" : "items"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Wire/Check price</p>
                  </div>
                </div>

                {/* Login notice */}
                {!user && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
                    <LogIn className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      <span className="font-semibold text-foreground">Login required</span> to complete your purchase. Your cart items will be saved.
                    </p>
                  </div>
                )}

                {/* Checkout button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-bold text-gold-foreground shadow-[0_8px_32px_-8px_oklch(0.78_0.13_80/0.5)] transition-shadow hover:shadow-[0_12px_40px_-8px_oklch(0.78_0.13_80/0.7)]"
                >
                  {user ? (
                    <><Lock className="h-4 w-4" /> Secure Checkout</>
                  ) : (
                    <><LogIn className="h-4 w-4" /> Sign In to Checkout</>
                  )}
                </motion.button>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold/60" />
                  KYC verified · Insured by Lloyd's of London
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
