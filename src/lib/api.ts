// Centralized API client.
import type { Product } from "@/features/products/types";
import { PRODUCTS } from "@/features/products/data/products";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) || "http://localhost:5000/api";

async function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

// Helper for fetching with Auth Token
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      // Auto logout on token expiration
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: window.location.href = "/login";
    }
    throw new Error(data.message || "Request failed");
  }

  return data;
}

/* ---------- Auth ---------- */
export type LoginInput = { email: string; password: string; remember?: boolean };
export type RegisterInput = {
  accountType: "personal" | "business" | "joint" | "trust" | "minor";
  personalInfo: {
    firstName: string;
    lastName?: string;
    email: string;
    phoneCode: string;
    phoneNumber: string;
    occupation?: string;
    dateOfBirth?: string;
    nationality?: string;
  };
  businessInfo?: {
    entityName?: string;
    tradeName?: string;
    entityType?: string;
    registrationNumber?: string;
    businessAddress?: {
      street?: string;
      suite?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  kycCompliance: {
    pepStatus: boolean;
    taxCountry?: string;
    taxId?: string;
  };
  marketingPreferences: {
    subscribeNewsletters: boolean;
    subscribePromotions: boolean;
  };
  agreements: {
    termsAccepted: boolean;
    amlPolicyAccepted: boolean;
  };
  password: string;
};

export type AuthUser = {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
};

export const authApi = {
  async login(input: LoginInput): Promise<AuthUser> {
    return request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async register(input: RegisterInput): Promise<AuthUser> {
    return request<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async getProfile(): Promise<AuthUser> {
    return request<AuthUser>("/auth/profile");
  },
  async updatePassword(input: any): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  async updateProfile(input: any): Promise<AuthUser> {
    return request<AuthUser>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
};

/* ---------- Products ---------- */
export const productApi = {
  async list(): Promise<Product[]> {
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
    ]);
  },
};
