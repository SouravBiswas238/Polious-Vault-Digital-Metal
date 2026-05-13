import { motion } from "framer-motion";
import { Shield, Award, Globe, Clock, Users, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "£2B+", label: "Assets Under Custody" },
  { value: "50K+", label: "Clients Worldwide" },
  { value: "15+", label: "Years of Excellence" },
  { value: "4", label: "Global Vault Locations" },
];

const values = [
  {
    icon: Shield,
    title: "Uncompromising Security",
    description:
      "Every gram of metal stored under your name is fully insured through Lloyd's of London — the world's most trusted insurance market.",
  },
  {
    icon: Award,
    title: "LBMA Accredited",
    description:
      "We trade exclusively in LBMA-certified bullion, guaranteeing the authenticity and purity of every bar and coin.",
  },
  {
    icon: Globe,
    title: "Global Vaulting Network",
    description:
      "Strategically located vaults in Zurich, London, Singapore, and Toronto give our clients geopolitical diversification.",
  },
  {
    icon: Clock,
    title: "Real-Time Pricing",
    description:
      "Live spot prices streamed around the clock, so you always buy and sell at the true market rate — no hidden spreads.",
  },
  {
    icon: Users,
    title: "Client-First Culture",
    description:
      "Our dedicated relationship managers are available 24/7 to guide every step of your precious metals journey.",
  },
  {
    icon: TrendingUp,
    title: "Wealth Preservation",
    description:
      "Gold and silver have protected purchasing power for millennia. We make that timeless strategy accessible to everyone.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function AboutUs({ compact = false }) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-28">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">
            About Polyus Vault
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
            The World's Most Trusted{" "}
            <span className="text-gradient-gold">Precious Metals</span> Platform
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-gray-500 leading-relaxed">
            Founded on the principles of transparency, security, and genuine wealth preservation,
            Polyus Vault bridges the gap between institutional-grade bullion trading and the
            everyday investor.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-amber-200/60 bg-amber-50 p-6 text-center group hover:border-amber-300 hover:shadow-md transition-all duration-300"
            >
              <p className="text-4xl font-bold text-gradient-gold leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Core values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              custom={i * 0.4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group rounded-2xl border border-gray-200 bg-[#f7f7f7] p-7 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                <v.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-3 text-base font-bold text-gray-900">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Story / mission split — full page only */}
        {!compact && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center rounded-3xl border border-gray-200 bg-[#f7f7f7] p-8 lg:p-14 mb-16"
          >
            {/* Left: story */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">
                Our Story
              </p>
              <h3 className="font-display text-3xl font-semibold text-gray-900 mb-5 leading-snug">
                Born from a Vision of Democratic Wealth
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Polyus Vault was founded after witnessing how institutional investors effortlessly
                hedged economic uncertainty with gold, while retail investors were left with
                expensive, illiquid alternatives. We set out to change that.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Today, our platform lets anyone — from first-time buyers to seasoned portfolio
                managers — purchase, store, and sell LBMA-certified bullion at institutional
                spreads, with the same vault-grade security used by central banks.
              </p>
              <Link
                to="/shop/gold"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] text-white px-6 py-3 text-sm font-semibold hover:bg-[#162c4a] transition-colors"
              >
                Start Investing <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: mission pillars */}
            <div className="space-y-4">
              {[
                { title: "Transparency First", body: "No hidden fees. Spot price + a razor-thin spread. Full audit trails for every transaction." },
                { title: "Institutional Access", body: "Direct relationships with LBMA refiners mean you pay what the banks pay — nothing more." },
                { title: "Regulatory Compliance", body: "Fully KYC/AML compliant across all jurisdictions, keeping your investments safe and legal." },
              ].map((pillar, i) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{pillar.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{pillar.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA bar */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-[#1e3a5f] p-10 lg:p-14 text-center"
        >
          {/* Subtle gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% -10%, oklch(0.74 0.14 78 / 0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold mb-3">
              Get Started Today
            </p>
            <h3 className="font-display text-3xl lg:text-4xl font-semibold text-white mb-4">
              Ready to Preserve Your Wealth?
            </h3>
            <p className="text-sm text-white/60 mb-8 max-w-xl mx-auto">
              Join over 50,000 clients who trust Polyus Vault to safeguard their financial future
              with real, allocated precious metals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
              >
                Open Free Account <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/live-charts"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/8 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/14 transition-colors"
              >
                View Live Prices
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
