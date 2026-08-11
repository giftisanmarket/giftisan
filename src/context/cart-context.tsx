"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';
import toast from 'react-hot-toast';

interface CartItem extends Product {
  quantity: number;
  personalization?: string;
  customImage?: string;
  variantId?: string | null;
  variantName?: string | null;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, personalization?: string, skipOpen?: boolean, customImage?: string) => void;
  removeFromCart: (productId: string, personalization?: string, variantId?: string | null, customImage?: string) => void;
  updateQuantity: (productId: string, quantity: number, personalization?: string, variantId?: string | null, customImage?: string) => void;
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('giftisan-cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage ONLY AFTER initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('giftisan-cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: any, personalization?: string, skipOpen = false, customImage?: string) => {
    const itemCustomImage = customImage || product.customImage;
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;

    if (maxStock <= 0) {
      toast.error(
        typeof window !== 'undefined' && (document.dir === 'rtl' || document.documentElement.lang === 'ar')
          ? "عذراً، هذا المنتج غير متوفر حالياً بالمخزون."
          : "Sorry, this treasure is out of stock.",
        { id: "cart-stock-limit", style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' } }
      );
      return;
    }

    const existingItem = cart.find(
      (item) => 
        item.id === product.id && 
        item.personalization === personalization && 
        item.variantId === product.variantId &&
        item.customImage === itemCustomImage
    );

    if (existingItem && existingItem.quantity >= maxStock) {
      toast.error(
        typeof window !== 'undefined' && (document.dir === 'rtl' || document.documentElement.lang === 'ar')
          ? `وصلت للحد الأقصى للمخزون المتاح (${maxStock})`
          : `Maximum available stock reached (${maxStock})`,
        { id: "cart-stock-limit", style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' } }
      );
      if (!skipOpen) setIsCartOpen(true);
      return;
    }

    setCart((prevCart) => {
      const itemInPrev = prevCart.find(
        (item) => 
          item.id === product.id && 
          item.personalization === personalization && 
          item.variantId === product.variantId &&
          item.customImage === itemCustomImage
      );
      if (itemInPrev) {
        return prevCart.map((item) =>
          item.id === product.id && 
          item.personalization === personalization && 
          item.variantId === product.variantId &&
          item.customImage === itemCustomImage
            ? { ...item, quantity: Math.min(maxStock, item.quantity + 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: Math.min(1, maxStock), personalization, customImage: itemCustomImage }];
    });
    if (!skipOpen) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, personalization?: string, variantId?: string | null, customImage?: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(
      item.id === productId && 
      item.personalization === personalization && 
      item.variantId === variantId &&
      item.customImage === customImage
    )));
  };

  const updateQuantity = (productId: string, quantity: number, personalization?: string, variantId?: string | null, customImage?: string) => {
    if (quantity < 1) return;

    const targetItem = cart.find(
      (item) =>
        item.id === productId && 
        item.personalization === personalization && 
        item.variantId === variantId &&
        item.customImage === customImage
    );

    if (targetItem) {
      const maxStock = typeof targetItem.stock === 'number' ? targetItem.stock : 999;
      if (quantity > maxStock) {
        toast.error(
          typeof window !== 'undefined' && (document.dir === 'rtl' || document.documentElement.lang === 'ar')
            ? `الحد الأقصى للمخزون المتاح هو ${maxStock}`
            : `Maximum available stock reached (${maxStock})`,
          { id: "cart-stock-limit", style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' } }
        );
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.id === productId && 
          item.personalization === personalization && 
          item.variantId === variantId &&
          item.customImage === customImage
        ) {
          const maxStock = typeof item.stock === 'number' ? item.stock : 999;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
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
