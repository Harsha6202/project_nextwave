import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ items: [] });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json({
    items: user?.wishlist?.map((item) => item.product) || [],
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await prisma.wishlist.delete({
      where: {
        id: existingItem.id,
      },
    });
    return NextResponse.json({ message: "Item removed from wishlist" });
  }

  await prisma.wishlist.create({
    data: {
      userId: user.id,
      productId,
    },
  });

  return NextResponse.json({ message: "Item added to wishlist" });
}