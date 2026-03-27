import { useEffect, useState } from "react";

type WishlistItem = {
  id: string | number;
  title?: string;
  href?: string;
  photo?: string;
  [key: string]: any;
};

const STORAGE_KEY = "neapl_wishlist_v1";

function readStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch (e) {
    console.error("Failed to read wishlist from localStorage", e);
    return [];
  }
}

function writeStorage(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to write wishlist to localStorage", e);
  }
}

export default function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(() => readStorage());

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  function isInWishlist(id: string | number) {
    return items.some((it) => it.id === id);
  }

  function toggleWishlist(item: WishlistItem) {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) {
        return prev.filter((it) => it.id !== item.id);
      }
      return [item, ...prev];
    });
  }

  function removeFromWishlist(id: string | number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function clearWishlist() {
    setItems([]);
  }

  return {
    items,
    count: items.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };
}
