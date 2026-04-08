import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export type WishlistItem = {
  id: string; // usually listingId_listingType
  listingId: string;
  listingType: string;
  title: string;
  price?: string | number;
  location?: string;
  image?: string;
};

const WISHLIST_KEY = 'nepal_mobile_wishlist';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const data = await AsyncStorage.getItem(WISHLIST_KEY);
      if (data) {
        setItems(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const saveWishlist = async (newItems: WishlistItem[]) => {
    try {
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  };

  const add = async (item: WishlistItem) => {
    const exists = items.some((i) => i.id === item.id);
    if (!exists) {
      await saveWishlist([item, ...items]);
    }
  };

  const remove = async (id: string) => {
    await saveWishlist(items.filter((i) => i.id !== id));
  };

  const toggle = async (item: WishlistItem) => {
    const exists = items.some((i) => i.id === item.id);
    if (exists) {
      await remove(item.id);
    } else {
      await add(item);
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((i) => i.id === id);
  };

  return {
    items,
    isLoading,
    add,
    remove,
    toggle,
    isInWishlist,
    refetch: loadWishlist,
  };
}
