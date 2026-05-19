import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, CheckCircle2, XCircle, Clock,
  ArrowUpRight, ArrowDownLeft, AlertCircle, Calendar
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatUSD } from "../constants";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Deposit, Purchase, Sale, Withdrawal
  const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Completed, Failed, Cancelled

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t._id.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "All" || t.type === filterType;
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Transaction History</h2>
          <p className="text-muted-foreground text-sm">Monitor all platform financial flows, charges, sales, and withdrawals.</p>
        </div>
        <button
          onClick={loadTransactions}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 shadow-sm px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user, email, description or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between pt-2 border-t border-slate-100">
          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type:</span>
            {["All", "Deposit", "Buy", "Sell", "Withdrawal"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  filterType === type
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type === "Buy" ? "Purchase" : type === "Sell" ? "Sale" : type}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            {["All", "Pending", "Completed", "Failed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === status
                    ? "bg-gold text-gold-foreground"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
                        <p className="font-medium text-slate-500">Loading transaction logs...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 opacity-20" />
                        <p className="font-medium text-slate-500">No transaction records match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const isPositive = t.amount > 0;
                    return (
                      <motion.tr
                        key={t._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase shadow-sm">
                              {t.userName.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 leading-snug">{t.userName}</div>
                              <div className="text-xs text-slate-400 font-medium">{t.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                          {t._id}
                        </td>
                        <td className="px-6 py-4">
                          <TypeBadge type={t.type} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[240px] truncate text-xs font-semibold text-slate-700" title={t.type === "Deposit" ? "Deposit to Wallet" : t.description}>
                            {t.type === "Deposit" ? "Deposit to Wallet" : t.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {t.paymentMethod && t.paymentMethod !== "—" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 border border-gold/20 px-2.5 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">
                              {t.paymentMethod}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-medium text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-bold flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-slate-800"}`}>
                            {isPositive ? (
                              <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            {isPositive ? "+" : "-"}{formatUSD(Math.abs(t.amount))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          <div className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3 opacity-60" />
                            {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                          <div className="mt-0.5 pl-4 text-[10px] text-slate-400 font-medium">
                            {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }) {
  const styles = {
    Deposit: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    Buy: "bg-blue-50 text-blue-700 border-blue-200/50",
    Sell: "bg-amber-50 text-amber-700 border-amber-200/50",
    Withdrawal: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const labels = {
    Deposit: "Deposit",
    Buy: "Purchase",
    Sell: "Sale",
    Withdrawal: "Withdrawal",
  };

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${styles[type] || "bg-slate-50 text-slate-600"}`}>
      {labels[type] || type}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const icons = {
    Pending: <Clock className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
    Failed: <XCircle className="h-3 w-3" />,
    Cancelled: <XCircle className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {icons[status]}
      {status}
    </span>
  );
}
