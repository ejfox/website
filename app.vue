<template>
  <div id="app-container" class="sans-serif w-100">
    <div class="flex flex-col md:flex-row h-screen">
      <Nav class="w-full md:w-1/6 md:min-h-min md:border-none" />

      <div class="w-full md:w-5/6">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
<script setup></script>

<style>
.sans-serif {
  font-family: 'Signika Negative', sans-serif !important;
}

.monospace {
  font-family: 'Red Hat Mono', monospace !important;
}
</style>
