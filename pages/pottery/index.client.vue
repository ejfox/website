<template>
  <div class="p-4 lg:px-8">
    <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-24.svg" class="w-8 md:w-12 h-auto
    mx-auto
    absolute
    z-50
    top-2
    right-4
    dark:invert" />

    <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-26.svg"
      class="w-full p-4 h-auto dark:invert max-w-screen-md  mb-4 mx-auto" />


    <div v-if="!products" class="flex justify-center items-center h-64">
      <UProgress />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 lg:gap-6 xl:gap-8 my-8">


      <div v-for="product in products" :key="product.id" class="p-2 max-w-screen-md ">
        <StripeProduct :product="product" />
      </div>
    </div>




    <img :src="`/images/handdrawn_ceramics_text/handdrawn_ceramics_text-09.svg`"
      class="mt-4 w-24 mx-auto h-auto dark:invert" />
  </div>
</template>

<script setup>

const products = ref(null);

const { data, error, fetch } = useFetch('/api/stripe-products');

watch(data, () => {
  if (!data.value) return;
  products.value = data.value.data;
});



// console.log(products);


</script>

<style scoped></style>