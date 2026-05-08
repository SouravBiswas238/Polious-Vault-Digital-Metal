import { useEffect, useState } from "react";
import { accountApi } from "@/lib/api";
import { CreditCard, Plus, Trash2 } from "lucide-react";

export default function CreditCardPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    accountApi.cards().then(setCards);
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Credit Cards</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage payment methods used for orders and deposits.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-gradient-to-br from-foreground to-foreground/80 p-5 text-background shadow-md">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-gold" />
              <div>
                <div className="text-sm font-semibold">{c.brand} •••• {c.last4}</div>
                <div className="text-xs text-background/60">Expires {c.exp}</div>
              </div>
            </div>
            <button className="text-background/60 hover:text-destructive" onClick={() => setCards((p) => p.filter((x) => x.id !== c.id))}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-sm font-semibold text-muted-foreground hover:border-gold hover:text-gold">
          <Plus className="h-4 w-4" /> Add new card
        </button>
      </div>
    </div>
  );
}
