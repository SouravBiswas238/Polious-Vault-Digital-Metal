import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// ─── Metal definitions ────────────────────────────────────────────────────────
const METALS = [
  { id: "gold",      label: "Gold",      series: "GOLDAMGBD228NLBM", unit: "USD / troy oz",   color: "#d4af37" },
  { id: "silver",    label: "Silver",    series: "SLVPRUSD",         unit: "USD / troy oz",   color: "#94a3b8" },
  { id: "platinum",  label: "Platinum",  series: "PLAT",             unit: "USD / troy oz",   color: "#8db4c8" },
  { id: "palladium", label: "Palladium", series: "PALLFNFINDEXM",    unit: "USD / troy oz",   color: "#a8c0b5" },
  { id: "copper",    label: "Copper",    series: "PCOPP_USD",        unit: "USD / lb",        color: "#c87941" },
];

// ─── Timeframes ───────────────────────────────────────────────────────────────
const TIMEFRAMES = [
  { label: "1M",  value: "1M" },
  { label: "6M",  value: "6M" },
  { label: "1Y",  value: "1Y" },
  { label: "5Y",  value: "5Y" },
  { label: "MAX", value: "MAX" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatXLabel(dateStr, timeframe) {
  const d = new Date(dateStr);
  if (timeframe === "MAX" || timeframe === "5Y") return d.getFullYear().toString();
  if (timeframe === "1M")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtPrice(value, digits = 2) {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }) ?? "—";
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
        <span style={{ fontSize: "0.65rem", color: "#888", marginLeft: 4 }}>{unit}</span>
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MetalChartsView() {
  const [activeMetalId, setActiveMetalId] = useState("gold");
  const [activeTimeframe, setActiveTimeframe] = useState("1Y");

  const metal = METALS.find((m) => m.id === activeMetalId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fredHistory", metal.series, activeTimeframe],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/metals/fred-history?series=${metal.series}&timeframe=${activeTimeframe}`
      );
      if (!res.ok) throw new Error("Failed to fetch historical data");
      return res.json();
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
    retry: 2,
  });

  // Build chart data
  const chartData = useMemo(() => {
    if (!data?.data?.length) return [];

    let points = [...data.data];

    // For large datasets, sample to ≤ 400 points for performance
    if (points.length > 400) {
      const step = Math.ceil(points.length / 400);
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
    if (chartData.length < 2) return null;
    const prices = chartData.map((d) => d.price);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const diff = last - first;
    const pct = (diff / first) * 100;
    return {
      current: last,
      change: diff,
      pct,
      isPositive: diff >= 0,
      low: Math.min(...prices),
      high: Math.max(...prices),
    };
  }, [chartData]);

  const yDomain = useMemo(() => {
    if (!stats) return [0, 100];
    const pad = (stats.high - stats.low) * 0.08 || stats.low * 0.05;
    return [stats.low - pad, stats.high + pad];
  }, [stats]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-12">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Live Market Charts
        </h2>
        <p className="mt-4 text-muted-foreground">
          Historical price data sourced from FRED · St. Louis Fed
        </p>
      </div>

      {/* Metal Tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-border bg-secondary/30 p-1">
        {METALS.map((m) => {
          const isActive = m.id === activeMetalId;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetalId(m.id)}
              style={isActive ? { borderColor: `${m.color}60`, color: m.color, background: `${m.color}12` } : {}}
              className={`flex-1 min-w-[80px] rounded-lg py-2.5 text-sm font-semibold transition-all border ${
                isActive
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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8 min-h-[520px] flex flex-col">

        {/* Header: Price + Timeframe */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {stats ? (
              <>
                <p style={{ color: "#888", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 4px" }}>
                  {metal.label} · {metal.unit}
                </p>
                <p style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "monospace", color: metal.color, lineHeight: 1, margin: 0 }}>
                  <span style={{ fontSize: "1.1rem" }}>$</span>
                  {fmtPrice(stats.current)}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: "0.875rem", fontWeight: 600, color: stats.isPositive ? "#22c55e" : "#ef4444" }}>
                  {stats.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>
                    {stats.isPositive ? "+" : ""}{fmtPrice(stats.change)} ({stats.isPositive ? "+" : ""}{stats.pct.toFixed(2)}%) · {activeTimeframe}
                  </span>
                </div>
              </>
            ) : !isLoading && !isError ? (
              <p className="text-muted-foreground text-sm">Awaiting data…</p>
            ) : null}
          </div>

          {/* Stats Pills */}
          {stats && (
            <div className="flex flex-wrap gap-2 items-center">
              {[
                { label: "Period Low",  value: `$${fmtPrice(stats.low)}`  },
                { label: "Period High", value: `$${fmtPrice(stats.high)}` },
                { label: "Data Points", value: chartData.length           },
              ].map((pill) => (
                <div key={pill.label} className="rounded-xl bg-secondary/50 border border-border/50 px-3 py-1.5 text-center">
                  <span className="block text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">{pill.label}</span>
                  <span className="block text-sm font-semibold font-mono">{pill.value}</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground italic">
                Updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="mb-5 flex gap-1 rounded-xl border border-border/50 bg-secondary/20 p-1 w-fit">
          {TIMEFRAMES.map((tf) => {
            const isActive = tf.value === activeTimeframe;
            return (
              <button
                key={tf.value}
                onClick={() => setActiveTimeframe(tf.value)}
                style={isActive ? { background: metal.color, color: "#111" } : {}}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  isActive ? "" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Chart Body */}
        <div className="flex-1 flex items-center justify-center min-h-[360px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin" style={{ color: metal.color }} />
              <p className="text-muted-foreground animate-pulse text-sm">Loading {metal.label} history…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 text-destructive text-center max-w-sm">
              <AlertCircle className="h-10 w-10" />
              <p className="font-semibold">Failed to load data</p>
              <p className="text-sm opacity-80">{error?.message || "Could not reach the price server."}</p>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`metalGradient-${activeMetalId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={metal.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={metal.color} stopOpacity={0.0}  />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={40}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #888)" }}
                />
                <YAxis
                  domain={yDomain}
                  tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(2)}`}
                  width={74}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #888)" }}
                />
                <Tooltip
                  content={<MetalTooltip color={metal.color} unit={metal.unit} />}
                  cursor={{ stroke: metal.color, strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={metal.color}
                  strokeWidth={2}
                  fill={`url(#metalGradient-${activeMetalId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: metal.color, stroke: "#fff", strokeWidth: 1.5 }}
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm">No data available for this time range.</p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-4 text-right text-[0.65rem] text-muted-foreground opacity-60">
          Source: FRED · Federal Reserve Bank of St. Louis · Series: {metal.series}
        </p>
      </div>
    </div>
  );
}
