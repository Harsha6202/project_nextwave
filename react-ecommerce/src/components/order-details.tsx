"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import Cart from "./cart"

interface OrderDetailsProps {
  order: any
  user: any
}

export default function OrderDetails({ order, user }: OrderDetailsProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to orders
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Items in your order</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
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
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        <p className="font-medium mt-1">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Order Summary</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mt-4">
              <div className="bg-gray-50 p-4">
                <h2 className="font-medium">Need Help?</h2>
              </div>
              <div className="p-4">
                <p className="text-sm mb-4">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
