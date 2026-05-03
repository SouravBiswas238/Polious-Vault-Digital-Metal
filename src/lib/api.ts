// Centralized API client. Swap BASE_URL or wire to fetch / your backend.
// Every method is a thin async stub returning typed mock data — replace bodies
// with real fetch() calls when the backend is ready.

import type { Product } from "@/features/products/types";
import { PRODUCTS } from "@/features/products/data/products";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) || "/api";

async function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

/* ---------- Auth ---------- */
export type LoginInput = { email: string; password: string; remember?: boolean };
export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  phone?: string;
  agree: boolean;
};
export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
};

export const authApi = {
  async login(input: LoginInput): Promise<AuthUser> {
    // TODO: POST `${API_BASE_URL}/auth/login`
    return delay({
      id: "u_demo",
      email: input.email,
      firstName: "Demo",
      lastName: "User",
      balance: 12450.75,
    });
  },
  async register(input: RegisterInput): Promise<AuthUser> {
    // TODO: POST `${API_BASE_URL}/auth/register`
    return delay({
      id: "u_new",
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      balance: 0,
    });
  },
  async logout(): Promise<void> {
    return delay(undefined);
  },
  async forgotPassword(email: string): Promise<{ ok: true }> {
    return delay({ ok: true });
  },
};

/* ---------- Products ---------- */
export const productApi = {
  async list(): Promise<Product[]> {
    // TODO: GET `${API_BASE_URL}/products`
    return delay(PRODUCTS);
  },
  async byId(id: string): Promise<Product | undefined> {
    return delay(PRODUCTS.find((p) => p.id === id));
  },
};

/* ---------- Sell to us ---------- */
export type SellQuoteInput = {
  metal: string;
  product: string;
  weight: string;
  quantity: number;
};
export type SellQuote = {
  quoteId: string;
  pricePerUnit: number;
  total: number;
  expiresAt: string;
};

export const sellApi = {
  async quote(input: SellQuoteInput): Promise<SellQuote> {
    const base = 1800 + Math.random() * 200;
    return delay({
      quoteId: "Q-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      pricePerUnit: Number(base.toFixed(2)),
      total: Number((base * input.quantity).toFixed(2)),
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    });
  },
  async accept(quoteId: string): Promise<{ orderId: string }> {
    return delay({ orderId: "S-" + quoteId });
  },
};

/* ---------- Account ---------- */
export type Transaction = {
  id: string;
  date: string;
  type: "Buy" | "Sell" | "Deposit" | "Withdrawal";
  description: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
};

export const accountApi = {
  async profile(): Promise<AuthUser> {
    return delay({
      id: "u_demo",
      email: "demo@polyusvault.com",
      firstName: "Demo",
      lastName: "User",
      balance: 12450.75,
    });
  },
  async transactions(): Promise<Transaction[]> {
    return delay([
      {
        id: "T-10293",
        date: "2026-04-28",
        type: "Buy",
        description: "1 oz PAMP Gold Bar",
        amount: -2480,
        status: "Completed",
      },
      {
        id: "T-10288",
        date: "2026-04-21",
        type: "Deposit",
        description: "Wire transfer",
        amount: 5000,
        status: "Completed",
      },
      {
        id: "T-10271",
        date: "2026-04-15",
        type: "Sell",
        description: "10 oz Silver Bar",
        amount: 320,
        status: "Completed",
      },
      {
        id: "T-10260",
        date: "2026-04-10",
        type: "Buy",
        description: "Platinum Maple Leaf",
        amount: -1090,
        status: "Pending",
      },
    ]);
  },
  async addFunds(amount: number, method: string): Promise<{ ok: true; reference: string }> {
    return delay({ ok: true, reference: "F-" + Date.now() });
  },
  async cards(): Promise<{ id: string; brand: string; last4: string; exp: string }[]> {
    return delay([{ id: "c1", brand: "Visa", last4: "4242", exp: "08/28" }]);
  },
  async refer(email: string): Promise<{ ok: true }> {
    return delay({ ok: true });
  },
};
