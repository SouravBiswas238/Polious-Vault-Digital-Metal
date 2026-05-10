import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ShoppingBag } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import FormField from "@/components/shared/FormField";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login: setAuth } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(form);
      setAuth(data);
      // If coming from checkout redirect, go back to home so user can re-open cart
      navigate(redirect === "checkout" ? "/" : "/account/transactions");
    } catch (err) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Welcome Back
          </span>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight">
            Sign in to your <span className="text-gradient-gold">Vault</span>
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            Access live spot pricing, manage your stored bullion, and review your transaction
            history in one secure place.
          </p>
          <div className="mt-10 grid gap-4 text-sm">
            {[
              "Bank-grade encryption & 2-factor authentication",
              "Insured, segregated vault storage",
              "Instant buy & sell at live market prices",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-foreground/80">
                <ShieldCheck className="h-5 w-5 text-gold" /> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-10">
          {redirect === "checkout" && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3.5">
              <ShoppingBag className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Sign in to complete your order</p>
                <p className="mt-0.5 text-muted-foreground">Your cart items are saved and ready for checkout.</p>
              </div>
            </div>
          )}

          <h2 className="font-display text-3xl font-semibold">Log In</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <FormField
              icon={Mail}
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="you@example.com"
            />
            <FormField
              icon={Lock}
              label="Password"
              type={show ? "text" : "password"}
              required
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              placeholder="••••••••"
              trailing={
                <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-foreground/80">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-gold"
                />
                Remember me
              </label>
              <Link to="/forgot-password" title="Forgot password?" className="font-semibold text-gold hover:underline">Forgot password?</Link>
            </div>


            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="font-semibold text-gold hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
