<template>
  <div
    ref="scrapgraphcontainer"
    class="container mx-auto px-4 py-8 min-h-screen w-full"
  >
    <!-- {{scrapNodes.length}} nodes -->
    <svg
      ref="graphsvg"
      id="graph-svg"
      class="w-full min-h-screen overflow-visible py-24 my-8"
    >
      <!-- <circle 
      v-for="circle in scrapNodes"      
      :cx="circle.x"
      :cy="circle.y"
      :r="circle.radius" 
      :fill="circle.fill"
      /> -->

      <g
        v-for="circle in scrapNodes"
        :transform="`translate(${circle.x}, ${circle.y})`"
      >
        <text
          font-size="8"
          text-anchor="middle"
          :fill="circle.fill"
          y="-4.5"
          class="uppercase"
        >
          {{ formatDate(circle.time) }}
        </text>

        <foreignObject width="250" height="100">
          <div
            class="w-24 min-h-48 leading-none bg-white/30 dark:bg-black/30 bg-blur-md"
            style="font-size: 9px"
          >
            <span
              class="hover:opacity-100 opacity-30 transition-opacity"
              v-html="circle.description"
            />
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import { onMounted } from 'vue'
import * as d3 from 'd3'

const { combinedData } = useScrap()

const scrapNodes = ref([])

const graphsvg = ref(null)
const { width, height } = useElementSize(graphsvg)

const buffer = 48

/*
#b3e2cd
#fdcdac
#cbd5e8
#f4cae4
*/

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
#graph-svg {
  min-height: 420vh;
}
</style>
