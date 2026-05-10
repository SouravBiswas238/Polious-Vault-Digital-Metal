import { useEffect } from "react";
import { HeroSlider } from "@/features/home/components/HeroSlider";
import { LivePriceTicker } from "@/features/home/components/LivePriceTicker";
import { ProductGrid } from "@/features/products/components/ProductGrid";

export default function Index() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://plugin-code.salesmartly.com/js/project_700075_722149_1777793582.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // 1. Get info from LocalStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      console.log(userData.personalInfo?.email)
      if (userData.personalInfo?.email) {
        window.ssq = window.ssq || [];
        // 2. Pass info to SaleSmartly
        window.ssq.push('setCustomer', {
          user_id: userData._id || userData.email, // Unique ID
          name: userData.personalInfo.firstName + " " + userData.personalInfo.lastName || 'Guest User',
          email: userData.email,
          phone: userData.mobile || '',
          description: "Logged in via Main Dashboard"
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <HeroSlider />
      <LivePriceTicker />
      <ProductGrid />
    </>
  );
}
