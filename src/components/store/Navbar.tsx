import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  ShoppingCart,
  Tag,
  UserCircle2,
  ChevronDown,
  Receipt,
  CreditCard,
  Wallet,
  Users,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import logo from "@/assets/logo.jpeg";

const accountMenu = [
  { to: "/account/transactions", label: "Transaction Summary", icon: Receipt },
  { to: "/account/profile", label: "My Profile", icon: UserCircle2 },
  { to: "/account/credit-card", label: "Credit Card", icon: CreditCard },
  { to: "/account/add-funds", label: "How to Add Funds", icon: Wallet },
  { to: "/account/refer", label: "Refer a Friend", icon: Users },
];

export function Navbar() {
  const { count, openCart } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 lg:px-12">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-white/80"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
            <img src={logo} alt="Polyus Vault logo" className="h-9 w-9 rounded-md object-contain" />
            <span className="text-gradient-gold">POLYUS</span>
            <span className="hidden sm:inline text-white/85">VAULT</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <ShoppingCart className="h-4 w-4" /> Buy From Us
          </Link>
          <Link
            to="/sell"
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <Tag className="h-4 w-4" /> Sell To Us
          </Link>

          <div ref={accountRef} className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10 hover:text-gold ${
                accountOpen ? "bg-white/10 text-gold" : "text-white/90"
              }`}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
            >
              <UserCircle2 className="h-4 w-4" /> My Account
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
                  role="menu"
                >
                  <div className="border-b border-border bg-foreground px-4 py-3 text-background">
                    <div className="text-xs uppercase tracking-wider text-background/60">Signed in as</div>
                    <div className="truncate text-sm font-semibold">guest@polyusvault.com</div>
                  </div>
                  <ul className="py-2">
                    {accountMenu.map((m) => (
                      <li key={m.to}>
                        <Link
                          to={m.to}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary hover:text-gold"
                          role="menuitem"
                        >
                          <m.icon className="h-4 w-4 text-muted-foreground" />
                          {m.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2 border-t border-border bg-secondary/40 p-3">
                    <Link
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:border-gold/60 hover:text-gold"
                    >
                      <LogIn className="h-3.5 w-3.5" /> Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-md bg-gold px-3 py-2 text-xs font-semibold text-gold-foreground hover:opacity-90"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Register
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-4 py-2 w-56 xl:w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search bullion, coins…"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-secondary/40 transition-colors hover:border-gold/60 hover:text-gold"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-semibold text-gold-foreground"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="flex flex-col p-4 gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">
                <ShoppingCart className="h-4 w-4 text-gold" /> Buy From Us
              </Link>
              <Link to="/sell" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold hover:bg-secondary">
                <Tag className="h-4 w-4 text-gold" /> Sell To Us
              </Link>
              <div className="mt-2 mb-1 px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                My Account
              </div>
              {accountMenu.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
                >
                  <m.icon className="h-4 w-4 text-muted-foreground" /> {m.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-sm font-semibold">
                  <LogIn className="h-4 w-4" /> Log In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 rounded-md bg-gold px-3 py-2.5 text-sm font-semibold text-gold-foreground">
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
