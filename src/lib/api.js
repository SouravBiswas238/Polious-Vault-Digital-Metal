export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000/api";

const delay = (value, ms = 350) =>
  new Promise((res) => setTimeout(() => res(value), ms));

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(options.customUrl || `${API_BASE_URL}${path}`, {
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
  async getReferralStats() {
    return request("/auth/referral-stats");
  },
};

export const productApi = {
  async list(metal) {
    const qs = metal ? `?metal=${encodeURIComponent(metal)}` : "";
    return request(`/products${qs}`);
  },
  async byId(id) {
    return request(`/products/${id}`);
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
    return request("/auth/transactions");
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
  async requestWithdrawal(amount, method) {
    return request("/auth/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
  },
};

export const balanceApi = {
  async get() {
    return request("/auth/balance");
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
  async addBalance(userId, amount, paymentMethod) {
    return request(`/admin/users/${userId}/add-balance`, {
      method: "POST",
      body: JSON.stringify({ amount, paymentMethod }),
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async createProduct(data) {
    return request("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async updateProduct(id, data) {
    return request(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async deleteProduct(id) {
    return request(`/admin/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async getWithdrawals() {
    return request("/admin/withdrawals", {
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async approveWithdrawal(id) {
    return request(`/admin/withdrawals/${id}/approve`, {
      method: "POST",
      headers: { "x-admin-key": ADMIN_KEY },
    });
  },
  async rejectWithdrawal(id) {
    return request(`/admin/withdrawals/${id}/reject`, { method: "POST", headers: { "x-admin-key": ADMIN_KEY } });
  },
  async getOrders() {
    return request("/admin/orders", { headers: { "x-admin-key": ADMIN_KEY } });
  },
  async updateOrderStatus(id, status) {
    return request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },
  async getTransactions() {
    return request("/admin/transactions", { headers: { "x-admin-key": ADMIN_KEY } });
  },
};

export const metalsApi = {
  async getLatest() {
    return request("/metals/latest");
  },
  async proxy(symbol, period = "1d", weight_unit = "ounce") {
    return request(`/metals/proxy?symbol=${symbol}&period=${period}&weight_unit=${weight_unit}`);
  },
};
 
export const orderApi = {
  async list() {
    return request("/orders");
  },
  async canSell() {
    return request("/orders/can-sell");
  },
  async ownedProducts() {
    return request("/orders/owned-products");
  },
  async create(data) {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
