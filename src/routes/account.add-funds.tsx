import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CreditCard, Wallet } from "lucide-react";
import { accountApi } from "@/lib/api";

export const Route = createFileRoute("/account/add-funds")({
  component: AddFundsPage,
});

const methods = [
  { id: "wire", name: "Bank Wire", desc: "1-2 business days · No fee", icon: Building2 },
  { id: "card", name: "Credit / Debit Card", desc: "Instant · 2.9% fee", icon: CreditCard },
  { id: "crypto", name: "Cryptocurrency", desc: "1 confirmation · 0.5% fee", icon: Wallet },
];

function AddFundsPage() {
  const [amount, setAmount] = useState(1000);
  const [method, setMethod] = useState("wire");
  const [ref, setRef] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await accountApi.addFunds(amount, method);
    setRef(r.reference);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">How to Add Funds</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose a deposit method and amount to fund your vault.</p>

      <form onSubmit={submit} className="mt-8 max-w-xl space-y-6">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (USD)</span>
          <div className="flex items-center rounded-md border border-border bg-background px-3 focus-within:border-gold">
            <span className="text-foreground/60">$</span>
            <input
              type="number"
              min={50}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent py-3 pl-2 text-lg font-semibold focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Method</span>
          {methods.map((m) => (
            <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
              method === m.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
            }`}>
              <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[var(--gold)]" />
              <m.icon className="h-5 w-5 text-gold" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <button className="rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90">
          Continue Deposit
        </button>

        {ref && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700">
            Deposit initiated. Reference: <span className="font-mono">{ref}</span>
          </div>
        )}
      </form>
    </div>
  );
}
