import { useEffect } from "react";

export function useSaleSmartly(user) {
  useEffect(() => {
    if (!user?.personalInfo?.email) return;
    window.ssq = window.ssq || [];
    window.ssq.push("setCustomer", {
      user_id: user._id || user.personalInfo.email,
      name: `${user.personalInfo.firstName || ""} ${user.personalInfo.lastName || ""}`.trim() || "Customer",
      email: user.personalInfo.email,
      phone: user.personalInfo.phoneNumber || "",
      description: "Logged in via Polyus Vault",
    });
  }, [user]);
}
