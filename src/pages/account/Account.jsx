import { Link, Outlet, useLocation } from "react-router-dom";
import { Receipt, UserCircle2, CreditCard, Wallet, Users, TrendingUp } from "lucide-react";
import { useBalance } from "@/hooks/useBalance";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/account/transactions", label: "Transactions", icon: Receipt },
  { to: "/account/profile", label: "My Profile", icon: UserCircle2 },
  { to: "/account/credit-card", label: "Credit Cards", icon: CreditCard },
  { to: "/account/add-funds", label: "Add Funds", icon: Wallet },
  { to: "/account/refer", label: "Refer a Friend", icon: Users },
];

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n || 0);
}

export default function Account() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  const firstName = user?.personalInfo?.firstName || user?.firstName || "";
  const lastName = user?.personalInfo?.lastName || user?.lastName || "";
  const initials = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">My Account</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your vault, payments and personal information.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-3">
          {/* Balance card */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[oklch(0.18_0.015_80)] to-[oklch(0.24_0.02_80)] border border-gold/20 p-5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.74_0.14_78/0.15),transparent_65%)]" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-sm font-bold text-gold">
                  {initials}
                </div>
                <div className="h-7 w-7 rounded-full bg-gold/10 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-gold" />
                </div>
              </div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold/60">
                Vault Balance
              </div>
              <div className="text-2xl font-bold text-gold tabular-nums">
                {balanceLoading ? (
                  <span className="animate-pulse text-gold/40">Loading…</span>
                ) : (
                  formatUSD(balanceData?.balance)
                )}
              </div>
              <div className="mt-0.5 text-xs text-white/30">USD • Updated live</div>
              <Link
                to="/account/add-funds"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-gold/15 border border-gold/25 py-2 text-xs font-semibold text-gold hover:bg-gold/25 transition-colors cursor-pointer"
              >
                + Add Funds
              </Link>
            </div>
          </div>

          {/* Nav */}
          <nav className="rounded-xl border border-border bg-card p-2 shadow-sm space-y-0.5">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-foreground/70 hover:bg-secondary hover:text-gold"
                  }`}
                >
                  <l.icon className={`h-4 w-4 shrink-0 ${active ? "" : "text-muted-foreground"}`} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 min-h-100">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
