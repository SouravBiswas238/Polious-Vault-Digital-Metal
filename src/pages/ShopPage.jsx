import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, ShoppingCart, Info, Tag, Loader2 } from "lucide-react";
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

function GreatDealBadge() {
  return (
    <div className="absolute top-0 left-0 overflow-hidden w-22 h-22 z-10 pointer-events-none">
      <div className="absolute top-5.5 -left-6.5 w-27.5 bg-blue-600 text-white text-[10px] font-bold tracking-wide text-center py-1.5 -rotate-45 shadow-md">
        Great Deal
      </div>
    </div>
  );
}

function ProductCard({ p }) {
  const { addBuyItem } = useCart();
  const [qty, setQty] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    for (let i = 0; i < qty; i++) addBuyItem({ ...p, id: p._id || p.id });
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
        {p.isGreatDeal && <GreatDealBadge />}
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
        {/* Product name */}
        <Link
          to={`/product/${p._id || p.id}`}
          className="text-gray-900 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-[#1e3a5f] transition-colors"
        >
          {p.name}
        </Link>

        {/* Stars + review count */}
        <div className="flex items-center gap-2">
          <Stars rating={p.rating} />
          <a
            href={`/product/${p._id || p.id}#reviews`}
            className="text-blue-600 text-xs font-medium hover:underline underline-offset-2"
          >
            {p.reviewCount} Reviews
          </a>
        </div>

        {/* Price section */}
        <div className="mt-0.5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
            As Low As
          </p>
          <div className="flex items-baseline gap-2.5">
            <p className="text-[22px] font-bold text-gray-900 leading-none">
              {fmt(p.priceWireCheck)}
            </p>
            {p.isGreatDeal && p.originalPrice && (
              <p className="text-sm text-red-500 line-through font-medium">
                {fmt(p.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Qty + Add to Cart (default, no hover) */}
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
            disabled={!p.inStock}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold py-2.5 hover:bg-[#162c4a] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {p.inStock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Hover overlay — slides up from bottom over the card body */}
      <div
        className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 flex flex-col px-3 pt-2 pb-3 transition-transform duration-300 ease-out shadow-lg"
        style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Pricing table */}
        <table className="w-full mb-2" style={{ fontSize: 10 }}>
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th className="py-1 px-1.5 text-left font-semibold">Qty</th>
              <th className="py-1 px-1.5 text-right font-semibold">Wire/Check</th>
              <th className="py-1 px-1.5 text-right font-semibold leading-tight">Credit Card/<br/>Paypal</th>
              <th className="py-1 px-1.5 text-right font-semibold">Bitcoin</th>
            </tr>
          </thead>
          <tbody>
            {p.pricingTiers.map((tier, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-1 px-1.5 font-semibold text-gray-800">{tier.qty}</td>
                <td className="py-1 px-1.5 text-right text-gray-800 tabular-nums">
                  {typeof tier.wireCheck === "number" ? fmt(tier.wireCheck) : tier.wireCheck}
                </td>
                <td className="py-1 px-1.5 text-right text-gray-800 tabular-nums">
                  {typeof tier.creditCard === "number" ? fmt(tier.creditCard) : tier.creditCard}
                </td>
                <td className="py-1 px-1.5 text-right text-gray-800 tabular-nums">
                  {typeof tier.bitcoin === "number" ? fmt(tier.bitcoin) : tier.bitcoin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Qty + Add to Cart */}
        <div className="flex items-stretch gap-1.5">
          <div className="flex items-stretch border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-medium"
            >
              −
            </button>
            <span className="w-7 flex items-center justify-center text-xs font-semibold text-gray-800 border-x border-gray-300 bg-white">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!p.inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-white text-xs font-semibold py-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              added ? "bg-emerald-600" : "bg-[#1e3a5f] hover:bg-[#162c4a]"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "Added!" : p.inStock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        {/* US only notice */}
        {p.availableInUS && (
          <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
            <Info className="h-3 w-3 shrink-0" />
            Currently Available in the US only.
          </p>
        )}
      </div>
    </div>
  );
}

function Sidebar({ metalKey, activeSub, onSubChange, products }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMetal, setExpandedMetal] = useState(metalKey);
  const [expandedSub, setExpandedSub] = useState(null);

  const sideNavLinks = [
    { label: "All Products", sub: null, icon: null },
    { label: "In Stock Now", sub: "instock", icon: null },
    { label: "Deals", sub: "deals", red: true, icon: Tag },
  ];

  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Sidebar header */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <span className="font-bold text-gray-900 text-base">Buy from Polyus</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${sidebarOpen ? "" : "-rotate-90"}`}
          />
        </button>

        {sidebarOpen && (
          <div className="py-2">
            {/* Quick filter links */}
            {sideNavLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => onSubChange(item.sub)}
                className={`w-full text-left px-5 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors ${
                  activeSub === item.sub
                    ? "bg-blue-50 text-blue-700 border-r-[3px] border-blue-600"
                    : item.red
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0 opacity-70" />}
                {item.label}
              </button>
            ))}

            {/* Divider */}
            <div className="my-2 mx-4 border-t border-gray-100" />

            {/* Metal categories */}
            {METALS.map((m) => (
              <div key={m.key}>
                <button
                  onClick={() =>
                    setExpandedMetal((prev) => (prev === m.key ? null : m.key))
                  }
                  className={`w-full text-left px-5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${
                    m.key === metalKey
                      ? "text-[#1e3a5f] bg-blue-50/60"
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
                  <div className="ml-5 border-l-2 border-blue-100 mb-1">
                    {m.subcategories.map((sub) => (
                      <div key={sub}>
                        <button
                          onClick={() => {
                            if (m.key !== metalKey) {
                              navigate(
                                `/shop/${m.key.toLowerCase()}?sub=${encodeURIComponent(sub)}`
                              );
                            } else {
                              onSubChange(sub);
                              setExpandedSub((prev) => (prev === sub ? null : sub));
                            }
                          }}
                          className={`w-full text-left pl-4 pr-5 py-2 text-sm transition-colors ${
                            activeSub === sub
                              ? "text-blue-700 font-semibold bg-blue-50"
                              : "text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50"
                          }`}
                        >
                          {sub}
                        </button>

                        {/* Leaf product links */}
                        {m.key === metalKey && activeSub === sub && (
                          <div className="ml-4 border-l border-gray-200 mb-1">
                            {(products || []).filter(
                              (p) => p.subcategory === sub
                            ).map((p) => (
                              <Link
                                key={p._id || p.id}
                                to={`/product/${p._id || p.id}`}
                                className="block pl-3 pr-4 py-1.5 text-xs text-gray-500 hover:text-blue-700 hover:bg-gray-50 transition-colors truncate"
                              >
                                {p.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="h-2" />
          </div>
        )}
      </div>
    </aside>
  );
}

export default function ShopPage() {
  const { metal = "gold" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
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
    if (!sub) {
      setSearchParams({});
    } else {
      setSearchParams({ sub });
    }
  };

  let products = allProducts;

  if (activeSub === "instock") {
    products = products.filter((p) => p.inStock);
  } else if (activeSub === "deals") {
    products = products.filter((p) => p.isGreatDeal);
  } else if (activeSub) {
    products = products.filter((p) => p.subcategory === activeSub);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar metalKey={metalKey} activeSub={activeSub} onSubChange={handleSubChange} products={allProducts} />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
              <Link to="/" className="hover:text-blue-700 transition-colors">
                Online Store
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <Link to="/shop/gold" className="hover:text-blue-700 transition-colors">
                Buy from Polyus
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-900 font-medium">{metalKey}</span>
            </nav>

            {/* Page title + controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {metalKey} Coins and Bars
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Currency</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="USD">$ USD</option>
                    <option value="CAD">$ CAD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                </div>
                <Link
                  to="/account/transactions"
                  className="rounded-lg bg-[#2e7d32] text-white text-sm font-bold px-5 py-2 hover:bg-[#245f26] transition-colors shadow-sm"
                >
                  Checkout
                </Link>
              </div>
            </div>

            {/* Mobile sub-category pills */}
            <div className="flex gap-2 flex-wrap mb-5 lg:hidden">
              <button
                onClick={() => handleSubChange(null)}
                className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
                  !activeSub
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              {metalMeta.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubChange(sub)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
                    activeSub === sub
                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-[#1e3a5f]" />
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
                <button
                  onClick={() => handleSubChange(null)}
                  className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
