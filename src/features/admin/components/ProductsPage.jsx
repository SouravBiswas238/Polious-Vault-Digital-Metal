import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Save, Loader2, AlertTriangle,
  CheckCircle2, Package, Image as ImageIcon, DollarSign, Tag, List,
} from "lucide-react";
import { adminApi, productApi } from "@/lib/api";

const METALS = ["Gold", "Silver", "Platinum", "Palladium", "Rhodium"];

const EMPTY_FORM = {
  name: "",
  metal: "Gold",
  subcategory: "",
  category: "",
  weight: "",
  price: "",
  priceWireCheck: "",
  priceCreditCard: "",
  priceBitcoin: "",
  image: "",
  inStock: true,
  stock: 0,
  rating: 5.0,
  reviewCount: 0,
  isBestseller: false,
  isGreatDeal: false,
  availableInUS: true,
  description: "",
  specifications: {},
  pricingTiers: [{ qty: "1+", wireCheck: "", creditCard: "", bitcoin: "" }],
};

const fmt = (n) =>
  n != null && n !== ""
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n)
    : "—";

const inputCls = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition";
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5";

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-5 w-5 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
        <Icon className="h-3 w-3 text-amber-600" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{children}</p>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
        checked
          ? "bg-amber-50 border-amber-300 text-amber-700"
          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
      }`}
    >
      <span className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked ? "border-amber-500 bg-amber-500" : "border-slate-300"
      }`}>
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white block" />}
      </span>
      {label}
    </button>
  );
}

