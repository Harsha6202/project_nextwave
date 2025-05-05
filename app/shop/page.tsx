import ProductListing from "../../components/product-listing"
import { getCurrentUser } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

export default async function Shop() {
  const user = await getCurrentUser()
  const products = await prisma.product.findMany()
  const categories = ["All Categories", ...new Set(products.map((product: any) => product.category))]

  return (
    <div className="min-h-screen bg-white">
      <ProductListing initialProducts={products} categories={categories} user={user} />
    </div>
  )
}
