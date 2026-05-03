import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { sellApi, type SellQuote } from "@/lib/api";
import { METALS } from "@/components/store/products";

export const Route = createFileRoute("/sell")({
  component: SellPage,
  head: () => ({
    meta: [
      { title: "Sell To Us — Polyus Vault" },
      { name: "description", content: "Get an instant buyback quote on your gold, silver, platinum, palladium and rhodium." },
    ],
  }),
});

function SellPage() {
  const [form, setForm] = useState({ metal: "Gold", product: "Bullion Bar", weight: "1 oz", quantity: 1 });
  const [quote, setQuote] = useState<SellQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState<string | null>(null);

  const getQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAccepted(null);
    const q = await sellApi.quote(form);
    setQuote(q);
    setLoading(false);
  };

  const accept = async () => {
    if (!quote) return;
    const r = await sellApi.accept(quote.quoteId);
    setAccepted(r.orderId);
  };

  return (
    <div className="bg-gradient-hero py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Sell To Us</span>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Instant buyback at <span className="text-gradient-gold">live market prices</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Lock in a price, ship insured, get paid within 24 hours of receipt. No hidden fees.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <form onSubmit={getQuote} className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Get an instant quote</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Select label="Metal" value={form.metal} onChange={(v) => setForm({ ...form, metal: v })}
                options={METALS.map((m) => m.label)} />
              <Select label="Product Type" value={form.product} onChange={(v) => setForm({ ...form, product: v })}
                options={["Bullion Bar", "Bullion Coin", "Jewelry", "Scrap"]} />
              <Select label="Weight" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })}
                options={["1 g", "10 g", "1 oz", "10 oz", "1 kg"]} />
              <Input label="Quantity" type="number" min={1} value={form.quantity}
                onChange={(v) => setForm({ ...form, quantity: Number(v) || 1 })} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
              {loading ? "Calculating…" : "Get Live Quote"}
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-foreground p-6 text-background shadow-xl sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Your Quote</h2>
            {!quote && (
              <p className="mt-2 text-sm text-background/60">
                Submit the form to receive a 10-minute price lock.
              </p>
            )}
            {quote && (
              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between text-sm text-background/70">
                  <span>Quote ID</span>
                  <span className="font-mono text-background">{quote.quoteId}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-background/70">
                  <span>Price per unit</span>
                  <span className="text-background">${quote.pricePerUnit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-background/10 pt-4 text-sm text-background/70">
                  <span>Total Buyback</span>
                  <span className="font-display text-3xl text-gradient-gold">${quote.total.toLocaleString()}</span>
                </div>
                <div className="text-xs text-background/50">
                  Expires {new Date(quote.expiresAt).toLocaleTimeString()}
                </div>

                {accepted ? (
                  <div className="flex items-center gap-2 rounded-md bg-gold/15 px-3 py-3 text-sm text-gold">
                    <CheckCircle2 className="h-4 w-4" /> Order {accepted} created. Check email for shipping label.
                  </div>
                ) : (
                  <button
                    onClick={accept}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold py-3 text-sm font-semibold text-gold-foreground hover:opacity-90"
                  >
                    Accept Quote <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, onChange, ...rest }: { label: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input {...rest} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm focus:border-gold focus:outline-none" />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm focus:border-gold focus:outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
