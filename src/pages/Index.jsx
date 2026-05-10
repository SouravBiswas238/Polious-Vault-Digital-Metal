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

    script.onload = () => {
      // 1. Get info from LocalStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (userData?.personalInfo?.email) {
        window.ssq = window.ssq || [];
        // 2. Pass info to SaleSmartly with correct mapping
        window.ssq.push('setCustomer', {
          user_id: userData._id || userData.personalInfo.email,
          name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`.trim() || 'Guest User',
          email: userData.personalInfo.email,
          phone: userData.personalInfo.phoneNumber || '',
          description: "Logged in via Main Dashboard"
        });
      }
    };

    return () => {
      // Check if script exists before trying to remove it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
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
