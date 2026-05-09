import { Link } from "react-router-dom";
import { Shield, Award, Lock, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const shopLinks = [
  { label: "Gold Bullion", to: "/#shop" },
  { label: "Silver Bullion", to: "/#shop" },
  { label: "Platinum", to: "/#shop" },
  { label: "Palladium", to: "/#shop" },
  { label: "Rhodium", to: "/#shop" },
];

const accountLinks = [
  { label: "My Account", to: "/account/transactions" },
  { label: "Transaction History", to: "/account/transactions" },
  { label: "My Profile", to: "/account/profile" },
  { label: "Refer a Friend", to: "/account/refer" },
  { label: "Sign In", to: "/login" },
];

const companyLinks = [
  { label: "About Us", to: "#" },
  { label: "Vault Storage", to: "#" },
  { label: "Compliance & KYC", to: "#" },
  { label: "Live Charts", to: "/live-charts" },
  { label: "Contact Us", to: "#" },
];

const trustBadges = [
  { icon: Shield, title: "Insured Storage", desc: "Lloyd's of London coverage" },
  { icon: Award, title: "LBMA Accredited", desc: "Certified precious metals dealer" },
  { icon: Lock, title: "Secure Payments", desc: "Bank-grade 256-bit encryption" },
];

export function Footer() {
  return (
    <footer className="bg-[oklch(0.13_0.04_255)] text-white/70">
      {/* Trust bar */}
      <div className="border-b border-white/8">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {trustBadges.map((b) => (
              <div key={b.title} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
                  <b.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-white/45">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Polyus Vault" className="h-9 w-9 rounded-md object-contain" />
              <div>
                <div className="font-display text-xl font-bold text-gradient-gold tracking-tight">POLYUS VAULT</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">Precious Metals Dealer</div>
              </div>
            </Link>
            <p className="mt-5 max-w-xs text-sm text-white/45 leading-relaxed">
              A trusted dealer of investment-grade precious metals with insured vaulted storage in Zurich, Singapore, and Toronto.
            </p>
            <div className="mt-6 space-y-2 text-xs text-white/40">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold/50" /> 1-800-POLYUS-1</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold/50" /> support@polyusvault.com</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold/50" /> Zurich · Singapore · Toronto</div>
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Shop", links: shopLinks },
            { title: "Account", links: accountLinks },
            { title: "Company", links: companyLinks },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gold/80">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/45 transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 px-6 lg:px-12 py-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Polyus Vault. All rights reserved. All prices in USD.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
