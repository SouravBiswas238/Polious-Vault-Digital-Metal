import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Receipt, UserCircle2, CreditCard, Wallet, Users } from "lucide-react";

export const Route = createFileRoute("/account")({
  component: AccountLayout,
  head: () => ({ meta: [{ title: "My Account — Polyus Vault" }] }),
});

const links = [
  { to: "/account/transactions", label: "Transaction Summary", icon: Receipt },
  { to: "/account/profile", label: "My Profile", icon: UserCircle2 },
  { to: "/account/credit-card", label: "Credit Card", icon: CreditCard },
  { to: "/account/add-funds", label: "How to Add Funds", icon: Wallet },
  { to: "/account/refer", label: "Refer a Friend", icon: Users },
] as const;

function AccountLayout() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
      <h1 className="font-display text-4xl font-semibold">My Account</h1>
      <p className="mt-1 text-muted-foreground">Manage your vault, payments and personal information.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:bg-secondary hover:text-gold"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </aside>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
