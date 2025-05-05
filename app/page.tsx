import ProductListing from "../components/product-listing"
import { getCurrentUser } from "../lib/auth"
import { prisma } from "../lib/prisma"

// This function runs on the server at request time
export default async function Home() {
  // Get the current user if logged in
  const user = await getCurrentUser()

  // Check if we have products in our database
  const productCount = await prisma.product.count()

  // If no products, fetch from FakeStoreAPI and save to database
  if (productCount === 0) {
    try {
      const response = await fetch("https://fakestoreapi.com/products")
      const products = await response.json()

      // Save products to database
      await prisma.product.createMany({
        data: products.map((product: any) => ({
          id: product.id, // use string id as is
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: {
            rate: product.rating.rate,
            count: product.rating.count
          }
        }))
      })
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // Get all products from database
  const products = await prisma.product.findMany()

  // Get all unique categories
  const categories = ["All Categories", ...new Set(products.map((product: any) => product.category))]

  return (
    <div className="min-h-screen bg-white">
      <ProductListing initialProducts={products} categories={categories} user={user} />
    </div>
  )
}
