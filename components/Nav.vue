<template>
  <nav
    class="bg-neutral-50 dark:bg-gray-900 drop-shadow-sm py-1 xl:py-2 sticky top-0 md:static md:top-auto bg-opacity-90 backdrop-blur-sm z-50">
    <div class="container mx-auto py-1 flex justify-between items-center">
      <NuxtLink class="text-gray-800 dark:text-white text-xl font-bold pl-2" to="/">EJ Fox</NuxtLink>
      <div class="">
        <NuxtLink active-class="text-primary-500" class="pr-2 md:px-4 py-2" to="/">Home
        </NuxtLink>
        <NuxtLink active-class="text-primary-500" class="pr-2 md:px-4 py-2" to="/projects">
          Projects</NuxtLink>
        <NuxtLink active-class="text-primary-500" class="pr-2 md:px-4 py-2" to="/blog/">Blog
        </NuxtLink>
        <NuxtLink active-class="text-primary-500" class="pr-2 md:px-4 py-2" to="/scrapbook/">
          Scrapbook</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style>
nav a {
  transition: all 2ms ease-out;
}
</style>