import { useEffect, useState } from "react";
import { accountApi } from "@/lib/api";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";

export default function Transactions() {
  const [tx, setTx] = useState(null);

  useEffect(() => {
    accountApi.transactions().then(setTx);
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Transaction Summary</h2>
      <p className="mt-1 text-sm text-muted-foreground">All recent activity in your vault account.</p>

      {!tx ? (
        <div className="flex items-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground/80">{t.date}</td>
                  <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
                      {t.amount < 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{t.description}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.amount < 0 ? "text-destructive" : "text-foreground"}`}>
                    {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${t.status === "Completed" ? "text-emerald-600" : t.status === "Pending" ? "text-amber-600" : "text-destructive"}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
