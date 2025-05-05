import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const productData = [
  {
    title: "Black Roll-Top Backpack",
    price: 89.99,
    description: "Stylish and durable roll-top backpack in black, perfect for daily use",
    category: "Bags",
    image: "/images/backpack-black.jpg",
    status: "NEW PRODUCT"
  },
  {
    title: "Yellow Dinosaur Plush",
    price: 29.99,
    description: "Adorable yellow dinosaur plush toy with blue spikes",
    category: "Toys",
    image: "/images/dino-yellow.jpg",
    rating: { rate: 4.8, count: 120 }
  },
  {
    title: "Leather Key Holder",
    price: 19.99,
    description: "Genuine leather key holder in tan color",
    category: "Accessories",
    image: "/images/key-holder-tan.jpg"
  },
  {
    title: "White Baseball Cap",
    price: 24.99,
    description: "Classic white baseball cap with adjustable strap",
    category: "Accessories",
    image: "/images/cap-white.jpg",
    status: "OUT OF STOCK"
  },
  {
    title: "Grey Denim Backpack",
    price: 79.99,
    description: "Modern denim backpack in grey, perfect for urban lifestyle",
    category: "Bags",
    image: "/images/backpack-grey.jpg"
  },
  {
    title: "Blue Dinosaur Plush",
    price: 29.99,
    description: "Cute blue dinosaur plush toy with yellow details",
    category: "Toys",
    image: "/images/dino-blue.jpg"
  },
  {
    title: "Brown Belt",
    price: 34.99,
    description: "Classic brown leather belt with silver buckle",
    category: "Accessories",
    image: "/images/belt-brown.jpg"
  },
  {
    title: "Grey Denim Jeans",
    price: 59.99,
    description: "Modern grey denim jeans with slim fit",
    category: "Clothing",
    image: "/images/jeans-grey.jpg"
  },
  {
    title: "Striped Pouch",
    price: 14.99,
    description: "Black and white striped canvas pouch",
    category: "Accessories",
    image: "/images/pouch-striped.jpg"
  },
  {
    title: "Blue Pattern Pouch",
    price: 14.99,
    description: "Blue patterned canvas pouch with zipper",
    category: "Accessories",
    image: "/images/pouch-blue.jpg"
  },
  {
    title: "Tan Crossbody Bag",
    price: 49.99,
    description: "Tan leather crossbody bag with textured finish",
    category: "Bags",
    image: "/images/bag-tan.jpg"
  }
]

export async function POST() {
  try {
    // Clear existing products
    await prisma.product.deleteMany({})

    // Insert new products
    await prisma.product.createMany({
      data: productData.map((product, index) => ({
        id: (index + 1).toString(), // Convert to string for MongoDB
        ...product,
        rating: product.rating || { rate: 0, count: 0 }
      }))
    })

    return NextResponse.json({ message: "Products updated successfully" })
  } catch (error) {
    console.error("Error updating products:", error)
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 })
  }
}