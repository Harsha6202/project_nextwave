import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Update cart item quantity
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { quantity } = await request.json()

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Check if cart item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        AND: [
          { id: params.id },
          {
            cart: {
              userId: user.id
            }
          }
        ]
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: params.id,
      },
      data: {
        quantity: Number(quantity),
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json({ cartItem: updatedCartItem })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if cart item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        AND: [
          { id: params.id },
          {
            cart: {
              userId: user.id
            }
          }
        ]
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
