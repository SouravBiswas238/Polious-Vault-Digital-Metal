import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/features/cart/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import { useSaleSmartly } from "@/hooks/useSaleSmartly";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Sell from "@/pages/Sell";
import LiveCharts from "@/pages/LiveCharts";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import Account from "@/pages/account/Account";
import Transactions from "@/pages/account/Transactions";
import Profile from "@/pages/account/Profile";
import AddFunds from "@/pages/account/AddFunds";
import Withdraw from "@/pages/account/Withdraw";
import Refer from "@/pages/account/Refer";
import TwoFactorAuth from "@/pages/account/TwoFactorAuth";
import OrderHistory from "@/pages/account/OrderHistory";
import Admin from "@/pages/Admin";
import SkeletonDemo from "@/pages/SkeletonDemo";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import AboutUsPage from "@/pages/AboutUs";
import VaultStorage from "@/pages/VaultStorage";
import ComplianceKYC from "@/pages/ComplianceKYC";
import ContactUs from "@/pages/ContactUs";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";




const queryClient = new QueryClient();

function Layout() {
  const { user } = useAuth();
  useSaleSmartly(user);

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

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved .
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
              <Route path="/shop/:metal" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/skeleton-demo" element={<SkeletonDemo />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/vault-storage" element={<VaultStorage />} />
              <Route path="/compliance" element={<ComplianceKYC />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Account />}>
                  <Route index element={<Navigate to="transactions" replace />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="profile" element={<Profile />} />

                  <Route path="add-funds" element={<AddFunds />} />
                  <Route path="withdraw" element={<Withdraw />} />
                  <Route path="refer" element={<Refer />} />
                  <Route path="two-factor" element={<TwoFactorAuth />} />
                </Route>
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
