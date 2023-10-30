<template>
  <ul
    class="list w-full md:w-2/5 lg:w-1/5 measure rounded-md py-3 md:py-4 px-0 float-right bg-gray-100 dark:bg-gray-900 shadow md:shadow-xl ml-5 mb-5">
    <h2
      class="text-left md:text-center my-1 text-gray-900 dark:text-gray-100 text-lg md:text-xl font-medium py-0 hidden lg:visible">
      Table
      of contents
    </h2>
    <ol class="py-1 text-sm lg:text-base">
      <li v-for="(link, i) of toc.links" :key="link.id" class="py-0 pr-5">
        <a :href="`#${link.id}`" class="text-gray-600 dark:text-gray-600 hover:text-gray-800 underline">

          {{ link.text }}</a>
      </li>
    </ol>
  </ul>
</template>
<script setup>
const { toc } = useContent();
</script>
<style>
/* even though the display elements are inline block, we still want to show the number of the list item */
ol {
  list-style: decimal;
}

/* remove the default padding and margin */
ol,
ul {
  padding: 0;
  margin: 0;
}
</style>