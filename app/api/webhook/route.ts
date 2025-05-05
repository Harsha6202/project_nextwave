import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session & {
        shipping_details?: {
          name?: string
          address?: {
            line1?: string
            line2?: string
            city?: string
            state?: string
            postal_code?: string
            country?: string
          }
        }
      }

      try {
        // First create the order with required fields only
        const order = await prisma.order.create({
          data: {
            userId: session.metadata?.userId!,
            total: session.amount_total! / 100,
            status: 'completed',
          },
        })

        // Then update the order with additional fields
        await prisma.order.update({
          where: { id: order.id },
          data: {
            // @ts-ignore - MongoDB field
            paymentIntentId: session.payment_intent as string,
            // @ts-ignore - MongoDB field
            shippingAddress: session.shipping_details || null,
          },
        })

        const items = JSON.parse(session.metadata?.items || '[]')
        await Promise.all(
          items.map((item: any) =>
            prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              },
            })
          )
        )

        return NextResponse.json({ received: true })
      } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
          { error: 'Error creating order' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}