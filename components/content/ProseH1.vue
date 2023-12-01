<template>
  <h1 :id="id"
    class="text-5xl sm:text-6xl md:text-8xl font-bold mb-1 text-gray-900 dark:text-gray-100 pt-8 ml-0 xl:pt-24 xl:pb-20">
    <slot />
  </h1>
</template>
<script setup>
defineProps(["id"]);
</script>
<style scoped>
/* .f-headline-l {
  font-size: 9rem !important;
} */
.headline-sans-serif {
  font-family: "Fjalla One", sans-serif;
}
</style>
