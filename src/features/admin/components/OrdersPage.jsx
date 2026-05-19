import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, ShoppingBag, Package, Truck, CheckCircle2,
  XCircle, Filter, ChevronRight, User, Mail, DollarSign, Tag, Clock
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatUSD } from "../constants";

const STATUS_OPTIONS = ["Pending", "Processing", "Vaulted", "Completed", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    console.log("status")
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer, email, or order ID..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-transparent text-sm focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-secondary disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Order / Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin opacity-20 mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gold font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="font-semibold text-foreground mt-1">{order.userName}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" /> {order.email}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center shrink-0">
                              <img src={item.image} alt="" className="h-4 w-4 object-contain" />
                            </div>
                            <span className="truncate max-w-[150px]">{item.qty}x {item.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{order.items.length - 2} more items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{formatUSD(order.total)}</span>
                        <span className="text-[10px] text-muted-foreground">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        order.type === 'Buy' ? 'bg-gold/10 text-gold' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {order.type === 'Buy' ? <ShoppingBag className="h-3 w-3" /> : <Tag className="h-3 w-3" />}
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Vaulted' || order.status === 'Completed' ? 'bg-blue-50 text-blue-600' : 
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                        order.status === 'Pending' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status === 'Pending' && <Clock className="h-3 w-3" />}
                        {order.status === 'Processing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {(order.status === 'Completed' || order.status === 'Vaulted') && <CheckCircle2 className="h-3 w-3" />}
                        {order.status === 'Cancelled' && <XCircle className="h-3 w-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {updatingId === order._id && <RefreshCw className="h-3 w-3 animate-spin text-gold" />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
