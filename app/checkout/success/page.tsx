"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Check } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart when reaching success page
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">
            Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => router.push('/orders')}
          >
            View Order History
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  )
}