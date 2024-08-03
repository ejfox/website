<template>
  <div class="rounded-lg">
    <!-- <pre class="max-h-96 overflow-y-auto">{{ product }}</pre> -->
    <div class="product-image-container relative shadow-lg overflow-hidden rounded-lg" v-if="product?.images">
      <!-- get the price SVG and put it on the top right -->
      <img :src="priceSvgPath" alt="Price"
        class="w-16 md:w-24 xl:w-30 h-auto absolute top-4 right-4 md:right-8 z-20 invert" v-if="!productSold" />
      <img v-else src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-14.svg"
        class="w-1/3 h-auto absolute top-4 right-4 md:right-8 z-20 invert" alt="Sold Out" />

      <!-- grayscale if sold -->
      <img :src="product?.images[0]" alt="product image"
        :class="['product-image z-10', productSold ? 'grayscale hover:grayscale-0' : '']" />




    </div>
    <div class="product-actions-container py-4 flex flex-row justify-between">


      <div v-if="!productSold">
        <UButton @click="buyProduct(product.id)" color="green">
          <img :src="`/images/handdrawn_ceramics_text/handdrawn_ceramics_text-11.svg`" alt="Buy"
            class="mx-4 my-1 w-16 h-auto" />
        </UButton>
      </div>
      <div v-else>
        <UButton color="gray" disabled>
          <img :src="`/images/handdrawn_ceramics_text/handdrawn_ceramics_text-14.svg`" alt="Sold Out"
            class="w-16 h-auto dark:invert invert-0" />
        </UButton>
      </div>

      <div v-show="!productSold" class="product-price text-lg py-2
      hidden xl:block
      ">{{ unitAmountToUSD(product.price.unit_amount) }} + shipping</div>
    </div>
    <!-- make more like this button -->
    <!-- <UButton @click="addProductLike" color="green" variant="outline">Make More Like This</UButton> -->
  </div>
  <div class="product-info-container py-2">

    <div class="flex flex-wrap justify-between items-center">
      <!-- <div class="product-name text-3xl py-2">{{ product.name }}</div> -->



      <div class="product-description prose dark:prose-invert my-1 lg:my-2">{{ product.description }}</div>

      <img :src="`/images/handdrawn_ceramics_text/handdrawn_ceramics_text-13.svg`" alt="USA Shipping Only"
        class="h-10 xl:h-12 w-auto my-2 dark:invert inline-block" />




    </div>

  </div>
</template>

<script setup>
const { product } = defineProps(['product']);
const stripe = useClientStripe();


const buyProduct = async (productId) => {
  const { data } = await useFetch('/api/stripe-checkout', {
    method: 'POST',
    body: JSON.stringify({
      productId,

      success_url: 'https://ejfox.com/pottery/success',
      cancel_url: 'https://ejfox.com/pottery',
    }),
  });

  const { id: sessionId, url } = data.value.body;

  navigateTo(url, { external: true });
};

// use the product ID and the stripe client API to find out if the product is sold or not
const productSold = computed(() => {
  return !product?.active
});



// we have hand-drawn SVGs for specific prices
function priceAmountToSvg(priceAmount) {
  console.log(priceAmount);
  // $80 = handdrawn_ceramics_text-18.svg
  // $40 = handdrawn_ceramics_text-25.svg
  // $30 = handdrawn_ceramics_text-22.svg
  // $15 = handdrawn_ceramics_text-19.svg
  // now we need to convert the priceAmount to the correct SVG

  if (priceAmount == 8000) {
    return `/images/handdrawn_ceramics_text/handdrawn_ceramics_text-18.svg`;
  } else if (priceAmount == 4000) {
    return `/images/handdrawn_ceramics_text/handdrawn_ceramics_text-25.svg`;
  } else if (priceAmount == 3000) {
    return `/images/handdrawn_ceramics_text/handdrawn_ceramics_text-22.svg`;
  } else if (priceAmount == 1500) {
    return `/images/handdrawn_ceramics_text/handdrawn_ceramics_text-19.svg`;
  } else {
    return '/images/handdrawn_ceramics_text-10.svg'
  }

}

// make a computed for the correct image
const priceSvgPath = computed(() => {
  return priceAmountToSvg(product.price.unit_amount);
});

// unit amounts from stripe look like
//   "unit_amount": 4000,
//  but we want to display them as $40.00
//  so we need to divide by 100 and then format as currency
function unitAmountToUSD(unitAmount) {
  return (unitAmount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

/*
{
  "product": {
    "id": "prod_Q9ZzUdAjw1ih4S",
    "object": "product",
    "active": true,
    "attributes": [],
    "created": 1716390721,
    "default_price": "price_1PJGphK8xzrKBF9TpYOrIBf3",
    "description": null,
    "images": [
      "https://files.stripe.com/links/MDB8YWNjdF8xRFhjZmdLOHh6cktCRjlUfGZsX3Rlc3RfOE5SUlF6Tll4V3BMcUlpS29HbElVUUoz00nnyBshD2"
    ],
    "livemode": false,
    "marketing_features": [],
    "metadata": {
      "ceramics-type": "cup",
      "type": "ceramics"
    },
    "name": "Test Ceramic 1",
    "package_dimensions": null,
    "shippable": null,
    "statement_descriptor": null,
    "tax_code": null,
    "type": "service",
    "unit_label": null,
    "updated": 1716390987,
    "url": null
  }
}
*/

</script>

<style scoped></style>