'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  setItems: (items: Product[]) => void
  isInWishlist: (productId: string) => boolean
}

  const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (product) => {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
        
        if (response.ok) {
          set({ items: [...get().items, product] });
        }
      },
      removeItem: async (productId) => {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        
        if (response.ok) {
          set({ items: get().items.filter((item) => item.id !== productId) });
        }
      },
      setItems: (items) => set({ items }),
      isInWishlist: (productId: string) => {
        return get().items.some(item => item && item.id && item.id.toString() === productId);
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

export const useWishlist = () => {
  const store = useWishlistStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Fetch server-side wishlist when user logs in
      fetch('/api/wishlist')
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
          }
          return res.json();
        })
        .then((data) => {
          store.setItems(data.items);
        })
        .catch((error) => {
          console.error('Failed to fetch wishlist:', error);
        });
    }
  }, [session]);

  return store;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlist = useWishlist();

  useEffect(() => {
    if (wishlist.items.length !== 0) {
      wishlist.setItems([]);
    }
  }, [wishlist]);

  return <>{children}</>
}
