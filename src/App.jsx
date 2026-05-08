import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/features/cart/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Sell from "@/pages/Sell";
import LiveCharts from "@/pages/LiveCharts";
import Account from "@/pages/account/Account";
import Transactions from "@/pages/account/Transactions";
import Profile from "@/pages/account/Profile";
import CreditCard from "@/pages/account/CreditCard";
import AddFunds from "@/pages/account/AddFunds";
import Refer from "@/pages/account/Refer";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/live-charts" element={<LiveCharts />} />
              <Route path="/account" element={<Account />}>
                <Route index element={<Navigate to="transactions" replace />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="profile" element={<Profile />} />
                <Route path="credit-card" element={<CreditCard />} />
                <Route path="add-funds" element={<AddFunds />} />
                <Route path="refer" element={<Refer />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
