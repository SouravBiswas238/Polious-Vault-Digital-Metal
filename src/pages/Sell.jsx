import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, ShoppingCart, Info, Tag, Loader2, DollarSign } from "lucide-react";
import { METALS } from "@/features/products/data/products";
import { productApi } from "@/lib/api";
import { useCart } from "@/features/cart/context/CartContext";

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
          style={{ fontSize: 15 }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ProductCard({ p }) {
  const { addSellItem } = useCart();
  const [qty, setQty] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    // For selling, we might use a slightly lower price (simulated here)
    const priceSell = p.priceSell || p.price * 0.98;
    for (let i = 0; i < qty; i++) addSellItem({ ...p, id: p._id || p.id, price: priceSell });
    setAdded(true);
    setTimeout(() => { setAdded(false); setQty(1); }, 1800);
  };

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link to={`/product/${p._id || p.id}`} className="relative block overflow-hidden shrink-0">
        <div className="h-56 flex items-center justify-center p-6 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
          <img
            src={p.image}
            alt={p.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 pb-5 pt-4 gap-2.5">
        <Link
          to={`/product/${p._id || p.id}`}
          className="text-gray-900 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-[#1e3a5f] transition-colors"
        >
          {p.name}
        </Link>

        <div className="flex items-center gap-2">
          <Stars rating={p.rating} />
          <span className="text-gray-400 text-xs font-medium">
            {p.reviewCount} Reviews
          </span>
        </div>

        <div className="mt-0.5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
            We Buy At
          </p>
          <div className="flex items-baseline gap-2.5">
            <p className="text-[22px] font-bold text-emerald-700 leading-none">
              {fmt(p.priceSell || p.price * 0.98)}
            </p>
          </div>
        </div>

        <div className="flex items-stretch gap-2 mt-auto pt-1">
          <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
            >
              −
            </button>
            <span className="w-9 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-300 bg-white">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold py-2.5 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
          >
            <DollarSign className="h-4 w-4" />
            {added ? "Added!" : "Sell to Polyus"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ metalKey, activeSub, onSubChange, products }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMetal, setExpandedMetal] = useState(metalKey);

  const sideNavLinks = [
    { label: "All Products", sub: null, icon: null },
    { label: "High Demand", sub: "high-demand", icon: Tag },
  ];

  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <span className="font-bold text-gray-900 text-base">Sell to Polyus</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${sidebarOpen ? "" : "-rotate-90"}`}
          />
        </button>

        {sidebarOpen && (
          <div className="py-2">
            {sideNavLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => onSubChange(item.sub)}
                className={`w-full text-left px-5 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors ${
                  activeSub === item.sub
                    ? "bg-emerald-50 text-emerald-700 border-r-[3px] border-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0 opacity-70" />}
                {item.label}
              </button>
            ))}

            <div className="my-2 mx-4 border-t border-gray-100" />

            {METALS.map((m) => (
              <div key={m.key}>
                <button
                  onClick={() =>
                    setExpandedMetal((prev) => (prev === m.key ? null : m.key))
                  }
                  className={`w-full text-left px-5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${
                    m.key === metalKey
                      ? "text-emerald-700 bg-emerald-50/60"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{m.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                      expandedMetal === m.key ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {expandedMetal === m.key && (
                  <div className="ml-5 border-l-2 border-emerald-100 mb-1">
                    {m.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          if (m.key !== metalKey) {
                            navigate(
                              `/sell?metal=${m.key.toLowerCase()}&sub=${encodeURIComponent(sub)}`
                            );
                          } else {
                            onSubChange(sub);
                          }
                        }}
                        className={`w-full text-left pl-4 pr-5 py-2 text-sm transition-colors ${
                          activeSub === sub
                            ? "text-emerald-700 font-semibold bg-emerald-50"
                            : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default function SellPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const metal = searchParams.get("metal") || "gold";
  const activeSub = searchParams.get("sub");

  const metalKey = metal.charAt(0).toUpperCase() + metal.slice(1);
  const metalMeta = METALS.find((m) => m.key === metalKey) || METALS[0];

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productApi.list(metalKey)
      .then((data) => { if (!cancelled) setAllProducts(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setAllProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [metalKey]);

  const handleSubChange = (sub) => {
    const params = { metal };
    if (sub) params.sub = sub;
    setSearchParams(params);
  };

  let products = allProducts;
  if (activeSub === "high-demand") {
    products = products.filter((p) => p.inStock); // Mocking high demand as in stock
  } else if (activeSub) {
    products = products.filter((p) => p.subcategory === activeSub);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar metalKey={metalKey} activeSub={activeSub} onSubChange={handleSubChange} products={allProducts} />

          <main className="flex-1 min-w-0">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
              <Link to="/" className="hover:text-emerald-700 transition-colors">
                Online Store
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <Link to="/sell" className="hover:text-emerald-700 transition-colors">
                Sell to Polyus
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-900 font-medium">{metalKey}</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Sell Your {metalKey}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/account/transactions"
                  className="rounded-lg bg-emerald-600 text-white text-sm font-bold px-5 py-2 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  View My Sales
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id || p.id} p={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-xl font-semibold text-gray-800 mb-2">No products found</p>
                <p className="text-sm text-gray-500">Try selecting a different filter or category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
