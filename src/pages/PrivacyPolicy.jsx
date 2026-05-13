import { Link } from "react-router-dom";

const UPDATED = "13 May 2026";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `Polyus Vault Ltd ("Polyus Vault", "we", "us", or "our") is committed to protecting your privacy and Personal Information. This Privacy Policy explains how we collect, use, disclose, and protect the information of customers, visitors, and users ("you") of our website, mobile applications, and associated services (collectively, the "Platform").

If you have any questions, please contact us at privacy@polyusvault.com.`,
  },
  {
    id: "information-collected",
    title: "1. Information We Collect",
    content: `We collect the following categories of personal information depending on which services you use:

Contact Information & Identifiers — name, email address, postal address, phone number, username, and other account log-in information.

Government Identifiers — government-issued identity document numbers (passport, national ID, driving licence), date of birth, and nationality.

Financial Information — bank account details, credit/debit card numbers, source of funds declarations, and transaction history.

Employment & Background Information — occupation and employment history collected for compliance purposes.

Device & Network Information — IP address, browser type, device identifiers, operating system, and browsing interactions with our Platform.

Geolocation Data — approximate location derived from your IP address or, with your consent, precise GPS location from a mobile device.

Biometric Data — photographs submitted for identity verification purposes. Biometric data is permanently deleted once the verification purpose is fulfilled or within 3 years of your last interaction with us, whichever is sooner.

Communications — copies of emails, chat messages, and support interactions for quality assurance and regulatory compliance.`,
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: `We use your Personal Information for the following purposes:

To provide our services — processing transactions, maintaining your account, and fulfilling purchase and sale orders.

Identity verification & fraud prevention — verifying your identity under AML/KYC obligations and detecting fraudulent or illegal activity.

Legal & regulatory compliance — meeting obligations under applicable financial regulations in the UK (FCA), Switzerland (FINMA), Singapore (MAS), and Canada (FINTRAC).

Communications — sending transaction confirmations, account alerts, and service updates. You may not opt out of transactional communications.

Marketing — with your consent, sending promotional communications about our products and services. You may withdraw consent at any time.

Platform improvement — analysing usage patterns to improve the performance, security, and usability of our Platform.

Security — video surveillance at physical premises for security and operational purposes.`,
  },
  {
    id: "legal-basis",
    title: "3. Legal Basis for Processing (UK/EEA)",
    content: `Where applicable data protection law requires a legal basis for processing, we rely on:

Contract — processing necessary to perform our contract with you (e.g., executing transactions).

Legal obligation — processing necessary for compliance with legal or regulatory requirements.

Legitimate interests — processing for fraud prevention, security, and improvement of our services, where these interests are not overridden by your fundamental rights.

Consent — marketing communications, use of non-essential cookies, and biometric verification (where applicable). You may withdraw consent at any time.`,
  },
  {
    id: "disclosures",
    title: "4. Disclosure of Your Information",
    content: `We may share your Personal Information with:

Regulatory authorities — financial regulators, law enforcement agencies, and tax authorities where we are legally required to do so.

Vault operators — our approved vault partners in Zurich, London, Singapore, and Toronto for the purpose of storing your metals.

Service providers — third-party providers of technology, identity verification, fraud detection, analytics, and customer support services acting on our behalf under data processing agreements.

Professional advisors — lawyers, auditors, and financial advisors in connection with our business operations.

Insurers — Lloyd's of London and associated underwriters for the purpose of insuring your holdings.

Corporate transactions — in connection with a merger, acquisition, or sale of assets, subject to the acquirer maintaining equivalent privacy protections.

We do not sell your personal data to third parties. No mobile information will be shared with third parties for marketing or promotional purposes.`,
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking Technologies",
    content: `Our Platform uses cookies and similar tracking technologies. Cookies are small text files stored on your device that help us improve your experience.

Essential Cookies — required for core Platform functionality (authentication, session management, security). These cannot be disabled.

Analytics Cookies — help us understand how visitors interact with the Platform (e.g., Google Analytics). These collect aggregated, anonymised data.

Personalisation Cookies — remember your preferences such as currency selection and language settings.

Marketing Cookies — used to deliver relevant advertisements on third-party platforms.

You can manage non-essential cookies through the Cookie Settings panel. Disabling certain cookies may limit your access to some Platform features.`,
  },
  {
    id: "security",
    title: "6. Security",
    content: `We implement industry-standard technical and organisational measures to protect your Personal Information, including:

— AES-256 encryption at rest and TLS 1.3 in transit
— PCI-DSS compliance for all payment card data
— Role-based access controls limiting data access to authorised personnel only
— Regular penetration testing and security audits
— Two-factor authentication for account access

However, no transmission over the internet can be guaranteed to be completely secure. If you believe your account has been compromised, please contact us immediately at security@polyusvault.com.`,
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: `We retain your Personal Information for as long as your account is active, or as required to comply with legal and regulatory obligations (which may be up to 7 years after the closure of your account under AML regulations).

Transaction records are retained in accordance with applicable financial regulations. After the applicable retention period, your data is securely deleted or anonymised.`,
  },
  {
    id: "rights",
    title: "8. Your Rights",
    content: `Depending on your jurisdiction, you may have the following rights regarding your Personal Information:

Right of Access — request a copy of the Personal Information we hold about you.

Right to Rectification — request correction of inaccurate or incomplete information.

Right to Erasure — request deletion of your information where there is no compelling reason for continued processing.

Right to Restrict Processing — request that we limit how we use your information.

Right to Data Portability — receive your information in a structured, machine-readable format.

Right to Object — object to processing based on legitimate interests or for direct marketing.

Right to Withdraw Consent — where processing is based on consent, withdraw it at any time without affecting prior processing.

To exercise any of these rights, please contact privacy@polyusvault.com. We will respond within 30 days. You may also lodge a complaint with the Information Commissioner's Office (ICO) in the UK.`,
  },
  {
    id: "international",
    title: "9. International Transfers",
    content: `Your Personal Information may be transferred to and processed in countries outside of the United Kingdom or European Economic Area, including the United States, Switzerland, Singapore, and Canada, where our vault partners and service providers operate.

When we transfer data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission or equivalent transfer mechanisms under applicable law.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `Our services are not directed at individuals under the age of 18. We do not knowingly collect Personal Information from minors. If you believe we have inadvertently collected information from a child, please contact us immediately and we will take prompt steps to delete it.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Material changes will be communicated to registered customers by email and will be effective 14 days after notification. We encourage you to review this policy periodically.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `For any privacy-related questions, requests, or concerns:\n\nPolyus Vault Ltd — Data Privacy Team\nEmail: privacy@polyusvault.com\nPhone: +44 7868 176940\nAddress: London, United Kingdom`,
  },
];

function LegalSection({ section }) {
  return (
    <div id={section.id} className="py-8 border-b border-gray-100 last:border-0">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h2>
      <div className="space-y-3">
        {section.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Legal</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-gray-500">Effective date: {UPDATED}</p>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
            Your privacy is important to us. This policy explains what information we collect, why we collect it, and how you can control it.
          </p>
        </div>
      </div>

      {/* Two-column layout: TOC + Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="flex gap-12">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Contents</p>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs text-gray-500 hover:text-amber-600 transition-colors leading-snug"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-gray-900 mb-1">Data requests</p>
                <p className="text-xs text-gray-500 mb-2">Exercise your rights under GDPR or local law.</p>
                <Link to="/contact" className="text-xs font-bold text-amber-700 hover:text-amber-800">
                  Contact Us →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {sections.map((s) => (
              <LegalSection key={s.id} section={s} />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
