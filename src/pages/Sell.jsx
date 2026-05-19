import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, ShoppingCart, Info, Tag, Loader2, DollarSign } from "lucide-react";
import { METALS } from "@/features/products/data/products";
import { productApi, orderApi } from "@/lib/api";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { calculateSellBreakdown } from "@/lib/taxUtils";
import { useLiveRates } from "@/hooks/useLiveRates";

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



function ProductCard({ p, getLiveProductPrices }) {
  const { addSellItem } = useCart();
  const [qty, setQty] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const livePrices = getLiveProductPrices(p);
  console.log(livePrices)
  const currentPriceToUse = livePrices.currentPrice;
  const priceSellToUse = livePrices.priceSell;

  const isOutOfStockForSell = p.availableToSell <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (isOutOfStockForSell) return;
    addSellItem({ ...p, id: p._id || p.id, price: priceSellToUse, buyPrice: p.buyPrice || p.price, qty });
    setAdded(true);
    setTimeout(() => { setAdded(false); setQty(1); }, 1800);
  };

  return (
    <div
      className={`relative bg-white border rounded-xl flex flex-col overflow-hidden transition-all duration-300 group ${isOutOfStockForSell ? "opacity-75 border-gray-100" : "border-gray-200 hover:shadow-xl hover:border-gray-300"
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative block overflow-hidden shrink-0">
        <div className={`h-56 flex items-center justify-center p-6 transition-colors duration-300 ${isOutOfStockForSell ? "bg-gray-100/50 grayscale-[0.5]" : "bg-gray-50 group-hover:bg-gray-100"
          }`}>
          <img
            src={p.image}
            alt={p.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>
        {p.isSellPending && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-lg ring-2 ring-white">
              <Loader2 className="h-3 w-3 animate-spin" /> SELL PENDING
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 pb-5 pt-4 gap-2.5">
        <h3 className="text-gray-900 font-semibold text-[15px] leading-snug line-clamp-2">
          {p.name}
        </h3>

        <div className="flex items-center justify-between">

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              In Vault: {p.totalOwned}
            </span>
            {p.availableToSell < p.totalOwned && (
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-tight">
                {p.availableToSell} Available
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Return Comparison Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Avg Buy Price:</span>
            <span className="font-bold text-slate-800">{fmt(p.buyPrice || p.price)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Current Price:</span>
            <span className="font-bold text-slate-800">{fmt(currentPriceToUse)}</span>
          </div>

          {/* Profit / Loss Indicator */}
          {(() => {
            const buyVal = p.buyPrice || p.price;
            const currentVal = currentPriceToUse;
            const diff = currentVal - buyVal;
            const pct = buyVal > 0 ? (diff / buyVal) * 100 : 0;
            const isProfit = diff >= 0;
            return (
              <div className="flex justify-between items-center text-xs border-t border-slate-200/80 pt-1.5 mt-1.5">
                <span className="text-gray-500 font-medium">Net Return (Market):</span>
                <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${isProfit ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                  {isProfit ? "+" : ""}{fmt(diff)} ({isProfit ? "+" : ""}{pct.toFixed(1)}%)
                </span>
              </div>
            );
          })()}
        </div>

        {/* Tax Preview */}
        {p.purchasedAt && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex justify-between text-[11px] items-center">
              <span className="text-gray-500 font-medium">Tax Treatment:</span>
              <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${(new Date() - new Date(p.purchasedAt)) / (1000 * 60 * 60 * 24 * 30.44) >= 24
                ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                {(new Date() - new Date(p.purchasedAt)) / (1000 * 60 * 60 * 24 * 30.44) >= 24 ? "LTCG (12.5%)" : "STCG (Slab)"}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-stretch gap-2 mt-auto pt-1">
          <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={isOutOfStockForSell}
              className="w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors text-lg font-medium"
            >
              −
            </button>
            <span className={`w-9 flex items-center justify-center text-sm font-semibold border-x border-gray-300 bg-white ${isOutOfStockForSell ? "text-gray-400" : "text-gray-800"}`}>
              {isOutOfStockForSell ? 0 : qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(p.availableToSell, q + 1))}
              disabled={isOutOfStockForSell || qty >= p.availableToSell}
              className="w-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={isOutOfStockForSell || added}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg text-sm font-bold py-2.5 transition-all duration-200 ${isOutOfStockForSell
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
              }`}
          >
            {added ? (
              "Added!"
            ) : p.isSellPending ? (
              "Request Pending"
            ) : p.totalOwned === 0 ? (
              "0 in Vault"
            ) : isOutOfStockForSell ? (
              "Unavailable"
            ) : (
              <><DollarSign className="h-4 w-4 border shadow-md" /> Sell to Polyus</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canSell, setCanSell] = useState(null);

  const { getLiveProductPrices } = useLiveRates();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login?redirect=/sell");
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Fetch only owned products for selling
    orderApi.ownedProducts()
      .then((data) => {
        if (!cancelled) {
          setAllProducts(Array.isArray(data) ? data : []);
          setCanSell(data.length > 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAllProducts([]);
          setCanSell(false);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user, authLoading, navigate]);

  if (authLoading) return null;
  if (!user) return null;

  const products = allProducts;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <main className="w-full">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Online Store
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">Sell to Polyus</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Sell Your Vaulted Assets
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} found in your vault`}
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
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.map((p) => (
                <ProductCard key={p._id || p.id} p={p} getLiveProductPrices={getLiveProductPrices} />
              ))}
            </div>
          ) : canSell === false ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                <Tag className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">No items to sell</h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
                You haven't purchased any items yet. You can only sell products that you have previously bought from Polyus Vault and are currently in your vault.
              </p>

              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {METALS.map((m) => (
                    <Link
                      key={m.key}
                      to={`/shop/${m.key.toLowerCase()}`}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gold/50 hover:shadow-lg"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-gold/10 group-hover:text-gold">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Buy {m.label}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{m.tagline}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-[#1e3a5f] group-hover:text-gold">
                        Visit Store <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <Link
                  to="/shop/gold"
                  className="rounded-full bg-[#1e3a5f] text-white text-sm font-bold px-10 py-3.5 hover:bg-[#162c4a] transition-all shadow-md active:scale-95"
                >
                  Browse All Products
                </Link>
                <Link
                  to="/live-charts"
                  className="rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-bold px-10 py-3.5 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Check Market Prices
                </Link>
              </div>
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
  );
}
