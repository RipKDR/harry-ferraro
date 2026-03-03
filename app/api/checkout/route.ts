import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { ARTWORKS } from '@/lib/artworks'

export async function POST(req: Request) {
  try {
    const { artworkId } = await req.json()
    const art = ARTWORKS.find((a) => a.id === Number(artworkId))

    if (!art) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    if (art.status !== 'available') {
      return NextResponse.json({ error: 'Artwork is not available for purchase' }, { status: 409 })
    }

    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
    }

    const stripe = new Stripe(apiKey, { apiVersion: '2026-02-25.clover' })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: art.title,
              description: `${art.medium} · ${art.dimensions} · ${art.year} · Certificate of authenticity included`,
              images: [`${process.env.NEXT_PUBLIC_SITE_URL}/paintings/${art.filename}`],
            },
            unit_amount: art.price * 100,
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['AU', 'GB', 'US', 'CA', 'NZ', 'DE', 'FR', 'IT', 'ES', 'JP', 'SG'],
      },
      metadata: {
        artworkId: String(art.id),
        artworkTitle: art.title,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery?purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
