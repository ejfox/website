<template>
  <div>
    <h1 class="text-4xl text-center leading-0 my-8">Thank you so much for your purchase!</h1>

    <div class="flex flex-row justify-evenly items-center">
      <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-07.svg"
        class="mt-4 w-64 mx-auto h-auto dark:invert" />

      <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-06.svg"
        class="mt-4 w-24 mx-auto h-auto dark:invert" />

      <img src="/images/handdrawn_ceramics_text/handdrawn_ceramics_text-09.svg"
        class="mt-4 w-64 mx-auto h-auto dark:invert" />
    </div>
  </div>
</template>

<script setup>
const product_id = useRouteQuery('productId');

const markProductAsSold = async () => {
  // console.log('trying to mark product as sold', product_id.value);
  if (product_id.value) {
    // console.log('Marking product as sold:', product_id.value);
    try {
      const { data } = await useFetch('/api/mark-product-sold', {
        method: 'POST',
        body: JSON.stringify({ productId: product_id.value }),
      });
      // console.log('Product marked as sold:', data.value);
    } catch (error) {
      console.error('Failed to mark product as sold:', error);
    }
  }
};

onMounted(markProductAsSold);
</script>