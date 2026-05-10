import { useState, useEffect } from "react";
import { Gift, Send, Users, DollarSign } from "lucide-react";
import { authApi, accountApi } from "@/lib/api";

export default function Refer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [stats, setStats] = useState({ referralCode: "", referralsCount: 0, referralBonus: 50 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authApi.getReferralStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch referral stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${stats.referralCode}`;

  const submit = async (e) => {
    e.preventDefault();
    await accountApi.refer(email);
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 2500);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-96 rounded bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    </div>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Refer a Friend</h2>
      <p className="mt-1 text-sm text-muted-foreground">Both you and your friend will get ${stats.referralBonus} in vault credit when they create an account.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
          <Gift className="h-7 w-7 text-gold" />
          <h3 className="mt-3 font-display text-xl font-semibold">Your referral link</h3>
          <div className="mt-3 flex gap-2">
            <input readOnly value={referralLink} className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm" />
            <button onClick={() => {
              navigator.clipboard?.writeText(referralLink);
              alert("Link copied to clipboard!");
            }} className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground hover:opacity-90">
              Copy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-2xl font-bold">{stats.referralsCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Referrals</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center">
            <DollarSign className="h-6 w-6 text-emerald-500 mb-2" />
            <span className="text-2xl font-bold">${stats.referralsCount * stats.referralBonus}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Earned Credit</span>
          </div>
        </div>

        {/* <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-xl font-semibold">Invite by email</h3>
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
        </form> */}
      </div>
    </div>
  );
}
