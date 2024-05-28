import { defineEventHandler } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  console.info('Stripe instance:', stripe)

  const products = await stripe.products.list({})

  // get prices for each product by taking the product.default_price
  // and looking it up
  // like const price = await stripe.prices.retrieve('price_1MoBy5LkdIwHu7ixZhnattbh');

  const prices = await Promise.all(
    products.data.map(async (product) => {
      const stripePrice = await stripe.prices.retrieve(product.default_price)
      return {
        ...product,
        price: stripePrice,
      }
    }),
  )

  // add the prices to the products
  products.data = prices

  // return the products with prices

  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})
