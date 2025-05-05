"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import AuthModal from "./auth-modal"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCurrency } from "@/hooks/use-currency"

interface ProductCardProps {
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
    status?: "NEW PRODUCT" | "OUT OF STOCK"
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { isInWishlist, toggleWishlist } = useWishlist()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { format } = useCurrency()
  const isWishlisted = isInWishlist(product.id.toString())

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    toggleWishlist(product.id.toString())
  }

  const handleAddToCart = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`
    })
  }

  const handleBuyNow = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    addToCart(product)
    router.push('/checkout')
  }

  return (
    <>
      <div className="product-card group">
        <Link href={`/products/${product.id}`} className="block relative">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {product.status && (
              <div className={`product-tag ${
                product.status === "OUT OF STOCK" ? "bg-red-100 text-red-800" : ""
              }`}>
                {product.status}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleWishlistClick}
            >
              <FontAwesomeIcon 
                icon={isWishlisted ? fasHeart : farHeart} 
                className={isWishlisted ? "text-red-500" : ""}
              />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>

          <div className="space-y-1 text-center">
            <h3 className="product-name">
              {product.title}
            </h3>
            {user ? (
              <p className="text-lg font-bold text-gray-900">
                {format(product.price)}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Sign in to see pricing
              </p>
            )}
            <div className="flex gap-2 justify-center mt-3">
              <Button 
                variant="outline" 
                onClick={handleAddToCart}
                disabled={product.status === "OUT OF STOCK"}
              >
                Add to Cart
              </Button>
              <Button 
                variant="default" 
                onClick={handleBuyNow}
                disabled={product.status === "OUT OF STOCK"}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </Link>
      </div>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  )
}
