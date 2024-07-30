<template>
  <div ref="scrapcontainer" class="container mx-auto px-4 py-8 max-h-screen overflow-y-auto monospace">
    <h1 class="text-3xl font-bold mb-4 lg:mb-8">Scrapbook</h1>

    <div v-if="isLoading && !combinedData.length" class="text-center">Loading data...</div>
    <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>
    <template v-else>
      <div v-for="scrap in combinedData" :key="scrap.scrap_id" class="mb-4">
        <ScrapItem :scrap="scrap" />
      </div>
      <div v-if="isLoading" class="text-center">Loading more...</div>
      <div v-if="!hasMorePages" class="text-center">No more scraps to load</div>
    </template>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import ScrapItem from '~/components/Scrap/Item.vue'
import useScrap from '~/composables/useScrap'

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

// Call prefetchNextPage when nearing the end of the current data
watch(() => combinedData.value.length, (newLength, oldLength) => {
  if (newLength > oldLength && newLength % 15 === 0) { // Adjust the number as needed
    prefetchNextPage()
  }
})
</script>