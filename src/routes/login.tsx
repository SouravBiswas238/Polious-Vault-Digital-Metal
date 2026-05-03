import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Log In — Polyus Vault" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.login(form);
      navigate({ to: "/account/transactions" });
    } catch (err: any) {
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
          <h2 className="font-display text-3xl font-semibold">Log In</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field
              icon={Mail}
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="you@example.com"
            />
            <Field
              icon={Lock}
              label="Password"
              type={show ? "text" : "password"}
              required
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="text-muted-foreground hover:text-foreground"
                >
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
                  className="h-4 w-4 rounded border-border accent-[var(--gold)]"
                />
                Remember me
              </label>
              <a href="#" className="font-semibold text-gold hover:underline">
                Forgot password?
              </a>
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
              <Link to="/register" className="font-semibold text-gold hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  trailing,
  onChange,
  ...rest
}: {
  icon: any;
  label: string;
  trailing?: React.ReactNode;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 focus-within:border-gold">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          {...rest}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-sm focus:outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}
