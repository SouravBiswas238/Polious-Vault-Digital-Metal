import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { METALS } from "@/features/products/data/products";

// Metallic gradient + text config per metal
const metalStyle = {
  Gold: {
    gradient: "from-amber-400 via-yellow-300 to-amber-200",
    shadow: "shadow-amber-200/60",
    labelColor: "text-amber-900",
    taglineColor: "text-amber-800/70",
    ctaColor: "text-amber-700",
    border: "border-amber-300/40",
  },
  Silver: {
    gradient: "from-slate-400 via-gray-300 to-slate-200",
    shadow: "shadow-slate-300/60",
    labelColor: "text-slate-800",
    taglineColor: "text-slate-700/70",
    ctaColor: "text-slate-600",
    border: "border-slate-300/40",
  },
  Platinum: {
    gradient: "from-sky-400 via-slate-300 to-blue-200",
    shadow: "shadow-sky-200/60",
    labelColor: "text-sky-900",
    taglineColor: "text-sky-800/70",
    ctaColor: "text-sky-700",
    border: "border-sky-300/40",
  },
  Palladium: {
    gradient: "from-stone-500 via-zinc-300 to-stone-200",
    shadow: "shadow-stone-300/60",
    labelColor: "text-stone-800",
    taglineColor: "text-stone-700/70",
    ctaColor: "text-stone-600",
    border: "border-stone-300/40",
  },
  Rhodium: {
    gradient: "from-zinc-600 via-zinc-400 to-zinc-300",
    shadow: "shadow-zinc-400/60",
    labelColor: "text-zinc-900",
    taglineColor: "text-zinc-800/70",
    ctaColor: "text-zinc-700",
    border: "border-zinc-400/40",
  },
};

export function CategoryCards() {
  return (
    <section className="bg-white py-14 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">
            Shop by Metal
          </p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Browse Our Collection
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {METALS.map((m) => {
            const style = metalStyle[m.key] || metalStyle.Gold;
            return (
              <Link
                key={m.key}
                to={`/shop/${m.key.toLowerCase()}`}
                className={`relative flex flex-col items-center rounded-2xl overflow-hidden border ${style.border} bg-linear-to-b ${style.gradient} shadow-lg ${style.shadow} hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group`}
                style={{ height: 288 }}
              >
                {/* Metal label — top left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`text-sm font-bold ${style.labelColor}`}>
                    {m.label}
                  </span>
                </div>

                {/* Coin / bar image — centered in upper 2/3 */}
                <div className="flex items-center justify-center w-full flex-1 pt-10 pb-4 px-4">
                  <img
                    src={m.image}
                    alt={m.label}
                    className="max-h-36 max-w-full object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1"
                    loading="lazy"
                  />
                </div>

                {/* Bottom info strip */}
                <div className="w-full px-4 pb-4">
                  <p className={`text-[11px] font-medium ${style.taglineColor} leading-snug mb-2`}>
                    {m.tagline}
                  </p>
                  <div className={`flex items-center gap-1 text-[13px] font-bold ${style.ctaColor} group-hover:gap-2 transition-all duration-200`}>
                    <span>Shop Now</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
