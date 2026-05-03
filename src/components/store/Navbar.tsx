import { motion } from "framer-motion";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "./CartContext";
import logo from "@/assets/logo.jpeg";

const navLinks = ["Bullion", "Coins", "Jewelry", "Storage", "Live Prices"];

export function Navbar() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-foreground/80" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <a href="/" className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
            <img src={logo} alt="Polyus Vault logo" className="h-9 w-9 rounded-md object-contain" />
            <span className="text-gradient-gold">POLYUS</span>
            <span className="text-foreground/80">VAULT</span>
          </a>
        </div>

        <nav className="hidden lg:flex items-center gap-9 text-sm font-medium text-foreground/70">
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              className="relative transition-colors hover:text-gold after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-4 py-2 w-64">
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
    </header>
  );
}
