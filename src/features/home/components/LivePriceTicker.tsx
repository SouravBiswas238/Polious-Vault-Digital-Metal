import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, LineChart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

type MetalPrice = {
  name: string;
  price: number;
  trend: "up" | "down" | "flat";
  change: number;
};

const BASE_PRICES = [
  { name: "Gold", price: 2425.5 },
  { name: "Silver", price: 31.15 },
  { name: "Platinum", price: 1040.0 },
  { name: "Palladium", price: 985.5 },
  { name: "Rhodium", price: 4750.0 },
];

export function LivePriceTicker() {
  const [prices, setPrices] = useState<MetalPrice[]>(
    BASE_PRICES.map((p) => ({ ...p, trend: "flat", change: 0 })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((current) =>
        current.map((p) => {
          // 40% chance to fluctuate each cycle
          if (Math.random() > 0.4) return p;

          const maxFluctuation = p.price * 0.0005; // 0.05% fluctuation max
          const change = Math.random() * maxFluctuation * 2 - maxFluctuation;

          if (Math.abs(change) < 0.01) return p; // ignore tiny changes

          const newPrice = p.price + change;
          return {
            ...p,
            price: newPrice,
            trend: change > 0 ? "up" : "down",
            change: change,
          };
        }),
      );
    }, 4000); // Every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(p);

  return (
    <div className="w-full border-b border-border/60 bg-card overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center px-6 lg:px-12 h-14">
        {/* Label */}
        <div className="flex items-center space-x-2 border-r border-border/60 pr-5 shrink-0 h-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold whitespace-nowrap">
            Live Ask Price
          </span>  <Link
            to="/live-charts"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-gold transition-colors"
          >
            <LineChart className="h-4 w-4" />
          </Link>
        </div>


        {/* Ticker Items */}
        <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center h-full">
          <div className="flex items-center space-x-6 px-4 h-full whitespace-nowrap">
            {prices.map((m) => (
              <div key={m.name} className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-foreground/80">{m.name}</span>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${m.name}-${m.trend}-${m.price.toFixed(2)}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center space-x-1.5"
                  >
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {formatPrice(m.price)}
                    </span>
                    {m.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {m.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                    {m.trend === "flat" && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
