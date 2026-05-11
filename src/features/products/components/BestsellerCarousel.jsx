import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productApi } from "@/lib/api";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(rating) ? "text-amber-400" : "text-gray-300"}
          style={{ fontSize: 16 }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

const VISIBLE = 4;

export function BestsellerCarousel() {
  const [bestsellers, setBestsellers] = useState([]);
  const [start, setStart] = useState(0);

  useEffect(() => {
    productApi.list()
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setBestsellers(all.filter((p) => p.isBestseller));
      })
      .catch(() => {});
  }, []);

  const maxStart = Math.max(0, bestsellers.length - VISIBLE);
  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(maxStart, s + 1));
  const visible = bestsellers.slice(start, start + VISIBLE);

  if (bestsellers.length === 0) return null;

  return (
    <section className="bg-[#f7f7f7] py-16 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold mb-2">
              Top Picks
            </p>
            <h2 className="font-display text-5xl font-semibold text-gray-900 tracking-tight">
              Bestsellers
            </h2>
          </div>
          <Link
            to="/shop/gold"
            className="hidden sm:flex items-center gap-1.5 text-[#1e3a5f] text-sm font-semibold hover:underline underline-offset-2"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel wrapper */}
        <div className="relative px-8">
          {/* Prev arrow */}
          <button
            onClick={prev}
            disabled={start === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image area */}
                <Link
                  to={`/product/${p._id}`}
                  className="relative block bg-gray-50 overflow-hidden"
                  style={{ height: 220 }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </Link>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <Link
                    to={`/product/${p._id}`}
                    className="text-gray-900 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-[#1e3a5f] transition-colors"
                  >
                    {p.name}
                  </Link>

                  <div className="flex items-center gap-2">
                    <Stars rating={p.rating} />
                    <span className="text-gray-500 text-xs">({p.reviewCount})</span>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-0.5">
                      As Low As
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {fmt(p.priceWireCheck ?? p.price)}
                    </p>
                  </div>

                  <Link
                    to={`/product/${p._id}`}
                    className="mt-auto block w-full text-center rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold py-3.5 hover:bg-[#162c4a] active:scale-[0.98] transition-all duration-200"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}

            {Array.from({ length: VISIBLE - visible.length }).map((_, i) => (
              <div key={`empty-${i}`} className="hidden lg:block" />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            disabled={start >= maxStart}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Dot indicators */}
        {maxStart > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxStart + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStart(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  start === i ? "w-6 bg-[#1e3a5f]" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
