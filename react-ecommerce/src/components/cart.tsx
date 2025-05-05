"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useCurrency } from "@/hooks/use-currency"
import AuthModal from "./auth-modal"
import Image from "next/image"
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Cart() {
  const { items = [], removeFromCart, updateQuantity, total = 0, itemCount: cartCount = 0 } = useCart()
  const { format } = useCurrency()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    if (!items.length) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed.",
      })

      setIsOpen(false)
      router.push('/orders/' + data.order.id)
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-medium text-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <div className="flex-1 overflow-y-auto py-6">
            <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
            {items.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">{format(item.product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-base font-medium mb-4">
              <span>Total</span>
              <span>{format(total)}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={items.length === 0 || isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout'
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        mode="login"
        setMode={() => {}}
      />
    </>
  )
}
