import { Construction, ShieldAlert, ShieldCheck } from "lucide-react";

export default function TwoFactorAuth() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <ShieldCheck className="h-8 w-8 text-amber-500" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground">Add an extra layer of security to your vault account.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-8">
          <Construction className="h-12 w-12 text-amber-500" />
        </div>

        <h3 className="text-2xl font-display font-semibold mb-4">Under Construction</h3>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
          We are currently implementing a multi-method 2FA system (Authenticator App & SMS) to ensure your precious metal holdings remain secure. This feature will be live in our next security update.
        </p>

        <div className="inline-flex items-start gap-3 rounded-xl bg-secondary/50 p-5 border border-border/50 text-left max-w-lg">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Why 2FA matters?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Two-factor authentication significantly reduces the risk of unauthorized access even if your password is compromised. We recommend checking back soon to enable this protection.
            </p>
          </div>
        </div>
      </div>
      
      {/* Placeholder for future implementation */}
      <div className="mt-8 p-4 border-2 border-dashed border-border rounded-xl text-center text-xs text-muted-foreground/40 italic">
        Future 2FA implementation hooks and logic will be placed here.
      </div>
    </div>
  );
}
