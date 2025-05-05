'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useCurrency } from '@/hooks/use-currency'

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.79,
  INR: 82.50  // Current approximate exchange rate for 1 USD to INR
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { currency } = useCurrency()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (productId: string, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === productId)
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      const newProduct: CartProduct = { id: productId, title: '', price: 0, image: '' } // Placeholder for product details
      return [...currentItems, { id: productId, quantity, product: newProduct }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const convertPrice = (price: number): number => {
    return price * EXCHANGE_RATES[currency]
  }

  const total = items.reduce(
    (sum, item) => sum + convertPrice(item.product.price) * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
