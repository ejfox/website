<template>
  <div ref="scrapcontainer" class="container mx-auto px-2 py-4 max-h-screen overflow-y-auto text-xs">
    <h1 class="text-xl font-bold mb-2">Scrapbook (Verbose)</h1>
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200 dark:bg-gray-800">
          <th class="p-1 border w-1/6">Date</th>
          <th class="p-1 border w-1/6">Source</th>
          <th class="p-1 border w-3/6">Content</th>
          <th class="p-1 border w-2/6 hidden lg:table-cell">Available Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="scrap in combinedData" :key="scrap.id" class="hover:bg-gray-100 dark:hover:bg-gray-750">
          <td class="border whitespace-nowrap px-1">{{ formatDate(scrap.created_at) }}</td>
          <td class="border whitespace-nowrap px-1">{{ scrap.source }}</td>
          <td class="border px-1">
            <span v-if="scrap.content" v-html="scrap.content" />
            <span v-if="scrap.tags" class="px-2 opacity-20 hover:opacity-100">
              <span v-for="tag in scrapToTags(scrap)" :key="tag"
                class="bg-gray-200 dark:bg-gray-700 px-1 rounded mr-1">{{ tag }}</span>
            </span>
          </td>
          <td class="border overflow-x-auto hidden lg:table-cell">
            <span v-if="!scrap.metadata">No metadata available</span>
            <span v-else-if="Object.keys(scrap.metadata).length === 0">Empty metadata</span>
            <span v-else class="space-x-1">
              <UTooltip v-for="key in Object.keys(scrap.metadata)" :key="key" :text="String(scrap.metadata[key])">
                <span class="bg-gray-200 dark:bg-gray-700 px-1 rounded cursor-help mr-1">{{ key }}</span>
                <span v-if="key === 'screenshotUrl'">
                  <a :href="scrap.metadata[key]" target="_blank" rel="noopener noreferrer">
                    <img class="w-4 h-4" :src="scrap.metadata[key]" alt="External link" />
                  </a>
                </span>
              </UTooltip>
            </span>
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