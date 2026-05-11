/**
 * GoldHistoricalChart
 * ───────────────────
 * A self-contained chart component that fetches gold price data from
 * https://freegoldapi.com/data/latest.json and displays it with
 * Kitco-style time-range filters (1M · 3M · 6M · 1Y · 5Y · MAX).
 *
 * HOW TO USE IN MetalChartsView.jsx
 * ──────────────────────────────────
 * 1. Import at top of MetalChartsView.jsx:
 *      import { GoldHistoricalChart } from "./GoldHistoricalChart";
 *
 * 2. In the Gold tab panel, replace the existing chart content with:
 *      <GoldHistoricalChart />
 *
 * HOW TO REMOVE
 * ─────────────
 * Delete the two lines above. This file and MetalChartsView.jsx are
 * completely independent — removing the import leaves zero side-effects.
 */

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_GOLD_API = "https://freegoldapi.com/data/latest.json";

const TIME_RANGES = [
  { label: "1M",  months: 1   },
  { label: "3M",  months: 3   },
  { label: "6M",  months: 6   },
  { label: "1Y",  months: 12  },
  { label: "5Y",  months: 60  },
  { label: "MAX", months: null },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function subtractMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

function formatXLabel(dateStr, rangeMonths) {
  const d = new Date(dateStr);
  if (!rangeMonths || rangeMonths >= 60) {
    return d.getFullYear().toString();
  }
  if (rangeMonths <= 3) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function GoldTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const price = payload[0]?.value;
  return (
    <div className="gold-tooltip">
      <p className="gold-tooltip__date">{label}</p>
      <p className="gold-tooltip__price">
        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="gold-tooltip__unit"> / troy oz</span>
      </p>
      <p className="gold-tooltip__source">{payload[0]?.payload?.source}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GoldHistoricalChart() {
  const [activeRange, setActiveRange] = useState("1Y");

  // Fetch full dataset once and cache it
  const { data: rawData, isLoading, isError, error } = useQuery({
    queryKey: ["freeGoldApiAllData"],
    queryFn: async () => {
      const res = await fetch(FREE_GOLD_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch gold data`);
      return res.json(); // Array<{ date: string, price: number, source: string }>
    },
    staleTime: 1000 * 60 * 60 * 6, // 6 hours — data only updates daily
    retry: 2,
  });

  // Derive chart data based on selected time range
  const chartData = useMemo(() => {
    if (!rawData?.length) return [];

    const rangeMonths = TIME_RANGES.find((r) => r.label === activeRange)?.months ?? null;

    // Filter to only USD-priced recent records (post-1970 USD data available)
    let filtered = rawData.filter((d) => d.date >= "1900-01-01");

    if (rangeMonths !== null) {
      const cutoff = subtractMonths(new Date(), rangeMonths);
      const cutoffStr = cutoff.toISOString().split("T")[0];
      filtered = filtered.filter((d) => d.date >= cutoffStr);
    }

    // For very large ranges, sample to keep chart performant (~300 points max)
    if (filtered.length > 300) {
      const step = Math.ceil(filtered.length / 300);
      filtered = filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
    }

    const rangeMonthsForLabel = rangeMonths;
    return filtered.map((d) => ({
      dateStr: d.date,
      label: formatXLabel(d.date, rangeMonthsForLabel),
      price: d.price,
      source: d.source,
    }));
  }, [rawData, activeRange]);

  // Price stats
  const { currentPrice, priceChange, pctChange, isPositive, minPrice, maxPrice } = useMemo(() => {
    if (chartData.length < 2) return { currentPrice: 0, priceChange: 0, pctChange: 0, isPositive: true, minPrice: 0, maxPrice: 0 };
    const prices = chartData.map((d) => d.price);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const diff = last - first;
    const pct = ((diff / first) * 100);
    return {
      currentPrice: last,
      priceChange: diff,
      pctChange: pct,
      isPositive: diff >= 0,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [chartData]);

  const yPadding = useMemo(() => {
    if (!chartData.length) return [0, 100];
    const pad = (maxPrice - minPrice) * 0.08 || minPrice * 0.05;
    return [minPrice - pad, maxPrice + pad];
  }, [minPrice, maxPrice]);

  return (
    <>
      {/* ── Scoped Styles ───────────────────────────────────────────────── */}
      <style>{`
        .ghc-wrap {
          font-family: inherit;
          width: 100%;
        }

        /* Header row */
        .ghc-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .ghc-price-block {}
        .ghc-title {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-foreground, #888);
          margin: 0 0 4px;
        }
        .ghc-current-price {
          font-size: 2rem;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          color: #d4af37;
          margin: 0;
          line-height: 1;
        }
        .ghc-current-price span { font-size: 1.1rem; }
        .ghc-change {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .ghc-change.up   { color: #22c55e; }
        .ghc-change.down { color: #ef4444; }

        /* Stats pills */
        .ghc-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .ghc-stat-pill {
          background: var(--secondary, rgba(255,255,255,0.05));
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 8px;
          padding: 6px 14px;
          text-align: center;
        }
        .ghc-stat-pill__label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted-foreground, #888);
          display: block;
          margin-bottom: 2px;
        }
        .ghc-stat-pill__value {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--foreground, #fff);
          font-family: monospace;
        }

        /* Range filter buttons */
        .ghc-range-bar {
          display: flex;
          gap: 4px;
          background: var(--secondary, rgba(255,255,255,0.05));
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 16px;
          width: fit-content;
        }
        .ghc-range-btn {
          background: transparent;
          border: none;
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted-foreground, #888);
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          letter-spacing: 0.04em;
        }
        .ghc-range-btn:hover {
          color: #d4af37;
          background: rgba(212,175,55,0.08);
        }
        .ghc-range-btn.active {
          background: #d4af37;
          color: #1a1410;
        }

        /* Chart area */
        .ghc-chart-area {
          width: 100%;
          height: 340px;
          position: relative;
        }

        /* States */
        .ghc-state-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 340px;
          gap: 12px;
          color: var(--muted-foreground, #888);
        }
        .ghc-state-center svg { color: #d4af37; }
        .ghc-error { color: #ef4444; text-align: center; }
        .ghc-error p { margin: 4px 0; }

        /* Tooltip */
        .gold-tooltip {
          background: rgba(20, 15, 8, 0.92);
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 10px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .gold-tooltip__date {
          font-size: 0.7rem;
          color: #888;
          margin: 0 0 4px;
        }
        .gold-tooltip__price {
          font-size: 1rem;
          font-weight: 700;
          color: #d4af37;
          font-family: monospace;
          margin: 0 0 2px;
        }
        .gold-tooltip__unit { font-size: 0.65rem; color: #888; }
        .gold-tooltip__source {
          font-size: 0.65rem;
          color: #666;
          margin: 0;
        }

        /* Footer */
        .ghc-footer {
          margin-top: 12px;
          font-size: 0.65rem;
          color: var(--muted-foreground, #888);
          text-align: right;
          opacity: 0.7;
        }
      `}</style>

      <div className="ghc-wrap">
        {/* ── Loading ─────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="ghc-state-center">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#d4af37" }} />
            <p className="animate-pulse">Loading gold price history…</p>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {isError && (
          <div className="ghc-state-center ghc-error">
            <AlertCircle className="h-10 w-10" />
            <p className="font-medium">Failed to load gold data</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              {error?.message || "Could not reach freegoldapi.com"}
            </p>
          </div>
        )}

        {/* ── Chart ───────────────────────────────────────────────────── */}
        {!isLoading && !isError && chartData.length > 0 && (
          <>
            {/* Header */}
            <div className="ghc-header">
              <div className="ghc-price-block">
                <p className="ghc-title">Gold (XAU) · USD / troy oz</p>
                <p className="ghc-current-price">
                  <span>$</span>
                  {currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className={`ghc-change ${isPositive ? "up" : "down"}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>
                    {isPositive ? "+" : ""}
                    {priceChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                    ({isPositive ? "+" : ""}{pctChange.toFixed(2)}%) · {activeRange}
                  </span>
                </div>
              </div>

              <div className="ghc-stats">
                <div className="ghc-stat-pill">
                  <span className="ghc-stat-pill__label">Period Low</span>
                  <span className="ghc-stat-pill__value">
                    ${minPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="ghc-stat-pill">
                  <span className="ghc-stat-pill__label">Period High</span>
                  <span className="ghc-stat-pill__value">
                    ${maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="ghc-stat-pill">
                  <span className="ghc-stat-pill__label">Data Points</span>
                  <span className="ghc-stat-pill__value">{chartData.length}</span>
                </div>
              </div>
            </div>

            {/* Range filter */}
            <div className="ghc-range-bar">
              {TIME_RANGES.map(({ label }) => (
                <button
                  key={label}
                  className={`ghc-range-btn${activeRange === label ? " active" : ""}`}
                  onClick={() => setActiveRange(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="ghc-chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#d4af37" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity={0.0}  />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.07)"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={40}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground, #888)" }}
                  />
                  <YAxis
                    domain={yPadding}
                    tickFormatter={(v) =>
                      `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(0)}`
                    }
                    width={70}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground, #888)" }}
                  />
                  <Tooltip
                    content={<GoldTooltip />}
                    cursor={{ stroke: "#d4af37", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fill="url(#goldGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#d4af37", stroke: "#fff", strokeWidth: 1.5 }}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <p className="ghc-footer">
              Source: freegoldapi.com · Historical gold prices from multiple scholarly datasets ·
              Data cached for 6 hours
            </p>
          </>
        )}

        {!isLoading && !isError && chartData.length === 0 && (
          <div className="ghc-state-center">
            <p>No data available for this time range.</p>
          </div>
        )}
      </div>
    </>
  );
}
