"use client"

import { useEffect, useState } from "react"
import { useCart } from "lib/cart-context"
import { useCurrency } from "hooks/use-currency"
import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { useAuth } from "lib/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { format, currency } = useCurrency()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
    if (items.length === 0) {
      router.push('/products')
    }
  }, [user, items, router])

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { orderId, currency: orderCurrency, amount } = await response.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: orderCurrency,
        name: "Your Shop Name",
        description: "Test Transaction",
        order_id: orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          })
          clearCart()
          router.push('/checkout/success')
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#3399cc"
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-medium">{format(item.price * (item.quantity || 1))}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{format(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-4">
                <span>Total ({currency})</span>
                <span>{format(total)}</span>
              </div>
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : `Pay ${format(total)}`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
