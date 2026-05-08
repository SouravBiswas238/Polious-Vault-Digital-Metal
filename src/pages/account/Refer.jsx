import { useState } from "react";
import { Gift, Send } from "lucide-react";
import { accountApi } from "@/lib/api";

export default function Refer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const link = "https://polyusvault.com/r/DEMO-1234";

  const submit = async (e) => {
    e.preventDefault();
    await accountApi.refer(email);
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Refer a Friend</h2>
      <p className="mt-1 text-sm text-muted-foreground">Earn $50 in vault credit for every friend who funds an account.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
          <Gift className="h-7 w-7 text-gold" />
          <h3 className="mt-3 font-display text-xl font-semibold">Your referral link</h3>
          <div className="mt-3 flex gap-2">
            <input readOnly value={link} className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
            <button onClick={() => navigator.clipboard?.writeText(link)} className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground hover:opacity-90">
              Copy
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-xl font-semibold">Or invite by email</h3>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            <button className="inline-flex items-center gap-1 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:opacity-90">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
          {sent && <p className="mt-3 text-sm text-emerald-600">Invitation sent.</p>}
        </form>
      </div>
    </div>
  );
}
