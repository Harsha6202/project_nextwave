import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import ProductDetails from "@/components/product-details"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.title,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const user = await getCurrentUser()
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!product) {
    notFound()
  }

  // Get related products (same category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  })

  return <ProductDetails 
    product={{
      ...product,
      id: parseInt(product.id), // Convert string ID to number for the component
      rating: product.rating ? {
        rate: product.rating.rate,
        count: product.rating.count
      } : undefined
    }} 
    relatedProducts={relatedProducts.map(p => ({
      ...p,
      id: parseInt(p.id)
    }))}
    user={user} 
  />
}
