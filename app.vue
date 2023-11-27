<template>
  <div id="app-container" class="sans-serif w-100">
    <div class="flex flex-col md:flex-row h-screen">
      <Nav class="w-full md:w-1/5 h-1/5 md:border-none md:h-full" />

      <div class="w-full md:w-4/5">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
<script setup>
</script>

<style>
.sans-serif {
  font-family: "Signika Negative", sans-serif !important;
}
</style>
