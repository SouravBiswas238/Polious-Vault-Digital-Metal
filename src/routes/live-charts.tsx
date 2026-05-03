import { createFileRoute } from "@tanstack/react-router";
import { MetalChartsView } from "@/features/charts/components/MetalChartsView";

export const Route = createFileRoute("/live-charts")({
  component: LiveChartsPage,
  head: () => ({
    meta: [
      { title: "Live Market Charts — Polyus Vault" },
      {
        name: "description",
        content: "View live market performance for Gold, Silver, Platinum, Palladium, and Rhodium.",
      },
    ],
  }),
});

function LiveChartsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white ">
        {/* Placeholder for future header extension if needed */}
      </div>
      <MetalChartsView />
    </div>
  );
}
