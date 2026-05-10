import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    // Register user in admin registry for balance management
    try {
      const registry = JSON.parse(localStorage.getItem("admin_user_registry") || "[]");
      const exists = registry.some((u) => u._id === userData._id);
      if (!exists) {
        registry.push({
          _id: userData._id,
          email: userData.personalInfo?.email || userData.email || "",
          firstName: userData.personalInfo?.firstName || "",
          lastName: userData.personalInfo?.lastName || "",
          mobile: userData.personalInfo?.mobile || "",
          role: userData.personalInfo?.role || "",
          status: userData.personalInfo?.status || "",
        });
        localStorage.setItem("admin_user_registry", JSON.stringify(registry));
      }
    } catch {}
  };

  const updateUser = (userData) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
