<template>
  <img
    :src="`${url}`"
    :style="{ width, height: 'auto' }"
    class="fr w-50 ma1 ma3-l pa1 pa3-l"
  />
</template>
<script setup>
defineProps(["url", "width"]);
</script>
<style></style>
