import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/components/store/CartContext";
import { TopBar } from "@/components/store/TopBar";
import { Navbar } from "@/components/store/Navbar";
import { HeroSlider } from "@/components/store/HeroSlider";
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
        <TopBar />
        <Navbar />
        <main>
          <HeroSlider />
          <ProductGrid />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
