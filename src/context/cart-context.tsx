"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';

interface CartItem extends Product {
  quantity: number;
  personalization?: string;
  variantId?: string | null;
  variantName?: string | null;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, personalization?: string, skipOpen?: boolean) => void;
  removeFromCart: (productId: string, personalization?: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, personalization?: string, variantId?: string | null) => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('giftisan-cart');
    if (savedCart) {
      Promise.resolve().then(() => {
        setCart(JSON.parse(savedCart));
      });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('giftisan-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, personalization?: string, skipOpen = false) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.personalization === personalization && 
          item.variantId === product.variantId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && 
          item.personalization === personalization && 
          item.variantId === product.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, personalization }];
    });
    if (!skipOpen) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, personalization?: string, variantId?: string | null) => {
    setCart((prevCart) => prevCart.filter((item) => !(
      item.id === productId && 
      item.personalization === personalization && 
      item.variantId === variantId
    )));
  };

  const updateQuantity = (productId: string, quantity: number, personalization?: string, variantId?: string | null) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && 
        item.personalization === personalization && 
        item.variantId === variantId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
