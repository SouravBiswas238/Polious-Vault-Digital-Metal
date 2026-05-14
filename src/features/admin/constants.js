export const ADMIN_EMAIL = "admin@gmail.com"
export const ADMIN_PASSWORD = "Mann@43616";
export const PRESETS = [100, 500, 1000, 5000, 10000];

export function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(n || 0);
}
