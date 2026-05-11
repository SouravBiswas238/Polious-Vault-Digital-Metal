import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Receipt, Settings, AlertTriangle, Package } from "lucide-react";
import { adminApi } from "@/lib/api";
import LoginScreen    from "@/features/admin/components/LoginScreen";
import AdminSidebar   from "@/features/admin/components/AdminSidebar";
import DashboardPage  from "@/features/admin/components/DashboardPage";
import UsersPage      from "@/features/admin/components/UsersPage";
import ProductsPage   from "@/features/admin/components/ProductsPage";
import PlaceholderPage from "@/features/admin/components/PlaceholderPage";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  users:        "Users",
  products:     "Products",
  transactions: "Transactions",
  settings:     "Settings",
};

export default function Admin() {
  const [authed, setAuthed]             = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [activePage, setActivePage]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [users, setUsers]               = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loadError, setLoadError]       = useState(null);
  const [opsToday, setOpsToday]         = useState(0);

  const loadUsers = async () => {
    setUsersLoading(true);
    setLoadError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err?.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => { if (authed) loadUsers(); }, [authed]);

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "1");
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdminSidebar
        activePage={activePage}
        onNavigate={(id) => { setActivePage(id); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <Menu className="h-5 w-5 text-slate-500" />
            </button>
            <h1 className="text-base font-bold text-slate-800">{PAGE_TITLES[activePage]}</h1>
          </div>
          <span className="hidden sm:block text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {users.length} users
          </span>
        </header>

        {loadError && (
          <div className="flex items-center gap-2.5 bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span><strong>Could not load users:</strong> {loadError}</span>
            <button onClick={loadUsers} className="ml-auto text-xs font-semibold underline hover:no-underline cursor-pointer">
              Retry
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activePage === "dashboard" && (
                <DashboardPage users={users} opsToday={opsToday} />
              )}
              {activePage === "users" && (
                <UsersPage
                  users={users}
                  usersLoading={usersLoading}
                  loadUsers={loadUsers}
                  onOp={() => setOpsToday((p) => p + 1)}
                />
              )}
              {activePage === "products" && <ProductsPage />}
              {activePage === "transactions" && (
                <PlaceholderPage
                  title="Transactions"
                  description="View all transaction history across accounts."
                  icon={Receipt}
                />
              )}
              {activePage === "settings" && (
                <PlaceholderPage
                  title="Settings"
                  description="Configure system preferences and admin options."
                  icon={Settings}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
