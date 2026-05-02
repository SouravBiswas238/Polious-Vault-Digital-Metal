import bar from "@/assets/product-bar.jpg";
import coins from "@/assets/product-coins.jpg";
import silver from "@/assets/product-silver.jpg";
import platinum from "@/assets/product-platinum.jpg";
import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  { id: "1", name: "Aurum Cast Gold Bar", category: "Gold Bullion", weight: "1 oz · 99.99%", price: 2480, image: bar },
  { id: "2", name: "Sovereign Gold Coin Set", category: "Gold Coins", weight: "1/4 oz · ×4", price: 2620, image: coins },
  { id: "3", name: "Silver Investment Bar", category: "Silver Bullion", weight: "10 oz · 99.9%", price: 320, image: silver },
  { id: "4", name: "Platinum Refinery Bar", category: "Platinum", weight: "1 oz · 99.95%", price: 1040, image: platinum },
  { id: "5", name: "Heritage Gold Bar", category: "Gold Bullion", weight: "5 oz · 99.99%", price: 12380, image: bar },
  { id: "6", name: "Limited Edition Coins", category: "Gold Coins", weight: "1 oz · ×2", price: 4980, image: coins },
];
