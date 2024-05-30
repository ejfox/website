import { defineEventHandler } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)

  const products = await stripe.products.list({})

  const prices = await Promise.all(
    products.data.map(async (product) => {
      const stripePrices = await stripe.prices.list()

      const stripePrice = stripePrices.data.find((price) => {
        return price.product === product.id
      })

      return {
        ...product,
        price: stripePrice,
      }
    }),
  )

  products.data = prices

  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})
