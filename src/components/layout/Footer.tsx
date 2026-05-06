export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gold/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4 lg:px-12">
        <div className="col-span-2">
          <div className="font-display text-2xl">
            <span className="text-gradient-gold">POLYUS</span>
            <span className="text-white/85"> VAULT</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            A trusted dealer of investment-grade precious metals. Insured vaulted
            storage in Zurich, Singapore, and Toronto.
          </p>
        </div>
        {[
          { t: "Shop", l: ["Gold", "Silver", "Platinum", "Coins"] },
          { t: "Company", l: ["About", "Storage", "Compliance", "Contact"] },
        ].map((col) => (
          <div key={col.t}>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">{col.t}</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {col.l.map((i) => (
                <li key={i}>
                  <a href="#" className="transition-colors hover:text-gold">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 lg:px-12">
        © {new Date().getFullYear()} Polyus Vault · All prices in USD
      </div>
    </footer>
  );
}
