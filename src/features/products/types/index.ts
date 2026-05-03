export type Metal = "Gold" | "Silver" | "Platinum" | "Palladium" | "Rhodium";

export type Product = {
  id: string;
  name: string;
  metal: Metal;
  category: string;
  price: number;
  weight: string;
  image: string;
  inStock?: boolean;
};

export type CartItem = Product & { qty: number };
