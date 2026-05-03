import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Phone, Globe2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create Account — Polyus Vault" }] }),
});

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "Switzerland", "Singapore", "Other"];

function RegisterPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "United States",
    phone: "",
    agree: false,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setError("You must agree to the Terms of Service");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.register(form);
      navigate({ to: "/account/profile" });
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Open Account</span>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Create your <span className="text-gradient-gold">Polyus Vault</span> account
          </h1>
          <p className="mt-3 text-muted-foreground">Free to open. Takes less than 2 minutes.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-10">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={User} label="First Name" required value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Field icon={User} label="Last Name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            </div>

            <Field icon={Mail} label="Email Address" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                icon={Lock}
                label="Password"
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                placeholder="At least 8 characters"
                trailing={
                  <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <Field icon={Phone} label="Phone (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+1 555 123 4567" />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</span>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 focus-within:border-gold">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-transparent py-3 text-sm focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm text-foreground/80">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--gold)]"
              />
              <span>
                I agree to the <a className="font-semibold text-gold hover:underline">Terms of Service</a> and{" "}
                <a className="font-semibold text-gold hover:underline">Privacy Policy</a>.
              </span>
            </label>

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gold py-3 text-sm font-semibold text-gold-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" /> Your data is secured with 256-bit SSL encryption
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-gold hover:underline">
                Log in
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
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
