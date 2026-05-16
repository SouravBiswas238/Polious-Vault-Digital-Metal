import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, CheckCircle2, XCircle, Clock,
  ArrowDownCircle, User, Mail, DollarSign, ExternalLink
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatUSD } from "../constants";

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All, Pending, Completed, Failed
  const [processingId, setProcessingId] = useState(null);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getWithdrawals();
      setWithdrawals(data);
    } catch (err) {
      console.error("Failed to load withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this withdrawal? The user's balance will be deducted.")) return;
    setProcessingId(id);
    try {
      await adminApi.approveWithdrawal(id);
      await loadWithdrawals();
    } catch (err) {
      alert(err.message || "Failed to approve withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this withdrawal?")) return;
    setProcessingId(id);
    try {
      await adminApi.rejectWithdrawal(id);
      await loadWithdrawals();
    } catch (err) {
      alert(err.message || "Failed to reject withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = withdrawals.filter((w) => {
    const matchesSearch =
      w.userName.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      w._id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All" || w.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Withdrawal Requests</h2>
          <p className="text-muted-foreground">Manage and process user withdrawal requests.</p>
        </div>
        <button
          onClick={loadWithdrawals}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "Pending", "Completed", "Failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-gold text-gold-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Method / Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
                        <p>Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-8 w-8 opacity-20" />
                        <p>No withdrawal requests found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((w) => (
                    <motion.tr
                      key={w._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                            {w.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{w.userName}</div>
                            <div className="text-xs text-muted-foreground">{w.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{formatUSD(w.amount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] truncate text-xs text-muted-foreground" title={w.description}>
                          {w.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={w.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(w.createdAt).toLocaleDateString()} <br />
                        {new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {w.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(w._id)}
                              disabled={!!processingId}
                              className="rounded-md bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(w._id)}
                              disabled={!!processingId}
                              className="rounded-md bg-emerald-500/10 p-2 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Processed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Failed: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const icons = {
    Pending: <Clock className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
    Failed: <XCircle className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}
