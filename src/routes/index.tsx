import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/components/store/CartContext";
import { Navbar } from "@/components/store/Navbar";
import { Hero } from "@/components/store/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/store/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Polyus Vault — Investment-Grade Gold & Precious Metals" },
      {
        name: "description",
        content:
          "Buy investment-grade gold, silver, and platinum bullion. Insured vaulted storage and live spot pricing trusted by collectors and institutions.",
      },
    ],
  }),
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <ProductGrid />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
