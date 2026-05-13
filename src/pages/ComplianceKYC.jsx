import { FileCheck, UserCheck, Search, ShieldCheck, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  { icon: UserCheck, step: "01", title: "Create Your Account", desc: "Register with your email and set a secure password. Takes under 2 minutes." },
  { icon: FileCheck, step: "02", title: "Submit Your Documents", desc: "Upload a government-issued photo ID (passport or driving licence) and a proof of address dated within 90 days." },
  { icon: Search, step: "03", title: "Automated Verification", desc: "Our AI-powered KYC engine cross-references your documents against global watchlists in real time." },
  { icon: ShieldCheck, step: "04", title: "Approved & Ready", desc: "Once verified, you have full access to buy, sell, and store precious metals on the platform." },
];

const faqs = [
  { q: "Why do you collect KYC information?", a: "As a regulated precious metals dealer we are legally required to verify the identity of all clients under Anti-Money Laundering (AML) regulations across every jurisdiction we operate in." },
  { q: "How long does verification take?", a: "Most verifications are completed automatically within minutes. Complex cases may require up to 24 hours for manual review by our compliance team." },
  { q: "Is my data safe?", a: "All personal data is encrypted at rest and in transit using AES-256. We are GDPR compliant and never share your data with third parties without your explicit consent." },
  { q: "What documents are accepted?", a: "We accept passports, national identity cards, and driving licences for photo ID. For proof of address: utility bills, bank statements, or government letters dated within 90 days." },
  { q: "What if my verification fails?", a: "Our compliance team will contact you within 24 hours to guide you through an alternative verification path." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function ComplianceKYC() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">Regulatory Compliance</p>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
            Compliance <span className="text-gradient-gold">&amp; KYC</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base text-gray-500 leading-relaxed">
            Polyus Vault operates under strict AML/KYC regulations to protect our clients and maintain the highest standards of financial integrity.
          </p>
        </div>
      </div>

      {/* Verification steps */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">How It Works</p>
          <h2 className="font-display text-4xl font-semibold text-gray-900">Verification in 4 Steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="relative rounded-2xl border border-gray-200 bg-[#f7f7f7] p-7 hover:border-amber-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                  <s.icon className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-amber-200">{s.step}</span>
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance notice */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-7 flex gap-5 items-start mb-20">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 mb-1">Regulatory Notice</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Polyus Vault complies with AML/CFT regulations in the UK (FCA), Switzerland (FINMA), Singapore (MAS), and Canada (FINTRAC). All client funds and metals are held separately from company assets. We are required by law to report suspicious transactions to the relevant financial intelligence units.
            </p>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">FAQ</p>
          <h2 className="font-display text-4xl font-semibold text-gray-900">Common Questions</h2>
        </motion.div>
        <div className="max-w-3xl mx-auto divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <motion.div key={faq.q} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-6">
              <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] text-white px-8 py-3.5 text-sm font-semibold hover:bg-[#162c4a] transition-colors">
            Start Verification <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
