import { Shield, Lock, Globe, Warehouse, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const locations = [
  { city: "Zurich", country: "Switzerland", flag: "🇨🇭", desc: "Our flagship vault at a Swiss Class A security facility, audited by KPMG annually." },
  { city: "London", country: "United Kingdom", flag: "🇬🇧", desc: "LBMA-registered storage in the heart of the global precious metals trading hub." },
  { city: "Singapore", country: "Singapore", flag: "🇸🇬", desc: "Asia-Pacific hub offering full GST-exempt storage for investment-grade metals." },
  { city: "Toronto", country: "Canada", flag: "🇨🇦", desc: "North American vault providing full regulatory compliance under FINTRAC rules." },
];

const features = [
  { icon: Shield, title: "Fully Insured", desc: "100% of your holdings are insured through Lloyd's of London, the world's leading specialist insurance market." },
  { icon: Lock, title: "Allocated Storage", desc: "Your metal is physically segregated and held in your name — never pooled with other clients." },
  { icon: Globe, title: "Geographic Diversification", desc: "Store across multiple jurisdictions to reduce geopolitical and counterparty risk." },
  { icon: Clock, title: "24/7 Monitoring", desc: "Round-the-clock CCTV, biometric access controls and armed security at every facility." },
  { icon: Warehouse, title: "LBMA Approved", desc: "All vaults are LBMA-approved ensuring your metals meet the highest refinery standards." },
  { icon: Shield, title: "Full Audit Rights", desc: "Request an independent audit of your holdings at any time. Complete transparency, always." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function VaultStorage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">Security & Storage</p>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
            Vault <span className="text-gradient-gold">Storage</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base text-gray-500 leading-relaxed">
            Your precious metals are held in allocated, insured, and audited vaults across four global locations — giving you maximum security and geopolitical diversification.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/shop/gold" className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#162c4a] transition-colors">
              Start Storing <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 hover:border-amber-400 transition-colors">
              About Polyus Vault
            </Link>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Why Our Vaults</p>
          <h2 className="font-display text-4xl font-semibold text-gray-900">Institutional-Grade Protection</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-7 hover:border-amber-300 hover:shadow-md transition-all duration-300">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                <f.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Locations */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Our Facilities</p>
          <h2 className="font-display text-4xl font-semibold text-gray-900">4 Global Vault Locations</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locations.map((loc, i) => (
            <motion.div key={loc.city} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300">
              <div className="text-4xl mb-3">{loc.flag}</div>
              <h3 className="font-bold text-gray-900 text-base mb-0.5">{loc.city}</h3>
              <p className="text-xs text-amber-600 font-semibold mb-3">{loc.country}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{loc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
