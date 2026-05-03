import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/components/store/CartContext";
import { TopBar } from "@/components/store/TopBar";
import { Navbar } from "@/components/store/Navbar";
import { HeroSlider } from "@/components/store/HeroSlider";
import { ProductGrid } from "@/components/store/ProductGrid";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/store/Footer";
import { useEffect } from "react";

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
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = "https://plugin-code.salesmartly.com/js/project_700075_722149_1777793582.js"; // SaleSmartly script source
    script.async = true;

    // Append to the document body
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);
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
