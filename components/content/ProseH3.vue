<template>
  <h3 :id="id" class="sans-serif mh1 mh3-ns mv4 ml6-l measure">
    <a :href="`#${id}`" class="dark-gray link fw6">
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
