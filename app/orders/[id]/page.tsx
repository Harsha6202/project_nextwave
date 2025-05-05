"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCurrency } from "@/hooks/use-currency"
import Image from "next/image"
import { ArrowLeft, PackageCheck } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    title: string
    description: string
    image: string
  }
}

interface OrderDetails {
  id: string
  total: number
  status: string
  createdAt: string
  shippingAddress?: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
  items: OrderItem[]
}

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { format } = useCurrency()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch order details')
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order details:', error)
        router.push('/orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id, user, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push('/orders')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
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
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm">Quantity: {item.quantity}</p>
                      <p className="font-medium">{format(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{order.status}</span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{format(order.total)}</span>
              </div>
            </div>
          </Card>

          {order.shippingAddress && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address.line1}
                  {order.shippingAddress.address.line2 && (
                    <>
                      <br />
                      {order.shippingAddress.address.line2}
                    </>
                  )}
                  <br />
                  {order.shippingAddress.address.city}, {order.shippingAddress.address.state} {order.shippingAddress.address.postal_code}
                  <br />
                  {order.shippingAddress.address.country}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                <PackageCheck className="h-4 w-4" />
                <span>Order will be delivered to this address</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
