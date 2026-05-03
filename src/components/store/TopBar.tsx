import { ShoppingCart, Tag, UserCircle2 } from "lucide-react";

const items = [
  { icon: ShoppingCart, label: "Buy From Us", desc: "Shop bullion at live prices" },
  { icon: Tag, label: "Sell To Us", desc: "Get an instant buyback quote" },
  { icon: UserCircle2, label: "My Account", desc: "Orders, vault & statements" },
];

export function TopBar() {
  return (
    <div className="border-b border-border/60 bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-stretch px-6 lg:px-12">
        {items.map((it, i) => (
          <a
            key={it.label}
            href="#"
            className={`group flex flex-1 items-center gap-3 py-3 transition-colors hover:text-gold ${
              i > 0 ? "border-l border-background/10 pl-4 md:pl-8" : ""
            } ${i < items.length - 1 ? "pr-4 md:pr-8" : ""}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-background/20 transition-colors group-hover:border-gold/60">
              <it.icon className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide">{it.label}</span>
              <span className="hidden text-[11px] text-background/60 md:inline">
                {it.desc}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
