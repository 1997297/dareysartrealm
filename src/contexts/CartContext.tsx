'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Artwork } from '@/types/artwork';
import { CartItem } from '@/types/commerce';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
  isCartOpen: boolean;
  isMounted: boolean;
  addArtwork: (artwork: Artwork) => { success: boolean; message?: string };
  removeArtwork: (artworkId: string) => void;
  clearCart: () => void;
  isInCart: (artworkId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  validateCartAvailability: () => { valid: boolean; removedTitles: string[] };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    const stored = safeLocalStorage.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
    setItems(stored);
  }, []);

  // Sync to localStorage whenever items change
  const saveCart = useCallback((updatedItems: CartItem[]) => {
    setItems(updatedItems);
    safeLocalStorage.setItem(STORAGE_KEYS.CART, updatedItems);
  }, []);

  const isInCart = useCallback(
    (artworkId: string): boolean => {
      return items.some(
        (item) => item.artwork.id === artworkId || item.artwork.slug === artworkId
      );
    },
    [items]
  );

  const addArtwork = useCallback(
    (artwork: Artwork): { success: boolean; message?: string } => {
      // 1. Check locally collected status
      const locallyCollected = safeLocalStorage.getItem<string[]>(
        STORAGE_KEYS.LOCALLY_COLLECTED,
        []
      );
      if (locallyCollected.includes(artwork.slug) || artwork.status === 'sold') {
        return {
          success: false,
          message: 'This original artwork has already been acquired.',
        };
      }

      // 2. Check general availability
      if (artwork.status !== 'available') {
        return {
          success: false,
          message: `This artwork is currently ${artwork.status} and cannot enter acquisition.`,
        };
      }

      // 3. Check duplicate (Original artwork quantity is strictly 1)
      if (isInCart(artwork.id) || isInCart(artwork.slug)) {
        setIsCartOpen(true);
        return {
          success: false,
          message: 'This original piece is already in your selection.',
        };
      }

      // 4. Add to selection
      const newItem: CartItem = {
        artwork,
        addedAt: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      saveCart(updated);
      setIsCartOpen(true);
      return { success: true };
    },
    [items, isInCart, saveCart]
  );

  const removeArtwork = useCallback(
    (artworkId: string) => {
      const updated = items.filter(
        (item) => item.artwork.id !== artworkId && item.artwork.slug !== artworkId
      );
      saveCart(updated);
    },
    [items, saveCart]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const validateCartAvailability = useCallback((): {
    valid: boolean;
    removedTitles: string[];
  } => {
    const locallyCollected = safeLocalStorage.getItem<string[]>(
      STORAGE_KEYS.LOCALLY_COLLECTED,
      []
    );
    const validItems: CartItem[] = [];
    const removedTitles: string[] = [];

    items.forEach((item) => {
      if (
        locallyCollected.includes(item.artwork.slug) ||
        item.artwork.status !== 'available'
      ) {
        removedTitles.push(item.artwork.title);
      } else {
        validItems.push(item);
      }
    });

    if (removedTitles.length > 0) {
      saveCart(validItems);
      return { valid: false, removedTitles };
    }
    return { valid: true, removedTitles: [] };
  }, [items, saveCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + (item.artwork.price || 0),
    0
  );
  const currency = items[0]?.artwork.currency || 'USD';

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        subtotal,
        currency,
        isCartOpen,
        isMounted,
        addArtwork,
        removeArtwork,
        clearCart,
        isInCart,
        openCart,
        closeCart,
        setIsCartOpen,
        validateCartAvailability,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
