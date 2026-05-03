import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { accountApi, type AuthUser } from "@/lib/api";

export const Route = createFileRoute("/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    accountApi.profile().then(setUser);
  }, []);

  if (!user) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">My Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        className="mt-8 grid gap-5 sm:grid-cols-2"
      >
        <Field
          label="First Name"
          value={user.firstName}
          onChange={(v) => setUser({ ...user, firstName: v })}
        />
        <Field
          label="Last Name"
          value={user.lastName}
          onChange={(v) => setUser({ ...user, lastName: v })}
        />
        <Field
          label="Email Address"
          type="email"
          className="sm:col-span-2"
          value={user.email}
          onChange={(v) => setUser({ ...user, email: v })}
        />
        <div className="sm:col-span-2 flex items-center gap-3">
          <button className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground hover:opacity-90">
            Save Changes
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved.</span>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  onChange,
  className = "",
  ...rest
}: { label: string; onChange: (v: string) => void; className?: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "className"
>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
