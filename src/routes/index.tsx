import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/store/HeroSlider";
import { ProductGrid } from "@/components/store/ProductGrid";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Polyus Vault — Investment-Grade Gold & Precious Metals" },
      {
        name: "description",
        content:
          "Buy investment-grade gold, silver, platinum, palladium and rhodium bullion. Insured vaulted storage and live spot pricing.",
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <HeroSlider />
      <ProductGrid />
    </>
  );
}
