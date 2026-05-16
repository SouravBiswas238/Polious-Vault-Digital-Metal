import { useState } from "react";
import { MessageCircle, Loader2, ArrowDownCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBalance } from "@/hooks/useBalance";
import { useNavigate } from "react-router-dom";
import { accountApi } from "@/lib/api";

const WITHDRAW_METHODS = [
  {
    id: "card",
    icon: "https://img.icons8.com/color/96/visa.png",
    label: "Credit / Debit Card",
    desc: "Instant · 2.9% processing fee",
    badge: null,
  },
  {
    id: "google-pay",
    icon: "https://img.icons8.com/color/96/google-pay.png",
    label: "Google Pay",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "PayPal",
    icon: "https://img.icons8.com/color/96/paypal.png",
    label: "PayPal",
    desc: "Instant · No fee",
    badge: null,
  },
  {
    id: "eCheck",
    icon: "https://img.icons8.com/color/96/bank.png",
    label: "eCheck (ACH)",
    desc: "2–4 business days · No fee",
    badge: null,
  },
  {
    id: "wire",
    icon: "https://img.icons8.com/color/96/globe.png",
    label: "Bank Wire Transfer",
    desc: "1–2 business days · No fee",
    badge: "Most Popular",
  },
  {
    id: "crypto",
    icon: "https://img.icons8.com/color/96/bitcoin.png",
    label: "Cryptocurrency",
    desc: "1 confirmation · 0.5% fee",
    badge: null,
  },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function Withdraw() {
  const { user } = useAuth();
  const { data: balanceData } = useBalance();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("wire");
  const [loading, setLoading] = useState(false);

  const currentBalance = balanceData?.balance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!user) {
      navigate("/login?redirect=/account/withdraw");
      return;
    }

    if (amount > currentBalance) {
      alert("Withdrawal amount cannot exceed your current balance.");
      return;
    }

    setLoading(true);
    try {
      const selectedMethodObj = WITHDRAW_METHODS.find((m) => m.id === method);
      const methodName = selectedMethodObj ? selectedMethodObj.label : method;

      // Create withdrawal request in backend
      await accountApi.requestWithdrawal(amount, methodName);

      const firstName = user.personalInfo?.firstName || user.firstName || "";
      const lastName = user.personalInfo?.lastName || user.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Customer";
      const email = user.personalInfo?.email || user.email || "";
      const phone = user.personalInfo?.phoneNumber || user.phone || "";

      const withdrawNote = [
        "💸 WITHDRAWAL REQUEST",
        "",
        `Customer : ${fullName}`,
        `User ID  : ${user._id || "N/A"}`,
        `Email    : ${email}`,
        `Current Balance : ${fmt(currentBalance)}`,
        `Withdraw Amount : ${fmt(amount)}`,
        `Remaining Balance: ${fmt(currentBalance - amount)}`,
        `Method   : ${methodName}`,
        "",
        "Please assist me in processing my withdrawal request. I have already submitted the formal request in the system.",
      ].join("\n");

      // Identify the user in SaleSmartly
      window.ssq = window.ssq || [];
      window.ssq.push("setCustomer", {
        user_id: user._id || email,
        name: fullName,
        email,
        phone,
        description: withdrawNote,
      });

      // Open the chat panel
      window.ssq.push("chatOpen");

      // Send the pre-composed message once the panel has opened, then re-enable
      setTimeout(() => {
        window.ssq.push("sendTextMessage", withdrawNote);
        setLoading(false);
      }, 1000);
    } catch (err) {
      alert(err.message || "Failed to submit withdrawal request.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
          <ArrowDownCircle className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Withdraw Funds</h2>
          <p className="text-sm text-muted-foreground">
            Request a withdrawal from your vault balance to your preferred payment method.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4 max-w-xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-gold/70">Available Balance</div>
        <div className="text-2xl font-bold text-gold">{fmt(currentBalance)}</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
        {/* Amount */}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Withdrawal Amount (USD)
          </span>
          <div className="flex items-center rounded-md border border-border bg-background px-3 focus-within:border-gold">
            <span className="text-foreground/60">$</span>
            <input
              type="number"
              min={10}
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent py-3 pl-2 text-lg font-semibold focus:outline-none"
            />
          </div>
          {amount > currentBalance && (
            <p className="mt-1 text-xs text-red-500">Amount exceeds available balance</p>
          )}
        </div>

        {/* Method */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Withdrawal Method
          </span>
          <div className="grid gap-3">
            {WITHDRAW_METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${method === m.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                  }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-[var(--gold)]"
                />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/30">
                  <img src={m.icon} alt={m.label} className="h-6 w-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{m.label}</span>
                    {m.badge && (
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit → opens chat */}
        <button
          type="submit"
          disabled={loading || amount <= 0 || amount > currentBalance}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-90 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting to Support…
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Request Withdrawal via Support
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground">
          For security reasons, all withdrawal requests are processed manually by our finance team.
          Clicking the button will open a secure chat with your request details.
        </p>
      </form>
    </div>
  );
}
