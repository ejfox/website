<template>
  <div ref="scrapcontainer" class="container mx-auto px-4 py-8 max-h-screen overflow-y-auto monospace">
    <h1 class="text-3xl font-bold mb-4 lg:mb-8">Scrapbook</h1>

    <div v-if="isLoading && !combinedData.length" class="text-center">Loading data...</div>
    <div v-else-if="error" class="text-center text-red-500">Error: {{ error }}</div>
    <template v-else>
      <div v-for="(group, groupIndex) in groupedScraps" :key="groupIndex" class="mb-4">
        <ScrapGallery v-if="group.type === 'gallery'" :scraps="group.items" />
        <ScrapItem v-else :scrap="group.items[0]" />
      </div>
      <div v-if="isLoading" class="text-center">Loading more...</div>
      <div v-if="!hasMorePages" class="text-center">No more scraps to load</div>
    </template>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import { format } from 'date-fns'
import ScrapItem from '~/components/Scrap/Item.vue'
import ScrapGallery from '~/components/Scrap/Gallery.vue'
import { scaleLinear } from 'd3'
import useScrap from '~/composables/useScrap'

const scrapcontainer = ref(null)

const {
  combinedData,
  scrapByWeek,
  isLoading,
  error,
  loadMore,
  prefetchNextPage,
  hasMorePages
} = useScrap()

useInfiniteScroll(scrapcontainer, loadMore, { distance: 10 })

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const groupedScraps = computed(() => {
  const groups = []
  let currentGalleryGroup = null
  let currentPRGroup = null

  combinedData.value.forEach((scrap) => {
    let scrapHasContent = scrap.content || scrap.description

    if (scrap.images?.length > 0 && !scrapHasContent) {
      if (!currentGalleryGroup) {
        currentGalleryGroup = {
          type: 'gallery',
          items: [],
        }
        groups.push(currentGalleryGroup)
      }
      currentGalleryGroup.items.push(scrap)
    } else if (scrap.type === 'user-github-pr') {
      if (!currentPRGroup) {
        currentPRGroup = {
          type: 'pr',
          items: [],
        }
        groups.push(currentPRGroup)
      }
      currentPRGroup.items.push(scrap)
    } else {
      groups.push({
        type: 'single',
        items: [scrap],
      })
      currentGalleryGroup = null
      currentPRGroup = null
    }
  })

  return groups
})

const isDark = useDark()

const colorScale = scaleLinear()
  .domain([0, 6])
  .range([isDark.value ? '#1a1a1a' : '#ebedf0', isDark.value ? '#196127' : '#196127'])

const scrapCountByDay = computed(() => {
  const scrapCountByDay = {}
  if (combinedData.value) {
    combinedData.value.forEach((scrap) => {
      if (!scrap.created_at) return console.error(`Scrap ${scrap.id} has no time`)
      const date = formatDate(scrap.created_at)
      if (!scrapCountByDay[date]) {
        scrapCountByDay[date] = 0
      }
      scrapCountByDay[date]++
    })
  }
  return scrapCountByDay
})

const heatmapData = computed(() => {
  const heatmapData = []
  for (let i = 0; i < 90; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const count = scrapCountByDay.value[formatDate(date)] || 0
    heatmapData.push({
      count,
      date,
      color: colorScale(count),
    })
  }
  return heatmapData
})

// Call prefetchNextPage when nearing the end of the current data
watch(() => combinedData.value.length, (newLength, oldLength) => {
  if (newLength > oldLength && newLength % 15 === 0) { // Adjust the number as needed
    prefetchNextPage()
  }
})
</script>