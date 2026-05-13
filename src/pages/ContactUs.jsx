import { Phone, Mail, MapPin, Clock, MessageSquare, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const contactMethods = [
  { icon: Phone, title: "Phone", detail: "+44 7868 176940", sub: "Mon–Fri, 9am–6pm GMT" },
  { icon: Mail, title: "Email", detail: "support@polyusvault.com", sub: "We reply within 24 hours" },
  { icon: MapPin, title: "Headquarters", detail: "London, United Kingdom", sub: "By appointment only" },
  { icon: Clock, title: "Support Hours", detail: "24 / 7 Online Chat", sub: "Always available via live chat" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    // Build the structured message for the support agent
    const contactNote = [
      "📩 CONTACT FORM SUBMISSION",
      "",
      `Name    : ${form.name}`,
      `Email   : ${form.email}`,
      `Subject : ${form.subject}`,
      "",
      `Message :`,
      form.message,
    ].join("\n");

    // Identify the sender in SaleSmartly
    window.ssq = window.ssq || [];
    window.ssq.push("setCustomer", {
      name:        form.name,
      email:       form.email,
      description: contactNote,
    });

    // Open the chat panel
    // window.ssq.push("chatOpen");

    // Send the pre-composed message once the panel opens, then show success
    setTimeout(() => {
      window.ssq.push("sendTextMessage", contactNote);
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">Get In Touch</p>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-base text-gray-500 leading-relaxed">
            Have a question about buying, selling, or storing precious metals? Our team of experts is here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
        {/* Contact method cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {contactMethods.map((c, i) => (
            <motion.div key={c.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-6 text-center hover:border-amber-300 hover:shadow-md transition-all duration-300">
              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                <c.icon className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">{c.title}</p>
              <p className="font-semibold text-gray-900 text-sm mb-1">{c.detail}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact form + info split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: form */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Send a Message</p>
            <h2 className="font-display text-3xl font-semibold text-gray-900 mb-7">We'd love to hear from you</h2>

            {sent ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-bold text-gray-900 mb-1">Message Sent!</p>
                <p className="text-sm text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="contact-name">Full Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about vault storage"
                    className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    className="w-full rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] text-white px-8 py-3.5 text-sm font-semibold hover:bg-[#162c4a] transition-colors w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Opening Chat…</>
                  ) : (
                    <><MessageSquare className="h-4 w-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: info */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-7">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">Office Locations</p>
              <div className="space-y-4">
                {["London, UK", "Zurich, Switzerland", "Singapore", "Toronto, Canada"].map((loc) => (
                  <div key={loc} className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
              <p className="font-bold text-gray-900 mb-2 text-sm">Prefer to call?</p>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Our relationship managers are available Monday to Friday, 9am–6pm GMT for account queries, trade assistance, and vault enquiries.
              </p>
              <a
                href="tel:+447868176940"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <Phone className="h-4 w-4" /> +44 7868 176940
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
