import { TrendingUp, TrendingDown, Minus, BarChart2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

const METALS_CONFIG = ["XAU", "XAG", "XPT", "XPD"];


const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

function PriceCard({ metal, isLoading }) {
  const meta = METAL_META[metal.symbol] ?? { name: metal.symbol, symbol: metal.symbol, unit: "oz" };
  const isUp = metal.trend === "up";
  const isDown = metal.trend === "down";
  const trendColor = isUp ? "text-emerald-500" : isDown ? "text-rose-500" : "text-white/40";
  const bgTrend = isUp ? "bg-emerald-500/10" : isDown ? "bg-rose-500/10" : "bg-white/5";

  return (
    <Link
      to="/live-charts"
      className="group flex flex-1 min-w-40 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:border-gold/40 hover:bg-white/8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: meta.color + "33", color: meta.color }}
          >
            {meta.symbol}
          </span>
          <span className="text-sm font-semibold text-white/90">{meta.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/30">{meta.unit}</span>
      </div>

      {isLoading ? (
        <div className="h-6 w-28 animate-pulse rounded bg-white/10" />
      ) : (
        <div className="flex items-end justify-between">
          <span className="font-mono text-xl font-bold tabular-nums text-white">
            {fmt(metal.price)}
          </span>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${bgTrend} ${trendColor}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {metal.trend === "up" ? "+" : ""}{metal.percentage}%
          </div>
        </div>
      )}
    </Link>
  );
}

export function LivePriceTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ["tickerPrices"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metals/latest?currencies=${METALS_CONFIG.join(",")}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const json = await response.json();
      console.log(json, "json");
      return json;
    },
    refetchInterval: 1000 * 60 * 5,
  });


  const formatPrice = (p) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(p);

  return (
    <div className="w-full bg-[oklch(0.17_0.04_255)] border-b border-white/8">
      <div className="mx-auto max-w-7xl px-4 lg:px-12 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              {!isLoading && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold whitespace-nowrap">
              Live Prices
            </span>
            <Link to="/live-charts" className="flex items-center gap-1 text-[11px] text-white/40 hover:text-gold transition-colors">
              <BarChart2 className="h-3.5 w-3.5" /> View Charts
            </Link>
          </div>

          {/* Price cards */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:gap-3">
            {isLoading
              ? skeletons.map((m) => <PriceCard key={m.symbol} metal={m} isLoading />)
              : cards.map((m) => <PriceCard key={m.symbol} metal={m} isLoading={false} />)
            }
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
