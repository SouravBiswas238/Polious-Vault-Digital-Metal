import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const METALS_MAP = {
  Gold: "XAU",
  Silver: "XAG",
  Platinum: "XPT",
  Palladium: "XPD",
  Rhodium: "XRH",
};

const METALS = Object.entries(METALS_MAP);

export function MetalChartsView() {
  const [activeMetal, setActiveMetal] = useState("XAU");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["metalHistory", activeMetal],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/metals/historical/?start_date=${startDate}&end_date=${endDate}&currencies=${activeMetal}`
      );
      if (!response.ok) throw new Error("Failed to fetch market data");
      return response.json();
    },
    staleTime: 1000 * 60 * 60,
  });
  console.log(data);
  const chartConfig = {
    price: {
      label: "Price (USD)",
      color: "var(--gold)",
    },
  };

  const activeData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => {
      const d = new Date(item.date);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: item.price,
        rawDate: item.date,
      };
    });
  }, [data]);

  const activeLabel = useMemo(() => {
    return METALS.find(([_, value]) => value === activeMetal)?.[0] || activeMetal;
  }, [activeMetal]);

  const { yDomain, currentPrice } = useMemo(() => {
    if (activeData.length === 0) return { yDomain: [0, 100], currentPrice: 0 };
    const prices = activeData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1 || minPrice * 0.05;
    return {
      yDomain: [minPrice - padding, maxPrice + padding],
      currentPrice: prices[prices.length - 1],
    };
  }, [activeData]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-12">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Live Market Charts
        </h2>
        <p className="text-muted-foreground mt-4">Real-time performance data from global markets</p>
      </div>

      <Tabs value={activeMetal} onValueChange={setActiveMetal} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 md:grid-cols-5 h-auto p-1 bg-secondary/50">
          {METALS.map(([label, value]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="py-2.5 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-sm"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8 min-h-[500px] flex flex-col">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">{activeLabel} (30 Days)</h3>
              <p className="text-3xl font-mono text-gold mt-2">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-sans text-muted-foreground ml-2">Current Ask</span>
              </p>
            </div>
            {data && (
              <div className="text-sm text-muted-foreground italic">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
                <p className="text-muted-foreground animate-pulse">Fetching market data...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 text-destructive max-w-md text-center">
                <AlertCircle className="h-10 w-10" />
                <p className="font-medium">Connection Error</p>
                <p className="text-sm opacity-80">{error?.message || "Could not connect to the live price server."}</p>
              </div>
            ) : activeData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} minTickGap={30} />
                    <YAxis
                      domain={yDomain}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      width={80}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={{ stroke: "var(--color-price)", strokeWidth: 1, strokeDasharray: "4 4" }}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#fillPrice)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground">No historical data available for this metal.</div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
