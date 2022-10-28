<template>
  <h3 :id="id" class="sans-serif mh1 mh3-ns mv2 mv3-l ml6-l measure">
    <a :href="`#${id}`" class="near-black link">
      <slot />
    </a>
  </h3>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();
</script>
<style scoped>
a:link,
a:hover {
  cursor: default !important;
}
</style>
