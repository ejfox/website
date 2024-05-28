<template>
  <div>
    Checkout, baby!

    <div ref="checkoutContainer" class="container mx-auto px-4 py-8 min-h-screen">
      here
    </div>
  </div>
</template>

<script setup>
const stripe = await useClientStripe();


const checkoutContainer = ref(null);

// import { onMounted } from 'vue';

onMounted(() => {
  // mount a stripe checkout session
  stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,

      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  }).then((session) => {
    console.log(session);
  });
})


</script>

<style scoped></style>