import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ZoomIn, Truck, Phone, Info, ShoppingCart, CheckCircle } from "lucide-react";
import { PRODUCTS } from "@/features/products/data/products";
import { useCart } from "@/features/cart/context/CartContext";

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(n)
    : n;

function Stars({ rating, size = 20 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ fontSize: size, lineHeight: 1 }}
          className={i <= Math.round(rating) ? "text-amber-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

const TABS = ["Description", "Specifications", "Mint", "Reviews", "Storage", "Why Polyus"];

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const product = PRODUCTS.find((p) => p.id === id);
  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image];
  const metalKey = product.metal.toLowerCase();

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-700 transition-colors">Online Store</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <Link to={`/shop/${metalKey}`} className="hover:text-blue-700 transition-colors">
            Buy from Polyus
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <Link to={`/shop/${metalKey}`} className="hover:text-blue-700 transition-colors">
            {product.metal}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

          {/* ── LEFT: Image gallery ── */}
          <div className="lg:w-130 xl:w-140 shrink-0">

            {/* Main image container */}
            <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mb-4 group" style={{ height: 500 }}>
              <img
                src={images[activeThumb]}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-10 transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Zoom icon */}
              <button className="absolute bottom-4 right-4 p-2.5 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all">
                <ZoomIn className="h-4 w-4 text-gray-600" />
              </button>

              {/* Prev / Next overlay buttons */}
              <button
                onClick={() => setActiveThumb((i) => Math.max(0, i - 1))}
                disabled={activeThumb === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={() => setActiveThumb((i) => Math.min(images.length - 1, i + 1))}
                disabled={activeThumb === images.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 transition-all"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveThumb((i) => Math.max(0, i - 1))}
                disabled={activeThumb === 0}
                className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shrink-0"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </button>

              <div className="flex gap-3 flex-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`flex-1 border-2 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 transition-all duration-200 ${
                      activeThumb === i
                        ? "border-[#1e3a5f] shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ height: 88 }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveThumb((i) => Math.min(images.length - 1, i + 1))}
                disabled={activeThumb === images.length - 1}
                className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shrink-0"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product info ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Currency selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-gray-500 font-medium">Select Currency</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40 focus:border-[#1e3a5f]">
                <option value="USD">$ USD</option>
                <option value="CAD">$ CAD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            {/* Product title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Stars + review count */}
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} size={22} />
              <a
                href="#reviews"
                className="text-blue-600 text-sm font-semibold hover:underline underline-offset-2"
              >
                {product.reviewCount} Reviews
              </a>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-100">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                As Low As (Wire/Check)
              </p>
              <p className="text-5xl font-bold text-gray-900 tracking-tight">
                {fmt(product.priceWireCheck)}
              </p>
              {product.isGreatDeal && product.originalPrice && (
                <p className="text-base text-red-500 line-through mt-1 font-medium">
                  Was {fmt(product.originalPrice)}
                </p>
              )}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-stretch gap-3">
              {/* Qty selector */}
              <div className="flex items-stretch border-2 border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 text-gray-600 hover:bg-gray-100 transition-colors text-xl font-medium"
                >
                  −
                </button>
                <div className="flex items-center justify-center px-5 border-x-2 border-gray-300 min-w-18">
                  <span className="text-base font-bold text-gray-800">Qty {qty}</span>
                </div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 text-gray-600 hover:bg-gray-100 transition-colors text-xl font-medium"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl font-bold text-base py-4 transition-all duration-200 shadow-sm ${
                  added
                    ? "bg-green-600 text-white shadow-green-200"
                    : product.inStock
                    ? "bg-[#1e3a5f] text-white hover:bg-[#162c4a] hover:shadow-lg active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {product.inStock ? "Add to cart" : "Sold Out"}
                  </>
                )}
              </button>
            </div>

            {/* Pricing table */}
            {product.pricingTiers?.length > 0 && (
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        Qty
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <span className="text-blue-600 cursor-pointer hover:underline">Wire/Check</span>
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <span className="text-blue-600 cursor-pointer hover:underline">Credit Card/PayPal</span>
                      </th>
                      <th className="text-center px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">
                        <span className="text-blue-600 cursor-pointer hover:underline">Bitcoin</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.pricingTiers.map((tier, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 last:border-0 transition-colors ${
                          i === 0 ? "bg-blue-50/70" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-gray-800">{tier.qty}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-800">
                          {fmt(tier.wireCheck)}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">{fmt(tier.creditCard)}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{fmt(tier.bitcoin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* US only notice */}
            {product.availableInUS && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Info className="h-4 w-4 shrink-0 text-amber-500" />
                Currently Available in the US only.
              </div>
            )}

            {/* Trust boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-4 border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    On bullion orders over $4,999 USD/CAD
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Need Help?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Call us: 1-800-POLYUS-1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "What You Should Know" section */}
        {product.whatYouShouldKnow && (
          <div className="mt-14 rounded-2xl border border-amber-200 bg-amber-50 px-8 py-7 text-center">
            <h3 className="font-bold text-gray-900 text-lg mb-2">What You Should Know</h3>
            <p className="text-gray-600 italic text-base max-w-2xl mx-auto leading-relaxed">
              {product.whatYouShouldKnow}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200 flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab
                    ? "border-[#1e3a5f] text-[#1e3a5f]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8 text-base text-gray-700 leading-relaxed max-w-3xl">
            {activeTab === "Description" && (
              <p>{product.description}</p>
            )}

            {activeTab === "Specifications" && product.specifications && (
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], i) => (
                      <tr
                        key={key}
                        className={`border-b border-gray-100 last:border-0 ${
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-5 py-3.5 font-semibold text-gray-700 w-44">{key}</td>
                        <td className="px-5 py-3.5 text-gray-800">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Mint" && (
              <p>
                This product is minted by{" "}
                <strong className="text-gray-900">
                  {product.specifications?.Mint || "a certified mint"}
                </strong>
                , ensuring the highest standards of quality, purity, and craftsmanship. Each piece
                undergoes rigorous quality control and assay verification before it leaves the mint
                facility.
              </p>
            )}

            {activeTab === "Reviews" && (
              <div id="reviews">
                <div className="flex items-center gap-4 mb-8 p-5 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">
                      {product.rating.toFixed(1)}
                    </p>
                    <Stars rating={product.rating} size={22} />
                    <p className="text-xs text-gray-500 mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 italic text-sm">
                  Customer reviews are being loaded…
                </p>
              </div>
            )}

            {activeTab === "Storage" && (
              <div className="space-y-4">
                <p>
                  Proper storage of precious metals is essential to maintain their condition and
                  value. Store your {product.metal.toLowerCase()} in a cool, dry environment away
                  from direct sunlight and humidity.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Use cotton gloves when handling coins and bars to prevent fingerprints.</li>
                  <li>Keep in original packaging or protective capsules where possible.</li>
                  <li>For larger holdings, consider a professional vault storage solution.</li>
                  <li>Avoid storing near chemicals, cleaning agents, or PVC materials.</li>
                </ul>
              </div>
            )}

            {activeTab === "Why Polyus" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Authenticity Guaranteed", body: "Every product is 100% authentic and verifiable with a certificate of authenticity." },
                  { title: "Competitive Pricing", body: "Our prices are updated in real-time and are among the most competitive in the market." },
                  { title: "Insured Shipping", body: "All orders are fully insured and shipped discreetly in tamper-evident packaging." },
                  { title: "Expert Support", body: "Our precious metals specialists are available to help you make the best investment decisions." },
                ].map(({ title, body }) => (
                  <div key={title} className="border border-gray-200 rounded-2xl p-5 bg-white">
                    <p className="font-bold text-gray-900 mb-1.5">{title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
