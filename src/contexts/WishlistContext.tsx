"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlistIds: number[];
  isLoaded: boolean;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isLoaded: false,
  toggleWishlist: () => {},
  isWishlisted: () => false,
});

const STORAGE_KEY = "aj24_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { member, isLoading: authLoading } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load wishlist - wait for auth to finish first
  useEffect(() => {
    if (authLoading) return;
    if (member) {
      fetch("/api/member/wishlist")
        .then((r) => (r.ok ? r.json() : []))
        .then((data: { product_id: number }[]) => {
          setWishlistIds(data.map((w) => w.product_id));
          setMounted(true);
        })
        .catch(() => setMounted(true));
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setWishlistIds(JSON.parse(saved));
      } catch {}
      setMounted(true);
    }
  }, [member, authLoading]);

  // Save to localStorage if not logged in
  useEffect(() => {
    if (mounted && !member) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, mounted, member]);

  const toggleWishlist = useCallback((productId: number) => {
    const isCurrently = wishlistIds.includes(productId);

    if (member) {
      if (isCurrently) {
        fetch(`/api/member/wishlist?productId=${productId}`, { method: "DELETE" });
      } else {
        fetch("/api/member/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    }

    setWishlistIds((prev) =>
      isCurrently ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, [wishlistIds, member]);

  const isWishlisted = useCallback((productId: number) => wishlistIds.includes(productId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, isLoaded: mounted, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
