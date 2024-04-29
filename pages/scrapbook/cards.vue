<template>
  <div
    ref="scrapgraphcontainer"
    id="scrapgraphcontainer"
    class="container mx-auto px-4 py-8 min-h-screen w-full"
  >
    <div
      v-for="(card, i) in scrapNodes"
      ref="scrapels"
      class="absolute w-32 leading-none -z-1 bg-white/80 bg-blur-sm p-0.5 rounded-sm border border-1 border-gray-500"
      :style="{
        left: card.x + 'px',
        top: card.y + 'px',
      }"
    >
      <span v-if="scrapSizes">
        {{ scrapSizes[i] }}
      </span>
      <!-- {{formatDate(card.time)}}       -->
      <span
        class="hover:opacity-100 opacity-30 transition-opacity text-xs leading-none"
        v-html="card.description"
      />
    </div>
  </div>
</template>

<script setup>
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import * as d3 from 'd3'

const { combinedData } = useScrap()

const scrapNodes = ref([])
const scrapels = ref(null)

const scrapgraphcontainer = ref(null)
const { width, height } = useElementSize(scrapgraphcontainer)

const buffer = 48

const serviceColors = {
  'mastodon-post': '#b3e2cd',
  pinboard: '#fdcdac',
  'github-gist': '#cbd5e8',
  arena: '#f4cae4',
}

const nodeLimit = ref(750)

function getServiceColor(serviceName) {
  const c = serviceColors[serviceName]
  if (!c) return '#999'
  return c
}

const scrapSizes = ref([])

// Function to update sizes
function updateSizes() {
  nextTick(() => {
    scrapSizes.value = scrapels.value.map((el) => {
      const rect = el.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    })
  })
}

onMounted(() => {
  watch(
    scrapNodes,
    () => {
      // Call updateSizes whenever scrapNodes changes and DOM has updated
      updateSizes()
    },
    { immediate: true },
  )
})

watch(combinedData, async () => {
  if (!combinedData.value) console.error('no data!')
  const data = combinedData.value.map((d) => {
    return {
      x: width.value * Math.random(),
      y: height.value / 2,
      type: d.type,
      radius: 2,
      fill: getServiceColor(d.type),
      time: d.time,
      ...d,
    }
  })

  const trimmedData = data
    .filter((d) => d.description)
    .slice(0, nodeLimit.value)
  scrapNodes.value = trimmedData
  const times = trimmedData.map((d) => new Date(d.time))
  const timeExtent = d3.extent(times)

  const timeScale = d3
    .scaleTime()
    .domain(timeExtent) // Set the domain based on the extent of time values
    .range([height.value, 0]) // Set the range based on your visualization height

  const forceSim = d3
    .forceSimulation(scrapNodes.value)
    .force('charge', d3.forceManyBody().strength(-20))
    // .force('center', d3.forceCenter(width.value/2, height.value/2))
    .force(
      'collide',
      d3.forceCollide(function (d, i) {
        return d.radius + buffer
      }),
    )
    // .force("x", d3.forceX(function (d) { return width.value/2 }))
    .force(
      'x',
      d3.forceX(function (d) {
        return d.x
      }),
    )
    // .force("y", d3.forceY(function (d) { return height.value/2 }))
    .force(
      'y',
      d3.forceY(function (d) {
        // Parse the ISO 8601 formatted time string into a Date object
        const time = new Date(d.time)

        // Use the time scale to map the time value to a position on the y-axis
        return timeScale(time)
      }),
    )
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d yy')
}
</script>
<style>
#scrapgraphcontainer {
  min-height: 500vh;
}
</style>
