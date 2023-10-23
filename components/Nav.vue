<template>
  <nav
    class="bg-neutral-50 dark:bg-gray-950 drop-shadow-sm py-1 xl:py-2 sticky top-0 md:static md:top-auto bg-opacity-90 backdrop-blur-sm z-50">
    <div class="container mx-auto py-1 flex justify-between items-center">
      <NuxtLink class="text-gray-800 dark:text-white text-xl font-bold pl-2" to="/">EJ Fox</NuxtLink>
      <div class="">
        <NuxtLink class="px-4 py-2  text-gray-700 dark:text-white hover:text-gray-900" to="/">Home
        </NuxtLink>
        <NuxtLink class="px-4 py-2  text-gray-700 dark:text-white hover:text-gray-900" to="/projects">
          Projects</NuxtLink>
        <NuxtLink class="px-4 py-2  text-gray-700 dark:text-white hover:text-gray-900" to="/blog/">Blog
        </NuxtLink>
        <NuxtLink class="px-4 py-2  text-gray-700 dark:text-white hover:text-gray-900" to="/scrapbook/">
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