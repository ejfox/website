// server/api/mark-product-sold.ts
import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const { productId } = await readBody(event)

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Product ID is required' }),
    }
  }

  try {
    const updatedProduct = await stripe.products.update(productId, {
      metadata: { sold: 'true' },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product marked as sold',
        product: updatedProduct,
      }),
    }
  } catch (error) {
    console.error('Error marking product as sold:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to mark product as sold' }),
    }
  }
})
