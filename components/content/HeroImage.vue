<template>
  <img
    :src="`${url}`"
    class="hero-image absolute top-0 left-0 db b--red ba z-0"
  />
</template>
<script setup>
defineProps(["url"]);
</script>
<style>
.hero-image {
  z-index: -1;
}
</style>
