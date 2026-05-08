import { PRODUCTS } from "@/features/products/data/products";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000/api";

async function delay(value, ms = 350) {
  return new Promise((res) => setTimeout(() => res(value), ms));
}

async function request(path, options = {}) {
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const authApi = {
  async login(input) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async register(input) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async getProfile() {
    return request("/auth/profile");
  },
  async updatePassword(input) {
    return request("/auth/password", {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  async updateProfile(input) {
    return request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
};

export const productApi = {
  async list() {
    return delay(PRODUCTS);
  },
  async byId(id) {
    return delay(PRODUCTS.find((p) => p.id === id));
  },
};

export const sellApi = {
  async quote(input) {
    const base = 1800 + Math.random() * 200;
    return delay({
      quoteId: "Q-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      pricePerUnit: Number(base.toFixed(2)),
      total: Number((base * input.quantity).toFixed(2)),
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    });
  },
  async accept(quoteId) {
    return delay({
      orderId: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      quoteId,
    });
  },
};

export const accountApi = {
  async transactions() {
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
  async addFunds(amount, method) {
    return delay({
      reference: "REF-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      amount,
      method,
    });
  },
  async cards() {
    return delay([
      { id: "c1", brand: "Visa", last4: "4242", exp: "12/27" },
      { id: "c2", brand: "Mastercard", last4: "5678", exp: "08/26" },
    ]);
  },
  async refer(email) {
    return delay({ success: true, email });
  },
};

function getLocalUserId() {
  try { return JSON.parse(localStorage.getItem("user") || "{}")?._id || null; } catch { return null; }
}

export const balanceApi = {
  async get() {
    try {
      return await request("/account/balance");
    } catch {
      const userId = getLocalUserId();
      const stored = userId ? parseFloat(localStorage.getItem(`vault_balance_${userId}`) || "0") : 0;
      return { balance: stored, currency: "USD" };
    }
  },
};

const ADMIN_KEY = "admin2024";

export const adminApi = {
  async getUsers() {
    return request("/admin/users", { headers: { "x-admin-key": ADMIN_KEY } });
  },
  async getUserBalance(userId) {
    return request(`/admin/users/${userId}/balance`, { headers: { "x-admin-key": ADMIN_KEY } });
  },
  async addBalance(userId, amount) {
    return request(`/admin/users/${userId}/add-balance`, {
      method: "POST",
      body: JSON.stringify({ amount }),
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
};
