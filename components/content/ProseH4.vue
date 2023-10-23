<template>
  <h3 :id="id" class="">
    <a :href="`#${id}`" class="no-underline py-2">
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
