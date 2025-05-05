import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json()

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ orderId: order.id, currency: order.currency, amount: order.amount })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
