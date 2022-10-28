<template>
  <h2 :id="id" class="sans-serif mv4 mh1 mh3-ns ml6-l">
    <a :href="`#${id}`" class="link dark-gray f2 fw6 f1-l">
      <slot />
    </a>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();
</script>
