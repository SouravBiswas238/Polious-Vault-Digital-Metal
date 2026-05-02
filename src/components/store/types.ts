export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: string;
  image: string;
};

export type CartItem = Product & { qty: number };
