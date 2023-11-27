<template>
  <nav class="p-4 xl:py-2 sticky top-0 md:static md:top-auto bg-opacity-90 backdrop-blur-sm z-50">
    <div class="container mx-auto py-1 flex flex-col items-start"> <!-- Updated class: items-start -->
      <NuxtLink class="text-gray-800 dark:text-white text-xl font-bold p-4" to="/">EJ Fox</NuxtLink>

      <div class="space-y-2">
        <NuxtLink active-class="text-primary-500" class="block w-full px-4 py-2 text-lg md:text-xl" to="/">
          Home
        </NuxtLink>
        <NuxtLink active-class="text-primary-500" class="block w-full px-4 py-2 text-lg md:text-xl" to="/projects">
          Projects
        </NuxtLink>
        <NuxtLink active-class="text-primary-500" class="block w-full px-4 py-2 text-lg md:text-xl" to="/blog/">Blog
        </NuxtLink>
        <!-- <NuxtLink active-class="text-primary-500" class="md:px-4 py-2" to="/scrapbook/">Scrapbook</NuxtLink> -->
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
