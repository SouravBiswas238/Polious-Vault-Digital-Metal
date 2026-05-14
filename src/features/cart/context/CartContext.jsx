import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [buyItems, setBuyItems] = useState([]);
  const [sellItems, setSellItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addBuyItem = (p) => {
    setBuyItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeBuyItem = (id) => setBuyItems((prev) => prev.filter((i) => i.id !== id));

  const updateBuyQty = (id, qty) =>
    setBuyItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)).filter((i) => i.qty > 0),
    );

  const addSellItem = (p) => {
    setSellItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeSellItem = (id) => setSellItems((prev) => prev.filter((i) => i.id !== id));

  const updateSellQty = (id, qty) =>
    setSellItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)).filter((i) => i.qty > 0),
    );

  const value = useMemo(
    () => ({
      buyItems,
      sellItems,
      buyCount: buyItems.reduce((s, i) => s + i.qty, 0),
      sellCount: sellItems.reduce((s, i) => s + i.qty, 0),
      buyTotal: buyItems.reduce((s, i) => s + i.qty * i.price, 0),
      sellTotal: sellItems.reduce((s, i) => s + i.qty * (i.priceSell || i.price), 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addBuyItem,
      removeBuyItem,
      updateBuyQty,
      addSellItem,
      removeSellItem,
      updateSellQty,
      clearBuyCart: () => setBuyItems([]),
      clearSellCart: () => setSellItems([]),
      // Aliases for backward compatibility
      items: buyItems,
      count: buyItems.reduce((s, i) => s + i.qty, 0),
      total: buyItems.reduce((s, i) => s + i.qty * i.price, 0),
      addItem: addBuyItem,
      removeItem: removeBuyItem,
      updateQty: updateBuyQty,
      clearCart: () => setBuyItems([]),
    }),
    [buyItems, sellItems, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
