"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useSession } from "next-auth/react";
import { toggleFavoriteAction, getUserFavorites } from "@/lib/actions";

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: any) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount, then sync with DB if logged in
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = localStorage.getItem("giftisan-favorites");
        if (savedFavorites) {
          const parsed = JSON.parse(savedFavorites);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }

        if (session?.user?.id) {
          const dbFavorites = await getUserFavorites(session.user.id);
          const mappedDbFavorites = dbFavorites as any;
          setFavorites(mappedDbFavorites);
          localStorage.setItem("giftisan-favorites", JSON.stringify(mappedDbFavorites));
        }
      } catch (e) {
        console.error("Failed to load favorites", e);
      } finally {
        setIsInitialized(true);
      }
    };

    loadFavorites();
  }, [session?.user?.id]);

  // Save to localStorage whenever favorites change ONLY AFTER initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("giftisan-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const toggleFavorite = async (product: any) => {
    // Optimistic update
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });

    // DB sync if logged in
    if (session?.user?.id) {
      const res = await toggleFavoriteAction(product.id, session.user.id);
      if (res.error) {
        // Rollback on error
        console.error(res.error);
        const savedFavorites = localStorage.getItem("giftisan-favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        totalFavorites: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