// ── Product form modal ───────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(
    product
      ? {
        ...product,
        pricingTiers: product.pricingTiers?.length ? product.pricingTiers : EMPTY_FORM.pricingTiers,
        specificationsArray: product.specifications
          ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: v }))
          : [{ key: "", value: "" }]
      }
      : { ...EMPTY_FORM, specificationsArray: [{ key: "", value: "" }] }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleTierChange = (i, key, val) => {
    const tiers = [...form.pricingTiers];
    tiers[i] = { ...tiers[i], [key]: val };
    setForm((f) => ({ ...f, pricingTiers: tiers }));
  };

  const addTier = () =>
    setForm((f) => ({
      ...f,
      pricingTiers: [...f.pricingTiers, { qty: "", wireCheck: "", creditCard: "", bitcoin: "" }],
    }));

  const removeTier = (i) =>
    setForm((f) => ({ ...f, pricingTiers: f.pricingTiers.filter((_, idx) => idx !== i) }));

  const handleSpecChange = (i, key, val) => {
    const specs = [...form.specificationsArray];
    specs[i] = { ...specs[i], [key]: val };
    setForm((f) => ({ ...f, specificationsArray: specs }));
  };

  const addSpec = () =>
    setForm((f) => ({
      ...f,
      specificationsArray: [...f.specificationsArray, { key: "", value: "" }],
    }));

  const removeSpec = (i) =>
    setForm((f) => ({ ...f, specificationsArray: f.specificationsArray.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        priceWireCheck: parseFloat(form.priceWireCheck) || parseFloat(form.price) || 0,
        priceCreditCard: parseFloat(form.priceCreditCard) || 0,
        priceBitcoin: parseFloat(form.priceBitcoin) || 0,
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 0,
        reviewCount: parseInt(form.reviewCount) || 0,
        pricingTiers: form.pricingTiers
          .filter((t) => t.qty)
          .map((t) => ({
            qty: t.qty,
            wireCheck: parseFloat(t.wireCheck) || 0,
            creditCard: parseFloat(t.creditCard) || 0,
            bitcoin: parseFloat(t.bitcoin) || 0,
          })),
        specifications: form.specificationsArray
          .filter((s) => s.key && s.value)
          .reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}),
      };
      if (product?._id) {
        await adminApi.updateProduct(product._id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-4xl bg-slate-50 rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-t-2xl border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">
                {product?._id ? "Edit Product" : "New Product"}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {product?._id ? "Update product details" : "Add a new product to the catalog"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* ── Row 1: Product info + Image ── */}
            <div className="grid grid-cols-3 gap-5">

              {/* Left: Basic Info (spans 2) */}
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <SectionLabel icon={Tag}>Product Info</SectionLabel>

                {/* Name */}
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. 2026 1 oz Gold Maple Leaf"
                    className={inputCls}
                  />
                </div>

                {/* Metal + Category */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Metal *</label>
                    <select
                      value={form.metal}
                      onChange={(e) => set("metal", e.target.value)}
                      className={inputCls}
                    >
                      {METALS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <input
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      placeholder="Bullion Coin"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Subcategory</label>
                    <input
                      value={form.subcategory}
                      onChange={(e) => set("subcategory", e.target.value)}
                      placeholder="Gold Coins"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Weight + Description */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Weight / Purity</label>
                    <input
                      value={form.weight}
                      onChange={(e) => set("weight", e.target.value)}
                      placeholder="1 oz · 99.99%"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Rating (0-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={form.rating}
                        onChange={(e) => set("rating", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Review Count</label>
                      <input
                        type="number"
                        min="0"
                        value={form.reviewCount}
                        onChange={(e) => set("reviewCount", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Enter detailed product description..."
                      rows={4}
                      className={`${inputCls} min-h-[100px] resize-y`}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Image */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <SectionLabel icon={ImageIcon}>Image</SectionLabel>
                <label className={labelCls}>Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className={inputCls}
                />
                <div className="mt-3 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden"
                  style={{ minHeight: 110 }}>
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="preview"
                      className="h-24 w-full object-contain p-2"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 py-4 text-slate-400">
                      <ImageIcon className="h-7 w-7 opacity-40" />
                      <p className="text-[10px]">Preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Row 2: Pricing + Stock + Flags ── */}
            <div className="grid grid-cols-2 gap-5">

              {/* Pricing */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <SectionLabel icon={DollarSign}>Pricing</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Base Price *", key: "price", required: true },
                    { label: "Wire / Check", key: "priceWireCheck" },
                    { label: "Credit Card", key: "priceCreditCard" },
                    { label: "Bitcoin", key: "priceBitcoin" },
                  ].map(({ label, key, required }) => (
                    <div key={key}>
                      <label className={labelCls}>{label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required={required}
                          value={form[key]}
                          onChange={(e) => set(key, e.target.value)}
                          placeholder="0.00"
                          className={`${inputCls} pl-7`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock + Flags */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <SectionLabel icon={Package}>Inventory & Flags</SectionLabel>
                <div className="mb-4">
                  <label className={labelCls}>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "In Stock", key: "inStock" },
                    { label: "Bestseller", key: "isBestseller" },
                    { label: "Great Deal", key: "isGreatDeal" },
                    { label: "US Only", key: "availableInUS" },
                  ].map(({ label, key }) => (
                    <Toggle
                      key={key}
                      label={label}
                      checked={!!form[key]}
                      onChange={(val) => set(key, val)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 3: Pricing Tiers ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel icon={DollarSign}>Quantity Pricing Tiers</SectionLabel>
                <button
                  type="button"
                  onClick={addTier}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Tier
                </button>
              </div>

              {/* Tier header */}
              <div className="grid grid-cols-[90px_1fr_1fr_1fr_32px] gap-2 mb-2 px-1">
                {["Qty Label", "Wire / Check", "Credit Card", "Bitcoin", ""].map((h) => (
                  <p key={h} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</p>
                ))}
              </div>

              <div className="space-y-2">
                {form.pricingTiers.map((tier, i) => (
                  <div key={i} className="grid grid-cols-[90px_1fr_1fr_1fr_32px] gap-2 items-center bg-slate-50 rounded-lg px-1 py-1">
                    <input
                      value={tier.qty}
                      onChange={(e) => handleTierChange(i, "qty", e.target.value)}
                      placeholder="1+"
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {["wireCheck", "creditCard", "bitcoin"].map((k) => (
                      <div key={k} className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-semibold">$</span>
                        <input
                          type="number"
                          value={tier[k]}
                          onChange={(e) => handleTierChange(i, k, e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white border border-slate-200 rounded-lg pl-5 pr-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    ))}
                    {form.pricingTiers.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeTier(i)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <div className="h-7 w-7" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2.5">Qty examples: "1+", "5+", "10+". Shown in the hover pricing table on the storefront.</p>
            </div>

            {/* ── Row 4: Specifications ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel icon={List}>Product Specifications</SectionLabel>
                <button
                  type="button"
                  onClick={addSpec}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Specification
                </button>
              </div>

              <div className="grid grid-cols-[1fr_1fr_32px] gap-2 mb-2 px-1">
                {["Key (Label)", "Value", ""].map((h) => (
                  <p key={h} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</p>
                ))}
              </div>

              <div className="space-y-2">
                {form.specificationsArray.map((spec, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center bg-slate-50 rounded-lg px-1 py-1">
                    <input
                      value={spec.key}
                      onChange={(e) => handleSpecChange(i, "key", e.target.value)}
                      placeholder="e.g. Purity"
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                      placeholder="e.g. .9999 Fine Gold"
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {form.specificationsArray.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <div className="h-7 w-7" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2.5">Examples: Key: "Metal", Value: "Gold". These will be shown in a table on the product details page.</p>
            </div>

          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-b-2xl border-t border-slate-100 shrink-0">
          <p className="text-xs text-slate-400">* Required fields</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="product-form"
              type="submit"
              onClick={(e) => { e.preventDefault(); document.querySelector("form").requestSubmit(); }}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {product?._id ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ product, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await adminApi.deleteProduct(product._id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Failed to delete");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Delete Product</h3>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Delete <strong className="text-slate-800">"{product.name}"</strong>?
        </p>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Products Page ───────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMetal, setFilterMetal] = useState("All");
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed, null = new, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.list();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = () => {
    setModalProduct(undefined);
    showToast(modalProduct?._id ? "Product updated" : "Product created");
    load();
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    showToast("Product deleted");
    load();
  };

  const filtered = filterMetal === "All" ? products : products.filter((p) => p.metal === filterMetal);

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modalProduct !== undefined && (
          <ProductModal
            product={modalProduct}
            onClose={() => setModalProduct(undefined)}
            onSaved={handleSaved}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={() => setModalProduct(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Metal filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["All", ...METALS].map((m) => {
          const count = m === "All" ? products.length : products.filter((p) => p.metal === m).length;
          return (
            <button
              key={m}
              onClick={() => setFilterMetal(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterMetal === m
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {m} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          <button onClick={load} className="ml-auto text-xs font-semibold underline cursor-pointer">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <Package className="h-7 w-7 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No products yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Product" to create your first listing.</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Metal</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-10 w-10 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-[240px]">{p.name}</p>
                          <p className="text-xs text-slate-400 truncate">{p.weight} {p.category && `· ${p.category}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        {p.metal}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums">
                      {fmt(p.price)}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 text-xs font-semibold">
                      {p.stock ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.inStock
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {p.inStock ? "In Stock" : "Sold Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModalProduct(p)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
