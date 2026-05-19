import { useQueries } from "@tanstack/react-query";
import { metalsApi } from "@/lib/api";

const METALS_CONFIG = ["XAU", "XAG", "XPT", "XPD"];

const fetchMetal = async (symbol) => {
  const json = await metalsApi.proxy(symbol);
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

export function useLiveRates() {
  const queries = useQueries({
    queries: METALS_CONFIG.map((symbol) => ({
      queryKey: ["liveTicker", symbol],
      queryFn: () => fetchMetal(symbol),
      refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
      staleTime: 1000 * 60 * 4,
    })),
  });

  const rates = {};
  queries.forEach((q, idx) => {
    const symbol = METALS_CONFIG[idx];
    if (q.data) {
      rates[symbol] = q.data;
    }
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const METAL_ISO_MAP = {
    'Gold': 'XAU',
    'Silver': 'XAG',
    'Platinum': 'XPT',
    'Palladium': 'XPD'
  };

  const parseWeightToOunces = (weightStr) => {
    if (!weightStr) return 1;
    const normalized = weightStr.toLowerCase().trim();
    const match = normalized.match(/^([\d.]+)\s*(oz|ounce|ounces|g|gram|grams|kg|kilo|kilos)$/);
    if (!match) return 1;
    const val = parseFloat(match[1]);
    const unit = match[2];
    if (unit.startsWith('g')) {
      return val * 0.0321507; // grams to troy ounces
    }
    if (unit.startsWith('k')) {
      return val * 32.1507; // kg to troy ounces
    }
    return val; // oz
  };

  const getLiveProductPrices = (item) => {
    const iso = METAL_ISO_MAP[item.metal] || item.metal;
    const liveRate = rates[iso];

    if (!liveRate || !liveRate.price) {
      return {
        currentPrice: item.currentPrice || item.price,
        priceSell: item.priceSell || item.price * 0.98,
        priceChanges: null
      };
    }

    const ounces = parseWeightToOunces(item.weight);
    const liveProductPrice = liveRate.price * ounces;

    const buyPrice = item.buyPrice || item.price;
    const changeSignSymbol = liveRate.price_changes?.change_sign; // "+" or "-"
    const pct = liveRate.price_changes?.percentage?.number ?? 0;
    
    // 1. Firstly check the -/+ sign, 2. then the percentage, 3. then calculate the current price
    let pctCurrentPrice = buyPrice;
    if (changeSignSymbol === "+") {
      pctCurrentPrice = buyPrice * (1 + pct / 100);
    } else if (changeSignSymbol === "-") {
      pctCurrentPrice = buyPrice * (1 - pct / 100);
    } else {
      // Default fallback if sign is flat or empty
      pctCurrentPrice = buyPrice;
    }

    const pctPriceSell = pctCurrentPrice * 0.98;

    return {
      currentPrice: pctCurrentPrice,
      priceSell: pctPriceSell,
      priceChanges: liveRate.price_changes,
      spotProductPrice: liveProductPrice
    };
  };

  return {
    rates,
    isLoading,
    isError,
    getLiveProductPrices,
  };
}
