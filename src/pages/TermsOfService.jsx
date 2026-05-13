import { Link } from "react-router-dom";

const UPDATED = "13 May 2026";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `These Terms and Conditions ("Agreement") govern all transactions and interactions between you ("Customer") and Polyus Vault Ltd ("Polyus Vault", "we", "us", or "our") through our website, mobile applications, and any associated services (collectively, the "Platform"). By creating an account or placing a transaction, you confirm that you have read, understood, and agree to be bound by this Agreement.`,
  },
  {
    id: "definitions",
    title: "1. Definitions",
    content: `"Account" means a customer account maintained with Polyus Vault in the Customer's name for the storage, purchase, or sale of Precious Metals.

"Allocated Storage" means precious metals held physically in the Customer's name in a designated vault location, segregated from other customers' holdings.

"Business Day" means Monday to Friday, 9:00 am to 5:00 pm GMT, excluding public and bank holidays in England and Wales.

"Customer" means any individual or entity that enters into a transaction with Polyus Vault in accordance with this Agreement.

"LBMA" means the London Bullion Market Association, the international trade association for the global OTC gold and silver market.

"Precious Metals" means investment-grade gold, silver, platinum, palladium, and rhodium in bar or coin form meeting LBMA good delivery standards.

"Spot Price" means the current market price of a Precious Metal for immediate settlement.

"Vault" means any approved secure storage facility operated by or on behalf of Polyus Vault in Zurich, London, Singapore, or Toronto.`,
  },
  {
    id: "account-opening",
    title: "2. Account Opening & KYC",
    content: `2.1 To open an account, customers must complete our online registration and provide all required identity and address verification documents in accordance with our KYC/AML obligations.

2.2 Polyus Vault reserves the right to refuse or suspend any account at its sole discretion, including where we are unable to satisfactorily verify your identity or where we have reason to suspect fraudulent or illegal activity.

2.3 Only one account may be opened per customer. Opening multiple accounts without prior written approval may result in account suspension and forfeiture of any pending transactions.

2.4 You are responsible for maintaining the confidentiality of your login credentials. Polyus Vault is not liable for any loss arising from unauthorised access to your account resulting from your failure to keep credentials secure.`,
  },
  {
    id: "transactions",
    title: "3. Transactions",
    content: `3.1 All prices displayed on the Platform are indicative. A transaction is only confirmed at the time you submit an order and receive a written confirmation from Polyus Vault.

3.2 Polyus Vault reserves the right to amend or cancel a confirmed transaction where the quoted price was the result of a manifest error, system fault, or external data feed failure. In such cases, you will be notified promptly and any funds received will be returned in full.

3.3 All purchase transactions must be funded within 2 Business Days of order confirmation. Failure to settle may result in cancellation of the order, and the Customer may be liable for any resulting market loss.

3.4 Sale transactions will be settled within 3 Business Days of receipt and verification of physical metals (where applicable), or within 1 Business Day for allocated storage sales.

3.5 Transaction minimums and maximums are set out in the Schedule of Transaction Limits published on the Platform and may be amended at any time without prior notice.`,
  },
  {
    id: "storage",
    title: "4. Storage & Insurance",
    content: `4.1 All precious metals purchased through Polyus Vault are held on an allocated basis. Your metals are physically segregated, held in your name, and do not form part of Polyus Vault's balance sheet.

4.2 Storage fees are charged monthly in arrears at the rates set out in our published fee schedule. Fees are subject to change with 30 days' written notice.

4.3 All holdings are fully insured through Lloyd's of London for their full market value against theft, loss, and damage while in vault custody.

4.4 Customers may request an independent audit of their holdings at any time by submitting a written request to our compliance team. Audit results will be provided within 10 Business Days.

4.5 Polyus Vault reserves the right to relocate your metals between approved vault locations to manage operational efficiency. You will be notified of any such relocation.`,
  },
  {
    id: "pricing-fees",
    title: "5. Pricing & Fees",
    content: `5.1 All prices are quoted in US Dollars (USD) unless otherwise stated. Currency conversion fees may apply for payments made in other currencies.

5.2 The buy/sell spread applied to each transaction is displayed at the time of order and represents Polyus Vault's entire dealing margin — no hidden fees are applied.

5.3 Storage fees, account administration fees, withdrawal fees, and any other applicable charges are set out in the Fee Schedule on the Platform. These may be updated from time to time with appropriate notice.

5.4 Polyus Vault does not charge commission on transactions. All revenue is generated from the buy/sell spread and storage fees.`,
  },
  {
    id: "withdrawals",
    title: "6. Physical Withdrawal",
    content: `6.1 Customers may request physical delivery of their allocated metals at any time, subject to availability and applicable delivery fees.

6.2 Delivery requests must be submitted in writing. Polyus Vault will use reasonable endeavours to dispatch within 5 Business Days of receiving a verified delivery request and full payment of any applicable fees.

6.3 Polyus Vault is not responsible for customs duties, import taxes, or any costs associated with cross-border delivery. These remain the Customer's sole responsibility.

6.4 Risk of loss passes to the Customer upon handover to the nominated carrier.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: `7.1 Polyus Vault shall not be liable for any loss of profit, loss of business, or indirect or consequential loss arising from or in connection with the use of the Platform or any transaction entered into under this Agreement.

7.2 Nothing in this Agreement limits or excludes liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable law.

7.3 Precious metals are investment assets whose prices fluctuate. Past performance is not indicative of future results. Nothing on the Platform constitutes investment advice. Customers should seek independent financial advice before investing.`,
  },
  {
    id: "governing-law",
    title: "8. Governing Law",
    content: `8.1 This Agreement is governed by and construed in accordance with the laws of England and Wales. Any dispute arising in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of England and Wales.

8.2 If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "changes",
    title: "9. Changes to This Agreement",
    content: `Polyus Vault reserves the right to update these Terms and Conditions at any time. Material changes will be communicated to registered customers by email with at least 14 days' notice before they take effect. Continued use of the Platform after the effective date constitutes acceptance of the revised terms.`,
  },
  {
    id: "contact",
    title: "10. Contact",
    content: `If you have any questions about these Terms and Conditions, please contact us:\n\nPolyus Vault Ltd\nEmail: support@polyusvault.com\nPhone: +44 7868 176940\nRegistered office: London, United Kingdom`,
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

export default function TermsOfService() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">Legal</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
            Terms of <span className="text-gradient-gold">Service</span>
          </h1>
          <p className="mt-4 text-sm text-gray-500">Last updated: {UPDATED}</p>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
            Please read these Terms and Conditions carefully before using the Polyus Vault platform. By creating an account or placing a transaction, you agree to be bound by this Agreement.
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
                <p className="text-xs font-semibold text-gray-900 mb-1">Questions?</p>
                <p className="text-xs text-gray-500 mb-2">Our team is here to help.</p>
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
