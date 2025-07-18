"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  certificate: boolean;
  status: string;
  image: string;
  category: string;
  level: string;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isInCart: (itemId: number) => boolean;
  isBouncing: boolean;
  triggerBounce: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev; // Don't add duplicate
      }
      return [...prev, item];
    });

    // Trigger bounce animation
    triggerBounce();
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0),
    0
  );

  const isInCart = (itemId: number) => {
    return cartItems.some((item) => item.id === itemId);
  };

  const triggerBounce = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    isInCart,
    isBouncing,
    triggerBounce,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
