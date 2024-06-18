<template>
  <div ref="scrapgraphcontainer" class="container mx-auto p-0 overflow-hidden w-full">
    <div v-for="(scrap, index) in scrapCards" :key="scrap.scrap_id" class="scrap-card" :style="{ zIndex: scrap.zIndex }"
      @mouseover="moveToTop(scrap)">
      <ScrapDraggableCard :scrap="scrap" :initialPosition="calcInitialPosition(scrap)" :z-index="scrap.zIndex" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useElementSize, useDraggable } from '@vueuse/core'
import * as d3 from 'd3'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'

const { combinedData } = useScrap()
const scrapgraphcontainer = ref(null)
// const { width, height } = useElementSize(scrapgraphcontainer)

const { width, height } = useWindowSize()
const scrapCards = ref([])

const cardHeight = 200 // Adjust the card height as needed

// const filteredScraps = computed(() => {
//   const currentDate = new Date()
//   const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
//   return combinedData.value.filter(scrap => new Date(scrap.time) >= startOfWeek)
// })

// just return the last 50 scraps
const filteredScraps = computed(() => {
  return combinedData.value.slice(-50)
})


// onMounted set scrapCards to the filtered scraps
watchEffect(() => {
  if (filteredScraps.value.length > 0) {
    scrapCards.value = filteredScraps.value.map(scrap => ({
      ...scrap,
      position: calcInitialPosition(scrap),
      zIndex: 0,
    }))
  }
})


const timeScale = computed(() => {
  const times = filteredScraps.value.map(d => new Date(d.time))
  const timeExtent = d3.extent(times)
  return d3.scaleTime()
    .domain(timeExtent)
    .range([height.value - cardHeight, cardHeight * 2])
})


function calcInitialPosition(scrap) {
  const y = timeScale.value(new Date(scrap.time))

  // pick a random spot on the x-axis
  const x = Math.random() * width.value
  return { x, y }
}

function moveToTop(scrap) {
  // tweak the z-index of the clicked card
  scrapCards.value = scrapCards.value.map(card => {
    // console.log({ card })
    if (card.scrap_id === scrap.scrap_id) {
      return { ...card, zIndex: 1 }
    }
    return { ...card, zIndex: 0 }
  })
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}
</script>
<style scoped>
.container {
  min-height: 320vh;
}
</style>