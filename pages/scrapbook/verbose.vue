<template>
  <div ref="scrapcontainer" class="container mx-auto px-4 py-8 max-h-screen overflow-y-auto monospace">
    <h1 class="text-3xl font-bold mb-4 lg:mb-8">Scrapbook</h1>
    <div v-for="(group, groupIndex) in groupedScraps" :key="groupIndex" class="mb-0.5 inline">
      <!-- <ScrapGallery v-if="group.type === 'gallery'" :scraps="group.items" />
      <ScrapPRBlock v-else-if="group.type === 'pr'" :scraps="group.items" /> -->

      <VerboseScrapItem :scrap="group.items[0]" class="text-xs" />
      <!-- <pre>{{group.items[0]}}</pre> -->
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

async function generateScrapId(scrap) {
  return await scrapToUUID(scrap)
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
</script>
