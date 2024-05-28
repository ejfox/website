<template>
  <nav :class="navClasses">
    <div class="container mx-auto md:py-1 md:flex md:flex-col items-start">
      <!-- Updated class: items-start -->
      <NuxtLink class="text-gray-800 dark:text-white text-xl font-bold px-2 md:p-4 md:mb-2 block" to="/">EJ Fox
      </NuxtLink>
      <NuxtLink :class="linkClasses" to="/"> Home </NuxtLink>
      <NuxtLink :class="linkClasses" to="/projects"> Projects </NuxtLink>
      <NuxtLink :class="linkClasses" to="/blog/">Blog </NuxtLink>
      <NuxtLink :class="linkClasses" to="/scrapbook/">Scrapbook</NuxtLink>

      <div class="px-2 md:px-4 mt-12 text-xs">
        <iframe src="https://github.com/sponsors/ejfox/button" title="Sponsor ejfox" height="32" width="114"
          style="border: 0; border-radius: 6px;"></iframe>
      </div>

      <!-- <NuxtLink active-class="text-primary-500" :class="linkClasses" to="/stats/">Stats</NuxtLink> -->
    </div>
  </nav>
</template>

<script setup>
const linkClasses =
  "inline-block md:block md:w-full px-2 md:px-4 my-2 text-lg md:text-xl'"

// make a computed that checks the route
// if we are in /scrapbook/
// add the opacity-20 class

const route = useRoute()
const isScrapbook = computed(() => {
  return route.path.includes('/scrapbook/')
})

const navClasses = computed(() => {
  const classes = [
    'p-1 md:p-2 xl:py-1 top-0 md:static md:top-auto bg-opacity-90 transition-opacity',
  ]
  if (isScrapbook.value) {
    classes.push('opacity-20')
  }
  return classes
})
</script>

<style>
nav a {
  transition: all 240ms ease-out;
}
</style>
