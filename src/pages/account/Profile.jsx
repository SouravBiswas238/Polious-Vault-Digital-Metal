import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Phone, Globe, Briefcase, Calendar, Lock, ShieldCheck, X, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    authApi.getProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updatedData = await authApi.updateProfile(profile);
      setProfile(updatedData);
      updateUser({ personalInfo: { firstName: updatedData.personalInfo.firstName, lastName: updatedData.personalInfo.lastName, email: updatedData.personalInfo.email } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError("New passwords do not match"); return; }
    if (passwordForm.newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    setPasswordLoading(true);
    try {
      await authApi.updatePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
      setPasswordSuccess(true);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => { setIsChangingPassword(false); setPasswordSuccess(false); }, 2000);
    } catch (err) {
      setPasswordError(err?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse">Loading secure profile…</div>;
  if (!profile) return <div className="text-destructive p-4 border border-destructive/20 bg-destructive/5 rounded-lg">Unable to load profile. Please log in again.</div>;

  return (
    <div className="max-w-4xl relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
          <User className="h-8 w-8 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold">My Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your personal information and vault settings.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-gold" /> Personal Information
            </h3>
            <form onSubmit={handleProfileUpdate} className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name" icon={User} value={profile.personalInfo.firstName} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, firstName: v } })} />
              <Field label="Last Name" icon={User} value={profile.personalInfo.lastName} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, lastName: v } })} />
              <Field label="Email Address" icon={Mail} type="email" disabled className="sm:col-span-2 opacity-70" value={profile.personalInfo.email} onChange={() => {}} />
              <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
                <Field label="Phone Number" icon={Phone} value={profile.personalInfo.phoneNumber} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, phoneNumber: v } })} />
                <Field label="Occupation" icon={Briefcase} value={profile.personalInfo.occupation || ""} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, occupation: v } })} />
              </div>
              <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
                <Field label="Nationality" icon={Globe} value={profile.personalInfo.nationality || ""} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, nationality: v } })} />
                <Field label="Date of Birth" icon={Calendar} type="date" value={profile.personalInfo.dateOfBirth || ""} onChange={(v) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, dateOfBirth: v } })} />
              </div>
              {saveError && <div className="sm:col-span-2 text-sm text-destructive font-medium bg-destructive/5 p-3 rounded-md border border-destructive/20">{saveError}</div>}
              <div className="sm:col-span-2 pt-4 border-t border-border mt-2 flex items-center gap-4">
                <button type="submit" disabled={saving} className="rounded-md bg-gold px-8 py-3 text-sm font-semibold text-gold-foreground hover:opacity-90 shadow-lg shadow-gold/20 transition-all disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {saved && <span className="text-sm font-medium text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Profile updated successfully!</span>}
              </div>
            </form>
          </section>

          {profile.businessInfo?.entityName && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gold" /> Business Details
              </h3>
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Entity Name</span>
                  <span className="font-medium">{profile.businessInfo.entityName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Registration Number</span>
                  <span className="font-medium">{profile.businessInfo.registrationNumber}</span>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gold/20 bg-gold/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">Verified Account</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                Your account is currently active. You have full access to trading and vault storage.
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Security</h3>
            <div className="space-y-3">
              <button onClick={() => setIsChangingPassword(true)} className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm transition-colors">Two-Factor Auth</button>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold">Change Password</h3>
                </div>
                <button onClick={() => { setIsChangingPassword(false); setPasswordError(null); setPasswordSuccess(false); }} className="p-1 rounded-full hover:bg-secondary transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <Field label="Current Password" icon={Lock} type={showOld ? "text" : "password"} required value={passwordForm.oldPassword} onChange={(v) => setPasswordForm({ ...passwordForm, oldPassword: v })} trailing={<button type="button" onClick={() => setShowOld(!showOld)} className="text-muted-foreground/60 hover:text-gold transition-colors">{showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
                <div className="space-y-4">
                  <Field label="New Password" icon={ShieldCheck} type={showNew ? "text" : "password"} required value={passwordForm.newPassword} onChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })} trailing={<button type="button" onClick={() => setShowNew(!showNew)} className="text-muted-foreground/60 hover:text-gold transition-colors">{showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
                  <Field label="Confirm New Password" icon={ShieldCheck} type={showConfirm ? "text" : "password"} required value={passwordForm.confirmPassword} onChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })} trailing={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted-foreground/60 hover:text-gold transition-colors">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
                </div>
                {passwordError && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">{passwordError}</div>}
                {passwordSuccess && <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Password updated successfully!</div>}
                <button type="submit" disabled={passwordLoading || passwordSuccess} className="w-full rounded-md bg-gold py-3 text-sm font-semibold text-gold-foreground hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-gold/20">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, icon: Icon, onChange, trailing, className = "", ...rest }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          <Icon className="h-4 w-4" />
        </div>
        <input {...rest} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background pl-10 pr-10 py-3 text-sm focus:border-gold focus:outline-none transition-colors" />
        {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </label>
  );
}
