import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Weight } from "lucide-react";
import { metalsApi } from "@/lib/api";

// ─── Metal definitions ────────────────────────────────────────────────────────
const METALS = [
  { id: "XAU", label: "Gold", color: "#d4af37" },
  { id: "XAG", label: "Silver", color: "#94a3b8" },
  { id: "XPT", label: "Platinum", color: "#8db4c8" },
  { id: "XPD", label: "Palladium", color: "#a8c0b5" },
];

// ─── Timeframes ───────────────────────────────────────────────────────────────
const TIMEFRAMES = [
  { label: "1d", value: "1d" },
  { label: "1w", value: "1w" },
  { label: "1m", value: "1m" },
  { label: "3m", value: "3m" },
  { label: "6m", value: "6m" },
  { label: "1y", value: "1y" },
  { label: "5y", value: "5y" },
  { label: "10y", value: "10y" },
  { label: "All", value: "all" },
];

// ─── Weight Units ─────────────────────────────────────────────────────────────
const WEIGHT_UNITS = [
  { label: "Ounce", value: "ounce" },
  { label: "Gram", value: "gram" },
  { label: "KG", value: "kg" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatXLabel(dateStr, timeframe) {
  const d = new Date(dateStr);
  if (timeframe === "all" || timeframe === "10y" || timeframe === "5y") return d.getFullYear().toString();
  if (timeframe === "1d")
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (timeframe === "1w" || timeframe === "1m")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtPrice(value, digits = 2) {
  if (value === undefined || value === null) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function MetalTooltip({ active, payload, label, color, unit }) {
  if (!active || !payload?.length) return null;
  const price = payload[0]?.value;
  return (
    <div style={{
      background: "rgba(10,8,5,0.92)",
      border: `1px solid ${color}55`,
      borderRadius: 10,
      padding: "10px 14px",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      <p style={{ fontSize: "0.7rem", color: "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: "1rem", fontWeight: 700, color, fontFamily: "monospace", margin: "0 0 2px" }}>
        ${fmtPrice(price)}
        <span style={{ fontSize: "0.65rem", color: "#888", marginLeft: 4 }}>USD / {unit}</span>
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MetalChartsView() {
  const [activeMetalId, setActiveMetalId] = useState("XAU");
  const [activeTimeframe, setActiveTimeframe] = useState("1y");
  const [activeWeightUnit, setActiveWeightUnit] = useState("ounce");

  const metal = METALS.find((m) => m.id === activeMetalId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["metalChart", activeMetalId, activeTimeframe, activeWeightUnit],
    queryFn: async () => {
      return metalsApi.proxy(activeMetalId, activeTimeframe, activeWeightUnit);
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 2,
  });

  // Build chart data
  const chartData = useMemo(() => {
    if (!data?.prices_list?.length) return [];

    let points = [...data.prices_list];

    // Sample if too many points
    if (points.length > 500) {
      const step = Math.ceil(points.length / 500);
      points = points.filter((_, i) => i % step === 0 || i === points.length - 1);
    }

    return points.map((d) => ({
      dateStr: d.date,
      label: formatXLabel(d.date, activeTimeframe),
      price: d.price,
    }));
  }, [data, activeTimeframe]);

  // Stats
  const stats = useMemo(() => {
    if (!data || !chartData.length) return null;
    
    const changes = data.price_changes;
    const isPositive = changes?.change_sign !== "-";
    
    const prices = chartData.map(d => d.price);
    
    return {
      current: data.spot_price?.ask || prices[prices.length - 1],
      change: changes?.difference || 0,
      pct: changes?.percentage?.number || 0,
      isPositive,
      low: Math.min(...prices),
      high: Math.max(...prices),
      unit: activeWeightUnit
    };
  }, [data, chartData, activeWeightUnit]);

  const yDomain = useMemo(() => {
    if (!stats) return [0, 100];
    const pad = (stats.high - stats.low) * 0.1 || stats.low * 0.02;
    return [Math.max(0, stats.low - pad), stats.high + pad];
  }, [stats]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-12">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Live Market Charts
        </h2>
        <p className="mt-4 text-muted-foreground">
          Real-time price data sourced from Global Markets · Gold Avenue
        </p>
      </div>

      {/* Metal Tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5 rounded-xl border border-border bg-secondary/30 p-1">
        {METALS.map((m) => {
          const isActive = m.id === activeMetalId;
          return (
            <button
              key={m.id}
              id={`tab-${m.id.toLowerCase()}`}
              onClick={() => setActiveMetalId(m.id)}
              style={isActive ? { borderColor: `${m.color}60`, color: m.color, background: `${m.color}12` } : {}}
              className={`flex-1 min-w-[80px] rounded-lg py-2.5 text-sm font-semibold transition-all border ${isActive
                ? "shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Chart Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8 min-h-[580px] flex flex-col">

        {/* Header: Price + Controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            {stats ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ color: "#888", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                    {metal.label} Spot Price · USD / {stats.unit}
                  </p>
                </div>
                <p style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "monospace", color: metal.color, lineHeight: 1, margin: 0 }}>
                  <span style={{ fontSize: "1.2rem", verticalAlign: "super", marginRight: 2 }}>$</span>
                  {fmtPrice(stats.current)}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: "0.95rem", fontWeight: 600, color: stats.isPositive ? "#22c55e" : "#ef4444" }}>
                  {stats.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>
                    {stats.isPositive ? "+" : ""}{fmtPrice(stats.change)} ({stats.pct.toFixed(2)}%)
                  </span>
                  <span className="text-muted-foreground font-normal text-sm ml-1">past {activeTimeframe}</span>
                </div>
              </>
            ) : !isLoading && !isError ? (
              <p className="text-muted-foreground text-sm">Awaiting data…</p>
            ) : null}
          </div>

          {/* Right side controls */}
          <div className="flex flex-col gap-4 items-end">
            {/* Weight Selector */}
            <div className="flex items-center gap-2 p-1 bg-secondary/20 rounded-xl border border-border/50">
              <div className="pl-2 pr-1 text-muted-foreground">
                <Weight size={14} />
              </div>
              {WEIGHT_UNITS.map((u) => {
                const isActive = u.value === activeWeightUnit;
                return (
                  <button
                    key={u.value}
                    id={`weight-${u.value}`}
                    onClick={() => setActiveWeightUnit(u.value)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isActive 
                      ? "bg-foreground text-background shadow-md" 
                      : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>

            {/* Timeframe Selector */}
            <div className="flex flex-wrap gap-1 rounded-xl border border-border/50 bg-secondary/20 p-1">
              {TIMEFRAMES.map((tf) => {
                const isActive = tf.value === activeTimeframe;
                return (
                  <button
                    key={tf.value}
                    id={`period-${tf.value}`}
                    onClick={() => setActiveTimeframe(tf.value)}
                    style={isActive ? { background: metal.color, color: "#111" } : {}}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? "shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Summary Pills */}
        {stats && (
          <div className="mb-6 flex flex-wrap gap-3">
             {[
                { label: "Period Low", value: `$${fmtPrice(stats.low)}` },
                { label: "Period High", value: `$${fmtPrice(stats.high)}` },
                { label: "Volatility", value: `${((stats.high - stats.low) / stats.low * 100).toFixed(2)}%` },
              ].map((pill) => (
                <div key={pill.label} className="rounded-xl bg-secondary/40 border border-border/40 px-4 py-2 flex flex-col">
                  <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-0.5">{pill.label}</span>
                  <span className="text-sm font-semibold font-mono">{pill.value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Chart Body */}
        <div className="flex-1 flex items-center justify-center min-h-[360px] relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin" style={{ color: metal.color }} />
              <p className="text-muted-foreground animate-pulse text-sm">Synchronizing with live markets…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 text-destructive text-center max-w-sm">
              <AlertCircle className="h-10 w-10" />
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm opacity-80">{error?.message || "Could not reach the market data provider."}</p>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`metalGradient-${activeMetalId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metal.color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={metal.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={60}
                  tick={{ fontSize: 10, fill: "#888", fontWeight: 500 }}
                />
                <YAxis
                  domain={yDomain}
                  tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(0)}`}
                  width={60}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10, fill: "#888", fontWeight: 500 }}
                />
                <Tooltip
                  content={<MetalTooltip color={metal.color} unit={activeWeightUnit} />}
                  cursor={{ stroke: metal.color, strokeWidth: 1.5, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={metal.color}
                  strokeWidth={2.5}
                  fill={`url(#metalGradient-${activeMetalId})`}
                  dot={false}
                  activeDot={{ r: 5, fill: metal.color, stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm">No historical data available for this selection.</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <p className="text-[0.65rem] text-muted-foreground opacity-70 italic">
            Last Updated: {new Date().toLocaleTimeString()} · Data: Gold Avenue Market API
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[0.65rem] text-muted-foreground font-medium uppercase tracking-tighter">Live Market Feed</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

