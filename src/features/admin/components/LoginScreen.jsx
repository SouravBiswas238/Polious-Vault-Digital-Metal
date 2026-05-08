import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../constants";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid email or password.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-linear-to-r from-amber-500 to-orange-500 px-8 py-10 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-4">
              <Shield className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Console</h1>
            <p className="mt-1.5 text-sm text-white/70">Polyus Vault — Restricted Area</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@polyusvault.com"
                className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-300 outline-none transition-all ${
                  error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={`w-full rounded-xl border-2 px-4 py-3.5 pr-12 text-sm text-slate-800 placeholder-slate-300 outline-none transition-all ${
                    error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 py-3.5 text-sm font-bold text-white transition-all cursor-pointer shadow-lg shadow-amber-500/30 mt-2"
            >
              Sign In to Console
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pb-6">
            All access is logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
