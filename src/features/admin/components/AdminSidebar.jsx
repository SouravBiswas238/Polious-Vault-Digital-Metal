import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LogOut, ChevronRight,
  LayoutDashboard, Users, Receipt, Settings, Package, ArrowDownCircle, ShoppingCart
} from "lucide-react";
import { ADMIN_EMAIL } from "../constants";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "users",        label: "Users",         icon: Users           },
  { id: "orders",       label: "Orders",        icon: ShoppingCart    },
  { id: "withdrawals",  label: "Withdrawals",   icon: ArrowDownCircle },
  { id: "products",     label: "Products",      icon: Package         },
  { id: "transactions", label: "Transactions",  icon: Receipt         },
  { id: "settings",     label: "Settings",      icon: Settings        },
];

export default function AdminSidebar({ activePage, onNavigate, isOpen, onClose, onLogout }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Shield className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">Polyus Vault</p>
            <p className="text-xs text-amber-500 font-semibold mt-0.5">Admin Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-amber-50 text-amber-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-amber-500" : "text-slate-400"}`} />
                {label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-amber-400" />}
              </button>
            );
          })}
        </nav>

        {/* User info + sign out */}
        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">{ADMIN_EMAIL}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
