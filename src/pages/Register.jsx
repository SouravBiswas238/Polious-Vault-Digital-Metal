import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail, Lock, User, Phone, ShieldCheck, Eye, EyeOff, Building2,
  CheckCircle2, ChevronRight, ChevronLeft, Briefcase, Calendar, Flag, MapPin,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { countries } from "countries-list";
import FormField from "@/components/shared/FormField";

const COUNTRY_LIST = Object.entries(countries)
  .map(([code, data]) => ({
    iso: code,
    name: data.name,
    phone: `+${data.phone[0]}`,
    emoji: data.emoji,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const ACCOUNT_TYPES = [
  { id: "personal", label: "Personal Account", desc: "For individual investors" },
  { id: "business", label: "Business Account", desc: "For corporations, LLCs, or partnerships" },
  { id: "joint", label: "Joint Account", desc: "Shared ownership between two individuals" },
  { id: "trust", label: "Trust Account", desc: "Managed on behalf of a trust" },
  { id: "minor", label: "Minor Account", desc: "Managed for someone under 18" },
];

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    accountType: "personal",
    personalInfo: {
      firstName: "", lastName: "", email: "", phoneCode: "+91", phoneNumber: "",
      occupation: "", dateOfBirth: "", nationality: "India",
    },
    businessInfo: {
      entityName: "", tradeName: "", entityType: "Corporation", registrationNumber: "",
      businessAddress: { street: "", suite: "", city: "", state: "", country: "United States", zipCode: "" },
    },
    kycCompliance: { pepStatus: false, taxCountry: "United States", taxId: "" },
    marketingPreferences: { subscribeNewsletters: true, subscribePromotions: false },
    agreements: { termsAccepted: false, amlPolicyAccepted: false },
    password: "",
  });

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!form.personalInfo.firstName) newErrors.firstName = "First name is required";
      if (!form.personalInfo.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.personalInfo.email)) newErrors.email = "Invalid email format";
      if (!form.personalInfo.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    }
    if (currentStep === 2 && form.accountType === "business") {
      if (!form.businessInfo?.entityName) newErrors.entityName = "Entity name is required";
      if (!form.businessInfo?.businessAddress?.street) newErrors.street = "Street address is required";
    }
    if (currentStep === 3) {
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (!form.agreements.termsAccepted) newErrors.terms = "You must accept terms";
      if (!form.agreements.amlPolicyAccepted) newErrors.aml = "You must accept AML policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (step === 1 && form.accountType !== "business") setStep(3);
    else setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step === 3 && form.accountType !== "business") setStep(1);
    else setStep((s) => s - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(form);
      setAuth(data);
      navigate("/account/profile");
    } catch (err) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const currentFlag = COUNTRY_LIST.find(c => c.phone === form.personalInfo.phoneCode)?.emoji || "🌐";

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 w-full overflow-hidden">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Step {step === 3 ? 4 : step + 1} of 4
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Create your <span className="text-gradient-gold">Polyus Vault</span> account
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            {step === 0 && "Select the type of account you'd like to open."}
            {step === 1 && "Provide your basic contact information."}
            {step === 2 && "Enter your business registration details."}
            {step === 3 && "Finalize your account and security settings."}
          </p>
        </div>

        <div className="mt-8 flex gap-2 px-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-border"}`} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-10 shadow-xl overflow-hidden">
          <form onSubmit={onSubmit} className="space-y-6">
            {step === 0 && (
              <div className="grid gap-4">
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setForm({ ...form, accountType: type.id })}
                    className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 text-left transition-all ${form.accountType === type.id ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-border bg-background hover:border-gold/50"}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${form.accountType === type.id ? "bg-gold text-white" : "bg-muted text-muted-foreground"}`}>
                      {type.id === "personal" ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base truncate">{type.label}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{type.desc}</div>
                    </div>
                    {form.accountType === type.id && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-gold" />}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField icon={User} label="First Name" required error={errors.firstName} value={form.personalInfo.firstName} onChange={(v) => setForm({ ...form, personalInfo: { ...form.personalInfo, firstName: v } })} />
                  <FormField icon={User} label="Last Name" value={form.personalInfo.lastName} onChange={(v) => setForm({ ...form, personalInfo: { ...form.personalInfo, lastName: v } })} />
                </div>
                <FormField icon={Mail} label="Email Address" type="email" required error={errors.email} value={form.personalInfo.email} onChange={(v) => setForm({ ...form, personalInfo: { ...form.personalInfo, email: v } })} placeholder="you@example.com" />

                <div className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone Number <span className="text-red-500">*</span>
                  </span>
                  <div className={`flex items-center rounded-md border bg-background focus-within:border-gold ${errors.phoneNumber ? 'border-red-500' : 'border-border'}`}>
                    <div className="relative flex items-center w-[30%] sm:w-[20%] min-w-[80px] border-r border-border bg-muted/30">
                      <div className="flex items-center justify-center w-full px-2 py-3 cursor-pointer">
                        <span className="text-lg mr-1 shrink-0">{currentFlag}</span>
                        <select
                          value={form.personalInfo.phoneCode}
                          onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, phoneCode: e.target.value } })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                          {COUNTRY_LIST.map(c => (
                            <option key={c.iso} value={c.phone}>{c.emoji} {c.name} ({c.phone})</option>
                          ))}
                        </select>
                        <span className="text-sm font-medium shrink-0">{form.personalInfo.phoneCode}</span>
                        <div className="ml-1 pointer-events-none">
                          <div className="h-0 w-0 border-x-[3px] border-x-transparent border-t-[4px] border-t-muted-foreground"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center px-3">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={form.personalInfo.phoneNumber}
                        onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, phoneNumber: e.target.value } })}
                        className="w-full bg-transparent py-3 text-sm focus:outline-none"
                        placeholder="555-0123"
                      />
                    </div>
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-[10px] text-red-500 font-medium uppercase tracking-tight">{errors.phoneNumber}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField icon={Briefcase} label="Occupation" value={form.personalInfo.occupation} onChange={(v) => setForm({ ...form, personalInfo: { ...form.personalInfo, occupation: v } })} placeholder="e.g. Software Engineer" />
                  <FormField icon={Calendar} label="Date of Birth" type="date" value={form.personalInfo.dateOfBirth} onChange={(v) => setForm({ ...form, personalInfo: { ...form.personalInfo, dateOfBirth: v } })} />
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nationality</span>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 focus-within:border-gold">
                    <Flag className="h-4 w-4 text-muted-foreground shrink-0" />
                    <select
                      value={form.personalInfo.nationality}
                      onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, nationality: e.target.value } })}
                      className="w-full bg-transparent py-3 text-sm focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_LIST.map(c => <option key={c.iso} value={c.name}>{c.emoji} {c.name}</option>)}
                    </select>
                  </div>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField icon={Building2} label="Entity Name" required error={errors.entityName} value={form.businessInfo?.entityName} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, entityName: v } })} />
                  <FormField icon={Building2} label="Trade Name (Optional)" value={form.businessInfo?.tradeName} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, tradeName: v } })} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entity Type</span>
                    <select
                      value={form.businessInfo?.entityType}
                      onChange={(e) => setForm({ ...form, businessInfo: { ...form.businessInfo, entityType: e.target.value } })}
                      className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm focus:border-gold focus:outline-none"
                    >
                      <option>Corporation</option>
                      <option>LLC</option>
                      <option>Partnership</option>
                    </select>
                  </label>
                  <FormField icon={ShieldCheck} label="Reg. Number" value={form.businessInfo?.registrationNumber} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, registrationNumber: v } })} />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Address</span>
                  <div className="grid gap-4">
                    <FormField icon={MapPin} label="Street Address" required error={errors.street} value={form.businessInfo?.businessAddress?.street} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, businessAddress: { ...form.businessInfo?.businessAddress, street: v } } })} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField icon={MapPin} label="City" value={form.businessInfo?.businessAddress?.city} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, businessAddress: { ...form.businessInfo?.businessAddress, city: v } } })} />
                      <FormField icon={MapPin} label="State" value={form.businessInfo?.businessAddress?.state} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, businessAddress: { ...form.businessInfo?.businessAddress, state: v } } })} />
                      <FormField icon={MapPin} label="Zip Code" value={form.businessInfo?.businessAddress?.zipCode} onChange={(v) => setForm({ ...form, businessInfo: { ...form.businessInfo, businessAddress: { ...form.businessInfo?.businessAddress, zipCode: v } } })} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <Field
                  icon={Lock}
                  label="Secure Password"
                  type={show ? "text" : "password"}
                  required
                  error={errors.password}
                  value={form.password}
                  onChange={(v) => setForm({ ...form, password: v })}
                  placeholder="At least 8 characters"
                  trailing={
                    <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground shrink-0">
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <div className="space-y-4">
                  <label className={`flex items-start gap-3 text-xs sm:text-sm ${errors.terms ? 'text-red-500' : 'text-foreground/80'}`}>
                    <input type="checkbox" checked={form.agreements.termsAccepted} onChange={(e) => setForm({ ...form, agreements: { ...form.agreements, termsAccepted: e.target.checked } })} className={`mt-0.5 h-4 w-4 rounded border-border accent-[var(--gold)] shrink-0 ${errors.terms ? 'border-red-500' : ''}`} />
                    <span>I agree to the <a className="font-semibold text-gold hover:underline">Terms of Service</a> and <a className="font-semibold text-gold hover:underline">Privacy Policy</a>. <span className="text-red-500">*</span></span>
                  </label>
                  <label className={`flex items-start gap-3 text-xs sm:text-sm ${errors.aml ? 'text-red-500' : 'text-foreground/80'}`}>
                    <input type="checkbox" checked={form.agreements.amlPolicyAccepted} onChange={(e) => setForm({ ...form, agreements: { ...form.agreements, amlPolicyAccepted: e.target.checked } })} className={`mt-0.5 h-4 w-4 rounded border-border accent-[var(--gold)] shrink-0 ${errors.aml ? 'border-red-500' : ''}`} />
                    <span>I acknowledge and accept the <a className="font-semibold text-gold hover:underline">AML/KYC Policy</a>. <span className="text-red-500">*</span></span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <input type="checkbox" checked={form.marketingPreferences.subscribeNewsletters} onChange={(e) => setForm({ ...form, marketingPreferences: { ...form.marketingPreferences, subscribeNewsletters: e.target.checked } })} className="h-4 w-4 rounded border-border accent-[var(--gold)] shrink-0" />
                    Subscribe to market news & daily spot prices.
                  </label>
                  <label className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <input type="checkbox" checked={form.marketingPreferences.subscribePromotions} onChange={(e) => setForm({ ...form, marketingPreferences: { ...form.marketingPreferences, subscribePromotions: e.target.checked } })} className="h-4 w-4 rounded border-border accent-[var(--gold)] shrink-0" />
                    Receive exclusive promotions and vault offers.
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 0 && (
                <button type="button" onClick={prevStep} className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border py-3 text-sm font-semibold transition-colors hover:bg-muted">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold py-3 text-sm font-semibold text-gold-foreground transition-opacity hover:opacity-90">
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gold py-3 text-sm font-semibold text-gold-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                  {loading ? "Creating account…" : "Create My Account"}
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold" /> Your data is secured with 256-bit SSL encryption
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-gold hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

