import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import FormField from "@/components/shared/FormField";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset successful!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-12 lg:py-20 flex items-center justify-center px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl sm:p-12 w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold">Password Reset!</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
          </div>
          <button
            className="w-full rounded-md bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Account Security
          </span>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight">
            Set a new <span className="text-gradient-gold">Password</span>
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            Choose a strong password to keep your vault secure. We recommend using a unique combination of letters, numbers, and symbols.
          </p>
          <div className="mt-10 grid gap-4 text-sm">
            {[
              "At least 6 characters long",
              "Mix uppercase, lowercase & numbers",
              "Use symbols for extra security",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-foreground/80">
                <ShieldCheck className="h-5 w-5 text-gold" /> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>

          <h2 className="font-display text-3xl font-semibold">Reset Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Please enter your new password below.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField
              icon={Lock}
              label="New Password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(v) => setPassword(v)}
              placeholder="••••••••"
              trailing={
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <FormField
              icon={Lock}
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(v) => setConfirmPassword(v)}
              placeholder="••••••••"
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
            />

            <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3.5">
              <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Security Tip</p>
                <p className="mt-0.5 text-muted-foreground">
                  Use a combination of uppercase letters, numbers, and symbols to keep your account secure.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Updating…" : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
