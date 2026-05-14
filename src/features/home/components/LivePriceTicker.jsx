import { TrendingUp, TrendingDown, Minus, BarChart2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const METALS_CONFIG = ["XAU", "XAG", "XPT", "XPD"];

const METAL_META = {
  XAU: { name: "Gold",      symbol: "XAU", unit: "oz", color: "#EAB308" },
  XAG: { name: "Silver",    symbol: "XAG", unit: "oz", color: "#94A3B8" },
  XPT: { name: "Platinum",  symbol: "XPT", unit: "oz", color: "#8DB4C8" },
  XPD: { name: "Palladium", symbol: "XPD", unit: "oz", color: "#A8C0B5" },
};

const fmt = (n) =>
  n != null
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n)
    : "—";

// Fetches live data for one metal from Gold Avenue
const fetchMetal = async (symbol) => {
  const url = `https://api.goldavenue.com/api/v1/live_chart?metal_iso=${symbol}&currency_iso=USD&period=1d&weight_unit=ounce`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}: HTTP ${res.status}`);
  const json = await res.json();

  const price = json.spot_price?.ask ?? null;
  const changeSign = json.price_changes?.change_sign;
  const trend = changeSign === "+" ? "up" : changeSign === "-" ? "down" : "flat";
  const percentage = Number((json.price_changes?.percentage?.number ?? 0).toFixed(2));
  const difference = json.price_changes?.difference ?? 0;

  return {
    symbol,
    price,
    trend,
    percentage,
    difference,
    spot_price: json.spot_price,
    price_changes: json.price_changes,
  };
};

function PriceCard({ symbol, data, isLoading, isError }) {
  const meta = METAL_META[symbol];
  const isUp = data?.trend === "up";
  const isDown = data?.trend === "down";
  const trendColor = isUp ? "text-emerald-500" : isDown ? "text-rose-500" : "text-white/40";
  const bgTrend  = isUp ? "bg-emerald-500/10" : isDown ? "bg-rose-500/10" : "bg-white/5";

  if (isLoading) {
    return (
      <div className="flex flex-1 min-w-40 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex items-end justify-between mt-auto">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-1 min-w-40 flex-col gap-2 rounded-xl border border-rose-500/20 bg-white/5 px-5 py-4 justify-center items-center">
        <span style={{ color: meta.color, fontSize: "0.65rem", fontWeight: 700 }}>{symbol}</span>
        <span className="text-rose-400 text-[10px]">Unavailable</span>
      </div>
    );
  }

  return (
    <Link
      to="/live-charts"
      className="group flex flex-1 min-w-40 flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:border-gold/40 hover:bg-white/8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ backgroundColor: meta.color + "33", color: meta.color }}
          >
            {meta.symbol}
          </span>
          <span className="text-sm font-semibold text-white/90">{meta.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-white/30">{meta.unit}</span>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-mono text-xl font-bold tabular-nums text-white">
          {fmt(data.price)}
        </span>
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${bgTrend} ${trendColor}`}>
          {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {isUp ? "+" : ""}{data.percentage}%
        </div>
      </div>

      {/* Difference line */}
      <div className={`text-[10px] ${trendColor} font-mono`}>
        {isUp ? "▲" : isDown ? "▼" : "—"} {isUp ? "+" : ""}{Number(data.difference ?? 0).toFixed(2)} today
      </div>
    </Link>
  );
}

export function LivePriceTicker() {
  // Fire 4 independent queries — one per metal — all in parallel
  const queries = useQueries({
    queries: METALS_CONFIG.map((symbol) => ({
      queryKey: ["liveTicker", symbol],
      queryFn: () => fetchMetal(symbol),
      refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
      staleTime: 1000 * 60 * 4,
    })),
  });

  const isAnyLoading = queries.some((q) => q.isLoading);

  return (
    <div className="w-full bg-[oklch(0.17_0.04_255)] border-b border-white/8">
      <div className="mx-auto max-w-7xl px-4 lg:px-12 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              {!isAnyLoading && (
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

          {/* Price cards — one per metal */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:gap-3">
            {METALS_CONFIG.map((symbol, i) => (
              <PriceCard
                key={symbol}
                symbol={symbol}
                data={queries[i].data}
                isLoading={queries[i].isLoading}
                isError={queries[i].isError}
              />
            ))}
          </div>

          {isAnyLoading && (
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
