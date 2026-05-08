import { TrendingUp, TrendingDown, Minus, LineChart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

const METALS_CONFIG = ["XAU", "XAG", "XPT", "XPD"];

const METAL_NAMES = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
};

export function LivePriceTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ["tickerPrices"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metals/latest?currencies=${METALS_CONFIG.join(",")}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const json = await response.json();

      // rates are metal-per-USD (e.g. XAU: 0.000523 oz per $1)
      // invert to get USD-per-metal (price per troy oz / unit)
      const rates = json.rates ?? {};
      return METALS_CONFIG.map((symbol) => ({
        symbol,
        name: METAL_NAMES[symbol] ?? symbol,
        price: rates[symbol] ? 1 / rates[symbol] : 0,
        trend: "neutral",
        percentage: "0.00",
      }));
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
    <div className="w-full border-b border-border/60 bg-card overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center px-6 lg:px-12 h-14">
        <div className="flex items-center space-x-2 border-r border-border/60 pr-5 shrink-0 h-full">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 ${isLoading ? 'hidden' : ''}`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold whitespace-nowrap">
            Live Market Chart
          </span>
          <Link to="/live-charts" className="text-muted-foreground hover:text-gold transition-colors">
            <LineChart className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center h-full">
          {isLoading && !data ? (
            <div className="flex items-center px-6 space-x-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs font-medium uppercase tracking-wider">Syncing Market...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-10 px-6 h-full whitespace-nowrap">
              {data?.map((m) => (
                <div key={m.symbol} className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-foreground/90">{m.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {formatPrice(m.price)}
                    </span>
                    <div className={`flex items-center space-x-1 ${m.trend === "up" ? "text-emerald-500" : m.trend === "down" ? "text-rose-500" : "text-muted-foreground"}`}>
                      {m.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : m.trend === "down" ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                      <span className="text-[11px] font-bold">
                        {m.trend === "up" ? "+" : ""}{m.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
