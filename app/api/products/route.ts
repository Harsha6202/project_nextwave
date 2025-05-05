import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const size = searchParams.get("size")
    const brand = searchParams.get("brand")
    const sort = searchParams.get("sort")
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 12

    // Build filter conditions for MongoDB
    const where: any = {}

    // Full-text search across multiple fields
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category && category !== "All Categories") {
      where.category = category
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }

    // Size filter (if implemented in your schema)
    if (size) {
      where.size = size
    }

    // Brand filter (if implemented in your schema)
    if (brand) {
      where.brand = brand
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'bestselling':
        orderBy = { 'rating.count': 'desc' }
        break
      case 'rating':
        orderBy = { 'rating.rate': 'desc' }
        break
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Fetch products with filters, sorting, and pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    return Response.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
