import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api";
import { ShoppingBag, Package, ChevronRight, Loader2, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function OrderHistory() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.list()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
        <p>Loading your vault history…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
          <ShoppingBag className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Order History</h2>
          <p className="text-sm text-muted-foreground">Detailed history of your purchases and sales.</p>
        </div>
      </div>

      {orders?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 mb-4">
            <Package className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No orders yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6">You haven't made any purchases or sales yet.</p>
          <a
            href="/shop/gold"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#162c4a]"
          >
            Browse Collections
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-secondary/10 px-6 py-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date Placed</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order ID</p>
                    <p className="mt-0.5 text-sm font-mono text-foreground/70">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{fmt(order.total)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    order.type === 'Buy' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {order.type === 'Buy' ? <ShoppingBag className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
                    {order.type}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Vaulted' || order.status === 'Delivered' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                    order.status === 'Pending' ? 'bg-gray-100 text-gray-500 border border-gray-200' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                <ul className="divide-y divide-border/40">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gold/80">{item.metal} · {item.weight}</p>
                            <h4 className="text-sm font-semibold text-foreground mt-0.5 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">Quantity: {item.qty} × {fmt(item.price)}</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">{fmt(item.price * item.qty)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Tax Breakdown */}
                <div className="mt-4 pt-4 border-t border-border/40 space-y-1.5">
                  {order.type === 'Buy' ? (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Actual Gold Value</span>
                        <span className="font-medium">{fmt(order.goldValue || (order.total - (order.gst || 0)))}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">GST (3%)</span>
                        <span className="font-medium text-emerald-600">+{fmt(order.gst)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Gold Buyback Price</span>
                        <span className="font-medium">{fmt(order.goldValue || (order.total + (order.taxAmount || 0)))}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Profit Realized</span>
                        <span className="font-medium text-emerald-600">{fmt(order.profit)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Capital Gains Tax ({order.taxType === 'LTCG' ? '12.5% Flat' : 'Income Slab'})</span>
                        <span className="font-medium text-red-500">-{fmt(order.taxAmount)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-border/20">
                    <span>{order.type === 'Buy' ? 'Total Paid' : 'Final Payout'}</span>
                    <span className={order.type === 'Buy' ? 'text-gold' : 'text-emerald-600'}>{fmt(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/5 px-6 py-3 flex items-center justify-between border-t border-border/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  Payment via <span className="font-semibold text-foreground/80">{order.paymentMethod}</span>
                </div>
                <button className="text-xs font-bold text-gold hover:underline underline-offset-4 flex items-center gap-1">
                  Download Invoice <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
