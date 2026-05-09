import { useEffect } from "react";
import { HeroSlider } from "@/features/home/components/HeroSlider";
import { LivePriceTicker } from "@/features/home/components/LivePriceTicker";
import { CategoryCards } from "@/features/products/components/CategoryCards";
import { BestsellerCarousel } from "@/features/products/components/BestsellerCarousel";

export default function Index() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://plugin-code.salesmartly.com/js/project_700075_722149_1777793582.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <HeroSlider />
      <LivePriceTicker />
      <CategoryCards />
      <BestsellerCarousel />
    </>
  );
}
