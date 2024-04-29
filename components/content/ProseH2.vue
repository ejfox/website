<template>
  <h2 :id="id" class="">
    <a :href="`#${id}`" class="no-underline py-2">
      <slot />
    </a>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
