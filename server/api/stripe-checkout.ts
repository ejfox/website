import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const body = await readBody(event)

  const { productId, success_url, cancel_url } = body

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Product ID is required' }),
    }
  }

  if (!success_url || !cancel_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Success and cancel URLs are required' }),
    }
  }

  // Retrieve the product to get its price
  const product = await stripe.products.retrieve(productId)
  if (!product.default_price) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Product does not have a default price' }),
    }
  }

  const price = await stripe.prices.retrieve(product.default_price as string)

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    // success_url: 'https://your-website.com/success',
    // cancel_url: 'https://your-website.com/cancel',
    success_url,
    cancel_url,
  })

  return {
    statusCode: 200,
    body: session,
  }
})
