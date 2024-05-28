<template>
  <div class="p-4 lg:px-12">
    <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-01.svg" class="mt-4 w-64 h-auto dark:invert" />

    <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-24.svg" class="w-16 md:w-32 h-auto
    absolute
    top-4
    right-4 md:right-8
    dark:invert" />


    <div v-if="!products" class="flex justify-center items-center h-64">
      <UProgress />
    </div>
    <div v-for="product in products" :key="product.id" class="p-2 max-w-screen-md flex flex-col my-8">
      <StripeProduct :product="product" />
    </div>

    <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-26.svg"
      class="w-full p-4 h-auto dark:invert max-w-screen-md  mb-4" />
  </div>
</template>

<script setup>
// need to get a list of all the stripe products with the metadata type = ceramics
// then display them here

// const stripeClient = await useClientStripe();

const products = ref(null);

const { data, error, fetch } = useFetch('/api/stripe-products');

watch(data, () => {
  console.log(data.value.data);
  if (!data.value) return;
  products.value = data.value.data;
  console.log(products.value);
});



// console.log(products);


</script>

<style scoped></style>