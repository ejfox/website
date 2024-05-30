<template>
  <div class="flex justify-center py-32">
    <div class="max-w-screen-lg mx-auto p-8">
      <h1 class="text-4xl font-bold mb-4">Example of a paywall page</h1>

      <p class="mb-4">Imagine, this page had a really dope story on it.</p>

      <p class="mb-4">You start reading it, and once you scroll to a section, a little popup appears, telling you that
        you need to pay to read the story. But! You can choose your own price, isn't that cool?</p>

      <p class="mb-4">This a proof of concept of using Stripe Checkout for that paywall, and making the UX really nice.
      </p>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
p {
  @apply text-lg my-32 py-24 p-4 bg-slate-800 rounded-lg;
  ;
  /* margin: 22vh 0; */
  /* padding: 10vh 0; */
}
</style>