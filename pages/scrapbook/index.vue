<template>
  <div ref="scrapcontainer" class="container mx-auto px-4 py-8 max-h-screen overflow-y-auto monospace">
    <h1 class="text-3xl font-bold mb-4 lg:mb-8">Scrapbook</h1>
    <NuxtLink :to="`/scrapbook/verbose`" class="underline block">
      Verbose view</NuxtLink>
    <NuxtLink :to="`/scrapbook/graph`" class="underline block">
      Graph view</NuxtLink>
    <NuxtLink :to="`/scrapbook/graph`" class="underline block">
      Card view</NuxtLink>

    <div class="scrap-metadata-container">
      <div class="scrap-heatmap">
        <div class="scrap-heatmap-grid leading-none flex flex-wrap py-4">
          <div v-for="(block, index) in heatmapData" :key="index"
            class="mr-0.5 mb-0.5 w-2 h-2 overflow-visible sans-serif">
            <UTooltip :text="`${block.count} scraps on ${formatDate(block.date)}`">
              <div class="scrap-heatmap-block w-2 h-2 " :style="{ backgroundColor: block.color }"></div>
            </UTooltip>
          </div>

        </div>
      </div>
    </div>
    <div v-for="(group, groupIndex) in groupedScraps" :key="groupIndex" class="mb-4">
      <ScrapGallery v-if="group.type === 'gallery'" :scraps="group.items" />
      <ScrapPRBlock v-else-if="group.type === 'pr'" :scraps="group.items" />
      <ScrapItem v-else :scrap="group.items[0]" />
    </div>
    <div v-if="loading" class="text-center">Loading...</div>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import ScrapItem from '~/components/Scrap/Item.vue'
import ScrapGallery from '~/components/Scrap/Gallery.vue'
import { scaleLinear } from 'd3'
import * as d3 from 'd3'

const scrapcontainer = ref(null)
const { combinedData } = useScrap()
const displayedData = ref([])
const loading = ref(false)
const PAGE_SIZE = 20

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    const startIndex = displayedData.value.length
    const endIndex = startIndex + PAGE_SIZE
    const newData = combinedData.value.slice(startIndex, endIndex)
    displayedData.value.push(...newData)
    loading.value = false
  }, 500)
}

useInfiniteScroll(scrapcontainer, loadMore, { distance: 10 })

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const groupedScraps = computed(() => {
  // Create an empty array to store the grouped scraps
  const groups = []

  // Create a variable to keep track of the current gallery group
  let currentGalleryGroup = null

  // Create a variable to keep track of the current PR group
  let currentPRGroup = null

  // Iterate over each scrap in the displayedData array
  displayedData.value.forEach((scrap, index) => {
    let scrapHasContent = false
    if (scrap.content) {
      scrapHasContent = true
    } else if (scrap.description) {
      scrapHasContent = true
    }
    // Check if the current scrap has images
    if (scrap.images?.length > 0 && !scrapHasContent) {
      // If there is no current gallery group, create a new one
      if (!currentGalleryGroup) {
        currentGalleryGroup = {
          type: 'gallery',
          items: [],
        }
        // Add the newly created gallery group to the groups array
        groups.push(currentGalleryGroup)
      }
      // Add the current scrap to the current gallery group
      currentGalleryGroup.items.push(scrap)
    } else if (scrap.type === 'user-github-pr') {
      // If the current scrap type is 'user-github-pr', add it to the current PR group
      if (!currentPRGroup) {
        currentPRGroup = {
          type: 'pr',
          items: [],
        }
        // Add the newly created PR group to the groups array
        groups.push(currentPRGroup)
      }
      // Add the current scrap to the current PR group
      currentPRGroup.items.push(scrap)
    } else {
      // If the current scrap doesn't have images and is not a PR, add it as an individual item
      groups.push({
        type: 'single',
        items: [scrap],
      })
      // Reset the current gallery group and PR group to null
      currentGalleryGroup = null
      currentPRGroup = null
    }
  })

  // Return the array of grouped scraps
  return groups
})


// generate a count of total scraps per day
const scrapCountByDay = computed(() => {
  const scrapCountByDay = {}
  displayedData.value.forEach((scrap) => {
    if (!scrap.time) return console.error(`Scrap ${scrap.id} has no time`)
    const date = formatDate(scrap.time)
    if (!scrapCountByDay[date]) {
      scrapCountByDay[date] = 0
    }
    scrapCountByDay[date]++
  })
  return scrapCountByDay
})

const isDark = useDark()

// we are gonna use the total scraps per day
// to generate a github style heatmap of recent activity
// we will use the same color scale as github
const colorScale = scaleLinear()
  .domain([0, 6])
  // .range(['#ebedf0', '#196127'])
  .range([isDark ? '#1a1a1a' : '#ebedf0', isDark ? '#196127' : '#196127'])

// and now we generate the data for each block, which will be a 2d array
// with the date and the color
// for the last 90 days
const heatmapData = computed(() => {
  const heatmapData = []
  for (let i = 0; i < 90; i++) {

    // const count = scrapCountByDay.value[formatDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000))] || 0
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
</script>
