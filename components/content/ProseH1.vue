<template>
  <h1 :id="id" class="">
    <slot />
  </h1>
</template>
<script setup>
defineProps(['id'])
</script>
<style scoped>
/* .f-headline-l {
  font-size: 9rem !important;
} */
.headline-sans-serif {
  font-family: 'Fjalla One', sans-serif;
}
</style>
