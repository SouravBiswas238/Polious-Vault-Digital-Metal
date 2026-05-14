import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, Lock, LogIn, ShieldCheck, Building2, CreditCard, Wallet, Bitcoin, ChevronLeft, MessageCircle, Loader2, ShoppingCart, Info, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const PAYMENT_METHODS = [
  {
    id: "card",
    icon: "https://img.icons8.com/color/96/visa.png",
    label: "Credit / Debit Card",
    desc: "Instant · 2.9% processing fee",
    badge: null,
  },
  {
    id: "google-pay",
    icon: "https://img.icons8.com/color/96/google-pay.png",
    label: "Google Pay",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "PayPal",
    icon: "https://img.icons8.com/color/96/paypal.png",
    label: "PayPal",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "eCheck",
    icon: "https://img.icons8.com/color/96/bank.png",
    label: "eCheck (ACH)",
    desc: "2–4 business days · No fee",
    badge: null,
  },
  {
    id: "wire",
    icon: "https://img.icons8.com/color/96/globe.png",
    label: "Bank Wire Transfer",
    desc: "1–2 business days · No fee",
    badge: "Most Popular",
  },
  {
    id: "crypto",
    icon: "https://img.icons8.com/color/96/bitcoin.png",
    label: "Cryptocurrency",
    desc: "1 confirmation · 0.5% fee",
    badge: null,
  },
];

const SELL_PAYMENT_METHODS = [
  {
    id: "card",
    icon: "https://img.icons8.com/color/96/visa.png",
    label: "Credit / Debit Card",
    desc: "Instant · 2.9% processing fee",
    badge: null,
  },
  {
    id: "google-pay",
    icon: "https://img.icons8.com/color/96/google-pay.png",
    label: "Google Pay",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "PayPal",
    icon: "https://img.icons8.com/color/96/paypal.png",
    label: "PayPal",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "eCheck",
    icon: "https://img.icons8.com/color/96/bank.png",
    label: "eCheck (ACH)",
    desc: "2–4 business days · No fee",
    badge: null,
  },
  {
    id: "wire",
    icon: "https://img.icons8.com/color/96/globe.png",
    label: "Bank Wire Transfer",
    desc: "1–2 business days · No fee",
    badge: "Most Popular",
  },
  {
    id: "crypto",
    icon: "https://img.icons8.com/color/96/bitcoin.png",
    label: "Cryptocurrency",
    desc: "1 confirmation · 0.5% fee",
    badge: null,
  },
];

