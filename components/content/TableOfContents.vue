<template>
  <ul
    class="list w-full md:w-2/5 lg:w-2/5 max-w-sm measure rounded-md py-3 md:py-4 px-0 float-right bg-transparent dark:bg-gray-900 mx-4 mb-4">
    <h2
      class="text-left md:text-center my-1 text-gray-900 dark:text-gray-100 text-lg md:text-xl font-medium py-0 hidden lg:visible">
      Table of contents
    </h2>
    <div v-if="toc">
      <ol class="mx-2 md:mr-4 my-2 md:my-4 text-sm lg:text-xl list-none" v-if="toc.links.length > 0">
        <li v-for="(link, i) of toc.links" :key="link.id" class="py-1 pr-3 md:pr-5">
          <a :href="`#${link.id}`"
            class="text-gray-600 dark:text-gray-400 md:dark:text-gray-600 hover:text-gray-800 underline">
            {{ link.text }}
          </a>
        </li>
      </ol>
    </div>
  </ul>
</template>
<script setup>
const { toc } = useContent()
</script>
<style>
/* even though the display elements are inline block, we still want to show the number of the list item */
ol {
  list-style: decimal;
}

/* remove the default padding and margin */
ol,
ul {
  padding: 0 !important;
  /* margin: 0 !important; */
}
</style>
