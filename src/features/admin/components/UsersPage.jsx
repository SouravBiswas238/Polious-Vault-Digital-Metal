import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, X, Users, DollarSign,
  Plus, CheckCircle2, AlertCircle,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { PRESETS, formatUSD } from "../constants";

export default function UsersPage({ users, usersLoading, loadUsers, onOp }) {
  const [search, setSearch]             = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBalance, setUserBalance]   = useState(null);
  const [amount, setAmount]             = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Wire Transfer");
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [showModal, setShowModal]       = useState(false);

  const openRecharge = async (user) => {
    setSelectedUser(user);
    setResult(null);
    setAmount("");
    setPaymentMethod("Bank Wire Transfer");
    setShowModal(true);
    try {
      const bal = await adminApi.getUserBalance(user._id);
      setUserBalance(bal.balance);
    } catch {
      setUserBalance(0);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setAmount("");
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await adminApi.addBalance(selectedUser._id, num, paymentMethod);
      setUserBalance(res.balance);
      onOp();
      setResult({ type: "success", message: `Added ${formatUSD(num)} via ${paymentMethod}. New balance: ${formatUSD(res.balance)}` });
      setAmount("");
      loadUsers();
    } catch (err) {
      setResult({ type: "error", message: err?.message || "Failed to update balance." });
    }
    setLoading(false);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u._id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Users</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage registered accounts and balances.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-700">All Users</span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filtered?.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or ID…"
                className="w-64 sm:w-80 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={loadUsers}
              disabled={usersLoading}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${usersLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider w-12">#</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">User ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Balance</th>
                <th className="text-right px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="h-8 w-8 text-slate-300 animate-spin" />
                      <p className="text-sm text-slate-400">Loading users…</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="h-7 w-7 text-slate-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        {users.length === 0 ? "No registered users yet." : "No users match your search."}
                      </p>
                      {users.length === 0 && (
                        <p className="text-xs text-slate-300">Users appear here after they register.</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                          {(u.firstName?.[0] || u.email?.[0] || "?").toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {u.firstName || u.lastName
                            ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                            : "Unnamed User"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{u.email || "—"}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <code className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md font-mono">
                        {u._id?.slice(0, 10)}…
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${u.balance > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                        {u.balance !== undefined ? formatUSD(u.balance) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openRecharge(u)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 px-3.5 py-2 rounded-lg transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                      >
                        <DollarSign className="h-3.5 w-3.5" /> Recharge
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-600">{users.length}</span> users
            </p>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="relative bg-linear-to-r from-amber-500 to-orange-500 px-6 py-6">
                    <button
                      onClick={closeModal}
                      className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-12 w-12 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-white text-xl font-bold">
                        {(selectedUser.firstName?.[0] || selectedUser.email?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">
                          {selectedUser.firstName || selectedUser.lastName
                            ? `${selectedUser.firstName ?? ""} ${selectedUser.lastName ?? ""}`.trim()
                            : "Unnamed User"}
                        </div>
                        <div className="text-sm text-white/70 mt-0.5">{selectedUser.email}</div>
                      </div>
                    </div>
                    <div className="bg-white/15 rounded-xl px-4 py-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-0.5">Current Balance</div>
                        <div className="text-2xl font-bold text-white tabular-nums">
                          {userBalance === null
                            ? <span className="text-white/50 text-base">Loading…</span>
                            : formatUSD(userBalance)}
                        </div>
                      </div>
                      <DollarSign className="h-9 w-9 text-white/25" />
                    </div>
                  </div>

                  <form onSubmit={handleAddBalance} className="px-6 py-6 space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Quick Amounts
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {PRESETS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setAmount(String(p))}
                            className={`rounded-xl border-2 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                              amount === String(p)
                                ? "border-amber-400 bg-amber-50 text-amber-600 shadow-sm"
                                : "border-slate-200 bg-slate-50 text-slate-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                          >
                            ${p >= 1000 ? `${p / 1000}k` : p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Custom Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">$</span>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-8 pr-4 py-3.5 text-base text-slate-800 placeholder-slate-300 focus:border-amber-400 focus:bg-white focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 focus:border-amber-400 focus:bg-white focus:outline-none transition-all font-semibold cursor-pointer"
                      >
                        <option value="Credit / Debit Card">Credit / Debit Card</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PayPal">PayPal</option>
                        <option value="eCheck (ACH)">eCheck (ACH)</option>
                        <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                        <option value="Cryptocurrency">Cryptocurrency</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`rounded-xl border-2 p-3.5 text-sm font-semibold flex items-start gap-2.5 ${
                            result.type === "success"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-red-200 bg-red-50 text-red-600"
                          }`}
                        >
                          {result.type === "success"
                            ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                            : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                          {result.message}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 py-3.5 text-sm font-bold text-slate-500 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!amount || parseFloat(amount) <= 0 || loading}
                        className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed py-3.5 text-sm font-bold text-white transition-all cursor-pointer shadow-lg shadow-amber-500/30"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Add {amount && parseFloat(amount) > 0 ? formatUSD(parseFloat(amount)) : "Balance"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
