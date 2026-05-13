import { Link } from "react-router-dom";
import { useState } from "react";

const UPDATED = "13 May 2026";

const cookieTypes = [
  {
    id: "essential",
    label: "Essential",
    color: "bg-green-100 text-green-700 border-green-200",
    required: true,
    title: "Essential Cookies",
    desc: "These cookies are strictly necessary for the Platform to function. They enable core features such as user authentication, session management, security, and navigation. They cannot be disabled.",
    examples: [
      { name: "session_id", purpose: "Maintains your login session", expiry: "Session" },
      { name: "csrf_token", purpose: "Protects against cross-site request forgery", expiry: "Session" },
      { name: "auth_token", purpose: "Keeps you signed in securely", expiry: "30 days" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    required: false,
    title: "Analytics Cookies",
    desc: "These cookies help us understand how visitors interact with our Platform by collecting aggregated, anonymised data. They allow us to improve performance and content. No personally identifiable information is collected.",
    examples: [
      { name: "_ga", purpose: "Google Analytics — tracks unique visits", expiry: "2 years" },
      { name: "_gid", purpose: "Google Analytics — distinguishes users", expiry: "24 hours" },
      { name: "clarity", purpose: "Microsoft Clarity — session replay (anonymised)", expiry: "1 year" },
    ],
  },
  {
    id: "personalisation",
    label: "Personalisation",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    required: false,
    title: "Personalisation Cookies",
    desc: "These cookies remember your preferences and settings to give you a more personalised experience on return visits.",
    examples: [
      { name: "preferred_currency", purpose: "Remembers your currency preference", expiry: "1 year" },
      { name: "preferred_language", purpose: "Remembers your language setting", expiry: "1 year" },
      { name: "theme_mode", purpose: "Remembers display preferences", expiry: "1 year" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    required: false,
    title: "Marketing Cookies",
    desc: "These cookies are used to deliver advertisements relevant to your interests on third-party platforms. They may track your browsing across websites and are used for user profiling.",
    examples: [
      { name: "_fbp", purpose: "Facebook Pixel — tracks conversions", expiry: "3 months" },
      { name: "li_fat_id", purpose: "LinkedIn Insight — ad performance", expiry: "30 days" },
      { name: "googletag", purpose: "Google Ads — remarketing", expiry: "90 days" },
    ],
  },
];

function CookieCard({ cookie, enabled, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#f7f7f7] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cookie.color}`}>
            {cookie.label}
          </span>
          <span className="font-semibold text-gray-900 text-sm">{cookie.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {cookie.required ? (
            <span className="text-xs text-gray-400 font-medium">Always active</span>
          ) : (
            <button
              onClick={onToggle}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                enabled ? "bg-amber-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  enabled ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition-colors"
          >
            {open ? "Less ↑" : "Details ↓"}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-5">{cookie.desc}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Cookie Name</th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Purpose</th>
                  <th className="text-left py-2 text-gray-500 font-semibold">Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cookie.examples.map((ex) => (
                  <tr key={ex.name}>
                    <td className="py-2 pr-4 font-mono text-gray-800">{ex.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{ex.purpose}</td>
                    <td className="py-2 text-gray-500">{ex.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CookiePolicy() {
  const [prefs, setPrefs] = useState({ analytics: true, personalisation: true, marketing: false });
  const [saved, setSaved] = useState(false);

  const toggle = (id) => setPrefs((p) => ({ ...p, [id]: !p[id] }));
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Legal</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            Cookie <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: {UPDATED}</p>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
            We use cookies and similar technologies to operate our Platform and improve your experience. This page explains what cookies we use and gives you control over your preferences.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* What are cookies */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-[#f7f7f7] p-7">
          <h2 className="font-bold text-gray-900 mb-3">What are cookies?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cookies are small text files placed on your device when you visit a website. They allow the website to remember your actions and preferences over a period of time, so you don't have to re-enter them whenever you return or browse between pages. Some cookies are deleted when you close your browser (session cookies), while others persist until they expire or you delete them (persistent cookies).
          </p>
        </div>

        {/* Cookie preference manager */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">Manage Your Cookie Preferences</h2>
          <p className="text-sm text-gray-500 mb-6">
            Toggle each category below to control which cookies we use. Essential cookies cannot be disabled as the Platform cannot function without them.
          </p>

          <div className="space-y-4">
            {cookieTypes.map((c) => (
              <CookieCard
                key={c.id}
                cookie={c}
                enabled={c.required || prefs[c.id]}
                onToggle={() => toggle(c.id)}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] text-white px-7 py-3 text-sm font-semibold hover:bg-[#162c4a] transition-colors"
            >
              {saved ? "✓ Saved!" : "Save Preferences"}
            </button>
            <button
              onClick={() => {
                setPrefs({ analytics: false, personalisation: false, marketing: false });
                setSaved(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Reject all non-essential
            </button>
            <button
              onClick={() => {
                setPrefs({ analytics: true, personalisation: true, marketing: true });
                setSaved(false);
              }}
              className="text-sm text-amber-600 hover:text-amber-700 underline transition-colors"
            >
              Accept all
            </button>
          </div>
        </div>

        {/* Further info */}
        <div className="rounded-2xl border border-gray-200 p-7 space-y-4">
          <h2 className="font-bold text-gray-900">Further Information</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For more information about how we process your personal data, please see our <Link to="/privacy" className="text-amber-600 font-semibold hover:underline">Privacy Policy</Link>. For questions about these cookies or your rights, contact us at <a href="mailto:privacy@polyusvault.com" className="text-amber-600 font-semibold hover:underline">privacy@polyusvault.com</a>.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            You can also manage or delete cookies through your browser settings. Visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">allaboutcookies.org</a> for guidance on how to do this for different browsers and devices.
          </p>
        </div>
      </div>
    </div>
  );
}
