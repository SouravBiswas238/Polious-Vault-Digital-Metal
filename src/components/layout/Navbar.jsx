import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Menu, ShoppingCart, Tag, UserCircle2, ChevronDown,
  Receipt, CreditCard, Wallet, Users, LogIn, UserPlus, LogOut, X,
  Phone, BarChart2, Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.jpeg";

const accountMenu = [
  { to: "/account/transactions", label: "Transaction Summary", icon: Receipt },
  { to: "/account/profile", label: "My Profile", icon: UserCircle2 },
  { to: "/account/credit-card", label: "Credit Card", icon: CreditCard },
  { to: "/account/add-funds", label: "How to Add Funds", icon: Wallet },
  { to: "/account/refer", label: "Refer a Friend", icon: Users },
];

const navLinks = [
  { to: "/shop/gold", label: "Buy", icon: ShoppingCart },
  { to: "/sell", label: "Sell", icon: Tag },
  { to: "/live-charts", label: "Charts", icon: BarChart2 },
];

export function Navbar() {
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!accountRef.current?.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      {/* Top utility bar */}
      <div className="bg-[oklch(0.13_0.04_255)] text-white/70 text-[11px]">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> +447868176940
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-gold/80" />
              <span className="text-gold/80 font-medium">Insured by Lloyd's of London</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!user && (
              <>
                <Link to="/login" className="hover:text-gold transition-colors">Sign In</Link>
                <span className="text-white/30">|</span>
                <Link to="/register" className="hover:text-gold transition-colors">Create Account</Link>
              </>
            )}
            {user && (
              <span className="text-gold/90 font-medium">Welcome, {user?.personalInfo?.firstName || user?.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-[oklch(0.17_0.04_255)] border-b border-white/10">
        <div className="mx-auto flex h-17 max-w-7xl items-center justify-between gap-4 px-4 lg:px-12">
          {/* Logo + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Polyus Vault logo" className="h-9 w-9 rounded-md object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-gradient-gold">POLYUS VAULT</span>
                <span className="hidden sm:block text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">PRECIOUS METALS</span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 rounded px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <link.icon className="h-4 w-4 text-gold/70" />
                {link.label}
              </Link>
            ))}

            {/* Account dropdown — only shown when logged in */}
            {user ? (
              <div ref={accountRef} className="relative ml-2">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 ${accountOpen ? "bg-white/10 text-white" : "text-white/80"}`}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <UserCircle2 className="h-4 w-4 text-gold/70 capitalize" />
                  {user?.personalInfo?.firstName || user?.name}'s Account
                  <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[oklch(0.17_0.04_255)] shadow-2xl"
                      role="menu"
                    >
                      <div className="border-b border-white/10 px-4 py-3">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Signed in as</div>
                        <div className="truncate text-sm font-semibold text-white">{user?.personalInfo?.email || user?.email}</div>
                      </div>
                      <ul className="py-1.5">
                        {accountMenu.map((m) => (
                          <li key={m.to}>
                            <Link
                              to={m.to}
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                              role="menuitem"
                            >
                              <m.icon className="h-4 w-4 text-gold/60" />
                              {m.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/10 p-3">
                        <button
                          onClick={() => { setAccountOpen(false); logout(); }}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 rounded px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="h-4 w-4 text-gold/70" /> Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground hover:opacity-90 transition-opacity"
                >
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </div>
            )}
          </nav>

          {/* Right side: search + cart */}
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 w-48 xl:w-64 transition-all focus-within:border-gold/50 focus-within:bg-white/12">
              <Search className="h-4 w-4 text-white/40 shrink-0" />
              <input
                placeholder="Search bullion, coins…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>

            {/* Cart button */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-white/70 transition-colors hover:border-gold/50 hover:text-gold hover:bg-white/12"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground"
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-[oklch(0.14_0.04_255)]"
          >
            <div className="flex flex-col p-4 gap-0.5">
              <div className="mb-1 px-3 text-[10px] uppercase tracking-wider text-white/35">Navigation</div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <link.icon className="h-4 w-4 text-gold/60" />
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <div className="mt-3 mb-1 px-3 text-[10px] uppercase tracking-wider text-white/35">
                    {user.personalInfo.firstName}'s Account
                  </div>
                  {accountMenu.map((m) => (
                    <Link
                      key={m.to}
                      to={m.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <m.icon className="h-4 w-4 text-gold/50" />
                      {m.label}
                    </Link>
                  ))}
                </>
              )}

              <div className="mt-4 border-t border-white/10 pt-4">
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-destructive px-3 py-2.5 text-sm font-semibold text-white"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 px-3 py-2.5 text-sm font-semibold text-white/80 hover:text-gold transition-colors"
                    >
                      <LogIn className="h-4 w-4" /> Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-gold px-3 py-2.5 text-sm font-semibold text-gold-foreground"
                    >
                      <UserPlus className="h-4 w-4" /> Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
