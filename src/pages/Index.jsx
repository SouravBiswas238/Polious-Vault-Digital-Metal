import { HeroSlider } from "@/features/home/components/HeroSlider";
import { LivePriceTicker } from "@/features/home/components/LivePriceTicker";
import { CategoryCards } from "@/features/products/components/CategoryCards";
import { BestsellerCarousel } from "@/features/products/components/BestsellerCarousel";

export default function Index() {
  return (
    <>
      <HeroSlider />
      <LivePriceTicker />
      <CategoryCards />
      <BestsellerCarousel />
    </>
  );
}
