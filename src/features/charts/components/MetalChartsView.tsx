import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const generateData = (basePrice: number, days: number = 30) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate volatility
    const volatility = basePrice * 0.015;
    const change = Math.random() * volatility * 2 - volatility;
    currentPrice += change;

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Number(currentPrice.toFixed(2)),
    });
  }
  return data;
};

// Generate fixed demo data so it doesn't jump around on re-renders
const DEMO_DATA = {
  Gold: generateData(2425.5),
  Silver: generateData(31.15),
  Platinum: generateData(1040.0),
  Palladium: generateData(985.5),
  Rhodium: generateData(4750.0),
};

const METALS = ["Gold", "Silver", "Platinum", "Palladium", "Rhodium"] as const;
type Metal = (typeof METALS)[number];

export function MetalChartsView() {
  const [activeMetal, setActiveMetal] = useState<Metal>("Gold");

  const chartConfig = {
    price: {
      label: "Price (USD)",
      color: "var(--gold)",
    },
  };

  const activeData = DEMO_DATA[activeMetal];

  // Calculate high/low for Y axis domain
  const minPrice = Math.min(...activeData.map((d) => d.price));
  const maxPrice = Math.max(...activeData.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.1;
  const yDomain = [minPrice - padding, maxPrice + padding];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-12 ">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Live Market Charts
        </h2>
      </div>

      <Tabs
        value={activeMetal}
        onValueChange={(v) => setActiveMetal(v as Metal)}
        className="w-full"
      >
        <TabsList className="mb-8 grid w-full grid-cols-3 md:grid-cols-5 h-auto p-1 bg-secondary/50">
          {METALS.map((metal) => (
            <TabsTrigger
              key={metal}
              value={metal}
              className="py-2.5  text-sm md:text-base data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-sm"
            >
              {metal}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h3 className="font-display text-2xl font-semibold">{activeMetal} (30 Days)</h3>
            <p className="text-3xl font-mono text-gold mt-2">
              $
              {activeData[activeData.length - 1].price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-sm font-sans text-muted-foreground ml-2">Current Ask</span>
            </p>
          </div>

          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <AreaChart data={activeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={30}
              />
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
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Tabs>
    </div>
  );
}
