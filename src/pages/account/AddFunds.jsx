import { useState } from "react";
import { Building2, CreditCard, Wallet, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const methods = [
  { id: "wire",   name: "Bank Wire",            desc: "1-2 business days · No fee",  icon: Building2  },
  { id: "card",   name: "Credit / Debit Card",  desc: "Instant · 2.9% fee",          icon: CreditCard },
  { id: "crypto", name: "Cryptocurrency",       desc: "1 confirmation · 0.5% fee",   icon: Wallet     },
];

const methodLabel = {
  wire:   "Bank Wire Transfer",
  card:   "Credit / Debit Card",
  crypto: "Cryptocurrency",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function AddFunds() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [amount, setAmount] = useState(1000);
  const [method, setMethod] = useState("wire");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (!user) {
      navigate("/login?redirect=/account/funds");
      return;
    }

    setLoading(true);

    const firstName = user.personalInfo?.firstName || "";
    const lastName  = user.personalInfo?.lastName  || "";
    const fullName  = `${firstName} ${lastName}`.trim() || "Customer";
    const email     = user.personalInfo?.email       || "";
    const phone     = user.personalInfo?.phoneNumber || "";

    const depositNote = [
      "💰 DEPOSIT REQUEST",
      "",
      `Customer : ${fullName}`,
      `User ID  : ${user._id || "N/A"}`,
      `Email    : ${email}`,
      `Amount   : ${fmt(amount)}`,
      `Method   : ${methodLabel[method]}`,
      "",
      "Please assist me in completing my deposit.",
    ].join("\n");

    // Identify the user in SaleSmartly
    window.ssq = window.ssq || [];
    window.ssq.push("setCustomer", {
      user_id:     user._id || email,
      name:        fullName,
      email,
      phone,
      description: depositNote,
    });

    // Open the chat panel
    window.ssq.push("chatOpen");

    // Send the pre-composed message once the panel has opened, then re-enable
    setTimeout(() => {
      window.ssq.push("sendTextMessage", depositNote);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Add Funds</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a deposit method and amount, then contact our support team to complete your deposit.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6">
        {/* Amount */}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Amount (USD)
          </span>
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

        {/* Method */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Deposit Method
          </span>
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                method === m.id
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/40"
              }`}
            >
              <input
                type="radio"
                name="method"
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="accent-[var(--gold)]"
              />
              <m.icon className="h-5 w-5 text-gold" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Submit → opens chat */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening Chat…
            </>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Contact Customer Service
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground">
          Clicking the button will open our live chat with your deposit details pre-filled so our team can assist you right away.
        </p>
      </form>
    </div>
  );
}
