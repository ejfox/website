<template>
  <div ref="scrapcontainer" class="container mx-auto px-2 py-4 max-h-screen overflow-y-auto text-xs  max-w-screen-xl">
    <h1 class="text-xl font-bold mb-2">Scrapbook <span class="opacity-50 font-light"> (Verbose)</span></h1>
    <table class="w-full border-collapse">
      <thead>
        <tr class="">
          <th class="bg-gray-200 dark:bg-gray-900 text-gray-500 p-1 w-1/8">Date</th>
          <th class="bg-gray-200 dark:bg-gray-900 text-gray-500 p-1 w-2/8">Source</th>
          <th class="bg-gray-200 dark:bg-gray-950 p-1 w-2/8">Content</th>
          <th class="bg-gray-200 dark:bg-gray-950 p-1 w-2/8 hidden xl:table-cell">Summary</th>
          <th class="bg-gray-200 dark:bg-gray-950 p-1 w-1/8 hidden lg:table-cell">Available Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="scrap in combinedData" :key="scrap.id"
          class="opacity-90 hover:opacity-100 dark:text-gray-400 dark:hover:text-gray-300">
          <td class="border dark:border-gray-800 whitespace-nowrap px-1">{{ formatDate(scrap.created_at) }}</td>
          <td class="border dark:border-gray-800 whitespace-nowrap px-1">{{ scrap.source }}</td>
          <td class="border dark:border-gray-800 px-1">
            <a :href="`/scrapbook/${scrap.scrap_id}`" class="hover:underline pr-1">
              {{ scrap.scrap_id }}
            </a>
            <span v-if="scrap.content" v-html="scrap.content" class="dark:text-white text-black" />
            <span v-if="scrap.tags" class="px-2 opacity-20 hover:opacity-100 text-[10px]">
              <span v-for="tag in scrapToTags(scrap)" :key="tag"
                class="bg-gray-200 dark:bg-gray-700 px-1 rounded mr-1">{{ tag }}</span>
            </span>
          </td>
          <td class="border dark:border-gray-800 px-1 hidden xl:table-cell">
            <div class="max-h-16 overflow-y-auto">
              <div v-if="scrap.summary" v-html="scrap.summary" />
              <div v-else class="opacity-20 hover:opacity-100">No summary available</div>
            </div>

          </td>
          <td class="border overflow-x-auto hidden lg:table-cell">
            <div class="flex items-center space-x-1">
              <span v-if="!scrap.metadata">No metadata available</span>
              <span v-else-if="Object.keys(scrap.metadata).length === 0">Empty metadata</span>
              <span v-else class="space-x-1">
                <span v-for="key in Object.keys(scrap.metadata)" :key="key">
                  <UTooltip :text="String(scrap.metadata[key])">

                    <span v-if="key === 'screenshotUrl'">
                      <a :href="scrap.metadata[key]" target="_blank" rel="noopener noreferrer">
                        <img class="w-auto h-4 " :src="scrap.metadata[key]" alt="External link" />
                      </a>
                    </span>
                    <span v-else class="bg-gray-200 dark:bg-gray-700 px-1 rounded cursor-help">{{ key }}</span>
                  </UTooltip>
                </span>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isLoading" class="text-center mt-2">Loading more scraps...</div>
    <div v-if="!hasMorePages" class="text-center mt-2 text-gray-600 dark:text-gray-400">--- End of scraps ---</div>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'

const scrapcontainer = ref(null)
const {
  combinedData,
  isLoading,
  error,
  loadMore,
  prefetchNextPage,
  hasMorePages
} = useScrap()

useInfiniteScroll(scrapcontainer, loadMore, { distance: 10 })

function scrapToTags(scrap) {
  const rawTagString = scrap.tags || ''
  // looks like ["tag1", "tag2", "tag3"]
  // first remove the [ and ]
  let tagString = rawTagString.slice(1, -1)
  // then split by comma
  return tagString.split(',').map(tag => tag.trim())
    // then remove quotes
    .map(tag => tag.slice(1, -1))
}

const formatDate = (date) => {
  return format(new Date(date), 'yy-MM-dd HH:mm:ss')
}

const truncate = (str, n) => {
  return str ? (str.length > n ? str.slice(0, n - 1) + '…' : str) : '';
}

// Debug logging
watch(combinedData, (newData) => {
  console.log('Combined data updated:', newData.length, 'items')
  if (newData.length > 0) {
    console.log('First item metadata:', newData[0].metadata)
  }
}, { deep: true })

// Prefetch next page when nearing the end
watch(() => combinedData.value.length, (newLength, oldLength) => {
  if (newLength > oldLength && newLength % 15 === 0) {
    prefetchNextPage()
  }
})
</script>

<style scoped>
table {
  border-spacing: 0;
}

th,
td {
  border: 1px solid #ccc;
}
</style>