export function CartDrawer() {
  const {
    buyItems, sellItems,
    isOpen, closeCart,
    removeBuyItem, updateBuyQty,
    removeSellItem, updateSellQty,
    buyTotal, sellTotal,
    buyCount, sellCount,
    clearBuyCart, clearSellCart
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("buy");
  const [step, setStep] = useState("cart");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetDrawer = () => {
    setStep("cart");
    setSelectedMethod(null);
    setLoading(false);
  };

  const handleClose = () => {
    closeCart();
    resetDrawer();
  };

  const items = activeTab === "buy" ? buyItems : sellItems;
  const total = activeTab === "buy" ? buyTotal : sellTotal;
  const count = activeTab === "buy" ? buyCount : sellCount;
  const removeItem = activeTab === "buy" ? removeBuyItem : removeSellItem;
  const updateQty = activeTab === "buy" ? updateBuyQty : updateSellQty;
  const clearCart = activeTab === "buy" ? clearBuyCart : clearSellCart;

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      navigate("/login?redirect=checkout");
      return;
    }
    setStep("payment");
  };

  const handleConfirmSale = (method) => {
    setLoading(true);
    const cartLines = items
      .map((item) => `• ${item.name} (${item.metal}, ${item.weight}) x${item.qty} = ${fmt(item.price * item.qty)}`)
      .join("\n");

    const fullName = `${user.personalInfo?.firstName || ""} ${user.personalInfo?.lastName || ""}`.trim() || "Customer";
    const email = user.personalInfo?.email || "";
    const phone = user.personalInfo?.phoneNumber || "";

    const orderNote = [
      "💰 SELL REQUEST",
      "",
      `Customer : ${fullName}`,
      `User ID  : ${user._id || "N/A"}`,
      `Email    : ${email}`,
      "",
      "Items I want to sell:",
      cartLines,
      "",
      `Estimated Buyback Total : ${fmt(total)} (${count} item${count !== 1 ? "s" : ""})`,
      `Preferred Payout Method : ${method.label}`,
      "",
      "Please assist me in completing this sale to Polyus Vault.",
    ].join("\n");

    window.ssq = window.ssq || [];
    window.ssq.push("setCustomer", {
      user_id: user._id || email,
      name: fullName,
      email,
      phone,
      description: orderNote,
    });
    window.ssq.push("chatOpen");

    setTimeout(() => {
      window.ssq.push("sendTextMessage", orderNote);
      setLoading(false);
      clearCart();
      handleClose();
    }, 1000);
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod) return;
    const method = (activeTab === "buy" ? PAYMENT_METHODS : SELL_PAYMENT_METHODS).find((m) => m.id === selectedMethod);

    if (activeTab === "sell") {
      handleConfirmSale(method);
      return;
    }

    setLoading(true);

    const cartLines = items
      .map((item) => `• ${item.name} (${item.metal}, ${item.weight}) x${item.qty} = ${fmt(item.price * item.qty)}`)
      .join("\n");

    const fullName = `${user.personalInfo?.firstName || ""} ${user.personalInfo?.lastName || ""}`.trim() || "Customer";
    const email = user.personalInfo?.email || "";
    const phone = user.personalInfo?.phoneNumber || "";

    const orderNote = [
      "🛒 BUY ORDER REQUEST",
      "",
      `Customer : ${fullName}`,
      `User ID  : ${user._id || "N/A"}`,
      `Email    : ${email}`,
      "",
      "Cart Items:",
      cartLines,
      "",
      `Order Total    : ${fmt(total)} (${count} item${count !== 1 ? "s" : ""})`,
      `Payment Method : ${method.label}`,
      "",
      "Please assist me in completing this purchase.",
    ].join("\n");

    window.ssq = window.ssq || [];
    window.ssq.push("setCustomer", {
      user_id: user._id || email,
      name: fullName,
      email,
      phone,
      description: orderNote,
    });
    window.ssq.push("chatOpen");

    setTimeout(() => {
      window.ssq.push("sendTextMessage", orderNote);
      setLoading(false);
      clearCart();
      handleClose();
    }, 1000);
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
            onClick={handleClose}
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
                {step === "payment" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors mr-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                  <ShoppingBag className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold leading-none">
                    {step === "payment"
                      ? (activeTab === "buy" ? "Select Payment" : "Select Payout")
                      : "Cart"}
                  </h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-gold/40 hover:bg-gold/5 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            {/* Tabs */}
            {step === "cart" && (
              <div className="px-6 py-3 bg-secondary/10 flex gap-1">
                <button
                  onClick={() => setActiveTab("buy")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "buy"
                      ? "bg-[#1e3a5f] text-white shadow-md"
                      : "text-muted-foreground hover:bg-secondary/20"
                    }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buy from Polyus
                  <Info className="h-3 w-3 opacity-60" />
                </button>
                <button
                  onClick={() => setActiveTab("sell")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "sell"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-muted-foreground hover:bg-secondary/20"
                    }`}
                >
                  <Tag className="h-4 w-4" />
                  Sell to Polyus {sellCount > 0 && `(${sellCount})`}
                </button>
              </div>
            )}

            {/* ── STEP: CART ── */}
            {step === "cart" && (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/5 border border-gold/15">
                        <ShoppingBag className="h-8 w-8 text-gold/50" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {activeTab === "buy" ? "Your vault is empty" : "Nothing to sell yet"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground max-w-55 mx-auto leading-relaxed">
                          {activeTab === "buy"
                            ? "Add precious metals to begin building your collection."
                            : "Select items from our list that you want to sell back to us."}
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="mt-2 text-xs font-semibold text-gold hover:underline underline-offset-4"
                      >
                        {activeTab === "buy" ? "Continue Shopping →" : "Browse Sell List →"}
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
                                  <p className={`text-sm font-bold tabular-nums ${activeTab === 'buy' ? 'text-gold' : 'text-emerald-600'}`}>
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
                        <span className="text-muted-foreground">{activeTab === "buy" ? "Subtotal" : "Estimated Total"}</span>
                        <span className="tabular-nums font-medium text-foreground">{fmt(total)}</span>
                      </div>
                      {activeTab === "buy" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Insured shipping</span>
                          <span className="text-muted-foreground italic">Calculated at checkout</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                          {activeTab === "buy" ? "Total" : "Total Buyback"}
                        </p>
                        <p className={`text-2xl font-bold tabular-nums leading-tight ${activeTab === 'buy' ? 'text-gold' : 'text-emerald-600'}`}>
                          {fmt(total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {count} {count === 1 ? "item" : "items"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activeTab === "buy" ? "Wire/Check price" : "Live Market Price"}
                        </p>
                      </div>
                    </div>

                    {/* Login notice */}
                    {!user && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
                        <LogIn className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          <span className="font-semibold text-foreground">Login required</span> to {activeTab === "buy" ? "complete your purchase" : "request a buyback"}.
                        </p>
                      </div>
                    )}

                    {/* Checkout/Sell button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={loading}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold shadow-lg transition-all ${activeTab === "buy"
                          ? "bg-[#1e3a5f] text-white hover:bg-[#162c4a]"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user ? (
                        activeTab === "buy" ? (
                          <><Lock className="h-4 w-4" /> Secure Checkout</>
                        ) : (
                          <><Tag className="h-4 w-4" /> Sell to Polyus</>
                        )
                      ) : (
                        <><LogIn className="h-4 w-4" /> Sign In to {activeTab === "buy" ? "Checkout" : "Sell"}</>
                      )}
                    </motion.button>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-gold/60" />
                      KYC verified · Insured by Lloyd's of London
                    </div>
                  </footer>
                )}
              </>
            )}

            {/* ── STEP: PAYMENT METHOD ── */}
            {step === "payment" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Order summary strip */}
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {activeTab === "buy" ? "Order Total" : "Buyback Total"}
                    </span>
                    <span className={`text-lg font-bold tabular-nums ${activeTab === 'buy' ? 'text-gold' : 'text-emerald-600'}`}>
                      {fmt(total)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {count} item{count !== 1 ? "s" : ""} · {activeTab === "buy" ? "Wire/Cheque price" : "Live Market Price"}
                  </p>
                </div>

                {/* Payment method list */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {activeTab === "buy"
                      ? "Select your preferred payment method. Our support team will contact you with the full payment instructions."
                      : "Select how you'd like to receive your payment. Our team will verify the items and issue your funds via the chosen method."}
                  </p>

                  {(activeTab === "buy" ? PAYMENT_METHODS : SELL_PAYMENT_METHODS).map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${isSelected
                          ? "border-gold bg-gold/8 shadow-[0_0_0_1px_oklch(0.78_0.13_80/0.3)]"
                          : "border-border/60 bg-secondary/20 hover:border-gold/40 hover:bg-gold/4"
                          }`}
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${isSelected ? "border-gold/40 bg-gold/15" : "border-border/50 bg-secondary/40"
                          }`}>
                          {typeof method.icon === "string" ? (
                            <img src={method.icon} alt={method.label} className="h-7 w-7 object-contain" />
                          ) : (
                            <method.icon className={`h-6 w-6 ${isSelected ? "text-gold" : "text-muted-foreground"}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                              {method.label}
                            </p>
                            {method.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25">
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                        </div>
                        {/* Radio indicator */}
                        <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-gold" : "border-border"
                          }`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-gold" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Confirm footer */}
                <div className="border-t border-border/50 bg-secondary/20 px-6 py-5 space-y-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: selectedMethod ? 1.01 : 1 }}
                    whileTap={{ scale: selectedMethod ? 0.98 : 1 }}
                    onClick={handleConfirmPayment}
                    disabled={!selectedMethod || loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-bold text-gold-foreground shadow-[0_8px_32px_-8px_oklch(0.78_0.13_80/0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_12px_40px_-8px_oklch(0.78_0.13_80/0.7)]"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Connecting to Support…</>
                    ) : (
                      <><MessageCircle className="h-4 w-4" /> Confirm &amp; Contact Support</>
                    )}
                  </motion.button>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold/60" />
                    Your order details will be sent to our support team via live chat
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
