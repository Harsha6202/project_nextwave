"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface OrdersPageProps {
  orders: any[]
  user: any
}

export default function OrdersPage({ orders, user }: OrdersPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-500">Order placed</p>
                    <p className="font-medium">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{order.status}</p>
                  </div>
                  <div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Order</Link>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid gap-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 bg-gray-100 rounded">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
