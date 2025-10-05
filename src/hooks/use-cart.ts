"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { CartItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("thrift-ease-cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("thrift-ease-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === newItem.productId
      );
      if (existingItem) {
        // In a real thrift store, you might not be able to add more than 1 of a unique item.
        // For now, we'll just show a notification.
        toast({
          title: "Item already in cart",
          description: `${newItem.name} is a unique item and is already in your cart.`,
        });
        return prevCart;
      }
      toast({
          title: "Added to cart!",
          description: `"${newItem.name}" is now in your cart.`,
      });
      return [...prevCart, { ...newItem, quantity: 1 }]; // Ensure quantity is 1 for unique items
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    toast({
        title: "Item removed",
        variant: "destructive",
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    // For a thrift store with unique items, this might not be applicable,
    // but we'll include it for completeness.
    if (quantity > 1) {
        toast({
            title: "Unique Item",
            description: "You can only purchase one of each unique item.",
        });
        return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }, [toast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
