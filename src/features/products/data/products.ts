import bar from "@/assets/product-bar.jpg";
import coins from "@/assets/product-coins.jpg";
import silver from "@/assets/product-silver.jpg";
import platinum from "@/assets/product-platinum.jpg";
import palladium from "@/assets/product-palladium.jpg";
import rhodium from "@/assets/product-rhodium.jpg";
import type { Metal, Product } from "@/features/products/types";

export const METALS: { key: Metal; label: string; tagline: string }[] = [
  { key: "Gold", label: "Gold", tagline: "The timeless store of value" },
  { key: "Silver", label: "Silver", tagline: "Industrial strength, monetary heritage" },
  { key: "Platinum", label: "Platinum", tagline: "Rare, dense, enduring" },
  { key: "Palladium", label: "Palladium", tagline: "The catalyst of modern industry" },
  { key: "Rhodium", label: "Rhodium", tagline: "The world's rarest precious metal" },
];

export const PRODUCTS: Product[] = [
  // Gold
  {
    id: "g1",
    name: "PAMP Suisse Cast Gold Bar",
    metal: "Gold",
    category: "Bullion Bar",
    weight: "1 oz · 99.99%",
    price: 2480,
    image: bar,
    inStock: true,
  },
  {
    id: "g2",
    name: "Royal Canadian Maple Leaf",
    metal: "Gold",
    category: "Bullion Coin",
    weight: "1 oz · 99.99%",
    price: 2520,
    image: coins,
    inStock: true,
  },
  {
    id: "g3",
    name: "Heritage Gold Kilo Bar",
    metal: "Gold",
    category: "Bullion Bar",
    weight: "1 kg · 99.99%",
    price: 79800,
    image: bar,
    inStock: true,
  },
  {
    id: "g4",
    name: "American Gold Eagle Set",
    metal: "Gold",
    category: "Bullion Coin",
    weight: "1/4 oz · ×4",
    price: 2620,
    image: coins,
    inStock: true,
  },

  // Silver
  {
    id: "s1",
    name: "Silver Investment Bar",
    metal: "Silver",
    category: "Bullion Bar",
    weight: "10 oz · 99.9%",
    price: 320,
    image: silver,
    inStock: true,
  },
  {
    id: "s2",
    name: "Silver Britannia Coin",
    metal: "Silver",
    category: "Bullion Coin",
    weight: "1 oz · 99.9%",
    price: 38,
    image: silver,
    inStock: true,
  },
  {
    id: "s3",
    name: "Silver Monster Box",
    metal: "Silver",
    category: "Bulk",
    weight: "500 oz · ×500",
    price: 16500,
    image: silver,
    inStock: true,
  },

  // Platinum
  {
    id: "pt1",
    name: "Platinum Refinery Bar",
    metal: "Platinum",
    category: "Bullion Bar",
    weight: "1 oz · 99.95%",
    price: 1040,
    image: platinum,
    inStock: true,
  },
  {
    id: "pt2",
    name: "Platinum Maple Leaf",
    metal: "Platinum",
    category: "Bullion Coin",
    weight: "1 oz · 99.95%",
    price: 1090,
    image: platinum,
    inStock: true,
  },

  // Palladium
  {
    id: "pd1",
    name: "Palladium Bar",
    metal: "Palladium",
    category: "Bullion Bar",
    weight: "1 oz · 99.95%",
    price: 980,
    image: palladium,
    inStock: true,
  },
  {
    id: "pd2",
    name: "Palladium Maple Leaf",
    metal: "Palladium",
    category: "Bullion Coin",
    weight: "1 oz · 99.95%",
    price: 1020,
    image: palladium,
    inStock: false,
  },

  // Rhodium
  {
    id: "rh1",
    name: "Cohen Mint Rhodium Bar",
    metal: "Rhodium",
    category: "Bullion Bar",
    weight: "1 oz · 99.9%",
    price: 4850,
    image: rhodium,
    inStock: true,
  },
  {
    id: "rh2",
    name: "PAMP Rhodium Mini Bar",
    metal: "Rhodium",
    category: "Bullion Bar",
    weight: "1 g · 99.9%",
    price: 220,
    image: rhodium,
    inStock: true,
  },
];
