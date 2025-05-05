"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/lib/cart-context"
import ProductCard from "./product-card"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "./auth-modal"
import Cart from "./cart"
import Link from "next/link"

interface ProductDetailsProps {
  product: {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating?: {
      rate: number
      count: number
    }
  }
  relatedProducts: any[]
  user: any
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    addToCart(product.id, quantity)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            LOGO
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm hover:text-gray-600">
              HOME
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600 font-medium">
              SHOP
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              ABOUT
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              SERVICES
            </Link>
            <Link href="/" className="text-sm hover:text-gray-600">
              CONTACT US
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Cart />
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <Image
                    src="/placeholder-user.jpg"
                    width={32}
                    height={32}
                    className="rounded-full border"
                    alt="Avatar"
                  />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link href="/orders" className="block px-2 py-1 text-sm hover:bg-gray-100 rounded">
                      My Orders
                    </Link>
                    <Link href="/account" className="block px-2 py-1 text-sm hover:bg-gray-100 rounded">
                      Account Settings
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/" className="hover:text-gray-900">
            Shop
          </Link>{" "}
          /{" "}
          <Link href={`/?category=${product.category}`} className="hover:text-gray-900">
            {product.category}
          </Link>{" "}
          / <span className="text-gray-900">{product.title}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <div className="relative h-80 w-full">
              <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating?.rate || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating?.rate} ({product.rating?.count} reviews)
              </span>
            </div>
            <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm">
                <span className="font-medium">Category:</span> {product.category}
              </p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Product Details</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Category:</span> {product.category}
                    </li>
                    <li>
                      <span className="font-medium">ID:</span> {product.id}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Shipping Information</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Free shipping on orders over $50</li>
                    <li>Delivery in 3-5 business days</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating?.rate || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm ml-2">Based on {product.rating?.count || 0} reviews</span>
                </div>
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" setMode={() => {}} />
    </div>
  )
}
