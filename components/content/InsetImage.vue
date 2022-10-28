<template>
  <img
    :src="`${url}`"
    :style="{ width, height: 'auto' }"
    class="fr-l w-100 w-50-l ma1 mh4-l pa1 pa3-l pr4-ns pr6-l br2"
  />
</template>
<script setup>
defineProps(["url", "width"]);
</script>
<style></style>
