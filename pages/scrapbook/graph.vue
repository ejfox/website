<template>
  <div class="w-full h-full p-4">
    <div ref="scrapgraphcontainer" class="container mx-auto p-0 min-h-screen w-full">
      <svg ref="graphsvg" id="graph-svg" class="w-full" :height="svgHeight">
        <path :d="weekPath" stroke="#CCC" fill="none" stroke-width="2" :stroke-dashoffset="dashOffset"
          stroke-dasharray="4 4" />
        <g v-for="scrap in scrapNodes" :key="scrap.id" :transform="`translate(${scrap.x}, ${scrap.y})`"
          class="scrap-node">
          <foreignObject :width="cardWidth" :height="cardHeight" :x="-cardWidth / 2" :y="-cardHeight / 2">
            <div xmlns="http://www.w3.org/1999/xhtml"
              class="w-full p-2 bg-white border border-gray-200 overflow-hidden rounded shadow text-[10px] font-mono font-bold overflow-y-auto"
              :style="{
        position: 'relative',
        height: `${cardHeight}px`,
      }">
              <img :src="scrap.metadata.screenshotUrl" alt="Scrap Image"
                class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none " />
              <!-- <div class="font-bold">{{ formatDate(scrap.created_at) }}</div> -->
              <div class="mt-1 text-gray-600">
                {{ scrap.content }}
              </div>
              <!-- the link -->
              <div class="" v-if="scrap.metadata.href">
                <a :href="scrap.metadata.href" class="text-blue-500">
                  <UIcon name="i-heroicons-link" class="w-4 h-4 inline" />
                </a>
              </div>
            </div>
          </foreignObject>
          <text :y="-cardHeight / 2 - 9" class="text-[8px] text-gray-500" text-anchor="middle">
            {{ formatHrefForDisplay(scrap.metadata.href) }}
          </text>
          <text :y="cardHeight / 2 + 9" class="text-[8px]" text-anchor="middle">
            {{ formatDate(scrap.created_at) }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import { useElementSize } from '@vueuse/core'
import * as d3 from 'd3'

const { combinedData } = useScrap()

const scrapNodes = ref([])
const scrapgraphcontainer = ref(null)
const { width } = useElementSize(scrapgraphcontainer)

const svgHeight = ref(5000)

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy ha')
}

const MAX_SCRAPS_TO_SHOW = 100
const cardWidth = 124
const cardHeight = 224
const buffer = 92

const forceSim = ref(null)

const line = d3.line()
  .curve(d3.curveCatmullRom.alpha(0.5))
  .x(d => d.x)
  .y(d => d.y)



// remove any query params from the href
const formatHrefForDisplay = (href) => {
  if (!href) return ''
  try {
    let url = new URL(href)
    let formattedUrl = url.hostname + url.pathname
    // remove trailing slash
    formattedUrl = formattedUrl.replace(/\/$/, "")
    // remove www. if it's the first part of the hostname
    formattedUrl = formattedUrl.replace(/^www\./, "")
    return formattedUrl
  } catch (error) {
    console.error('Invalid URL:', href)
    return ''
  }
}


const weekPath = computed(() => {
  if (!scrapNodes.value.length) return ''
  const sortedNodes = [...scrapNodes.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  return line(sortedNodes)
})

const dashOffset = ref(0)

function processData() {
  if (!combinedData.value) {
    console.error('no data!')
    return
  }

  const trimmedData = combinedData.value
    .slice(0, MAX_SCRAPS_TO_SHOW)
    .map((scrap, index) => ({
      ...scrap,
      x: (index % 5) * (cardWidth + buffer) + cardWidth / 2,
      y: Math.floor(index / 5) * (cardHeight + buffer) + cardHeight / 2,
      radius: (Math.sqrt(cardWidth * cardHeight) / 2) * 1.2
    }))

  scrapNodes.value = trimmedData
  console.log('Processed scrap nodes:', scrapNodes.value.length)

  const times = trimmedData.map(d => new Date(d.created_at))
  const timeExtent = d3.extent(times)

  const timeScale = d3.scaleTime()
    .domain(timeExtent)
    .range([svgHeight.value - cardHeight, cardHeight])

  if (forceSim.value) forceSim.value.stop()

  forceSim.value = d3.forceSimulation(trimmedData)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('collide', d3.forceCollide(d => d.radius + buffer))
    .force('y', d3.forceY(d => timeScale(new Date(d.created_at))).strength(0.1))
    .force('x', d3.forceX(d => {
      const time = new Date(d.created_at)
      const day = time.getDay()
      return width.value * (day / 6)
    }).strength(0.1))
    .force('boundingBox', () => {
      for (let node of trimmedData) {
        node.x = Math.max(cardWidth / 2, Math.min(width.value - cardWidth / 2, node.x))
        node.y = Math.max(cardHeight / 2, Math.min(svgHeight.value - cardHeight / 2, node.y))
      }
    })
    .on('tick', () => {
      scrapNodes.value = [...trimmedData]
    })
}

watch(combinedData, processData, { immediate: true })

function animateWeekPath() {
  dashOffset.value -= 0.1
  requestAnimationFrame(animateWeekPath)
}

onMounted(() => {
  animateWeekPath()
})
</script>

<style>
#graph-svg {}

.scrap-node {
  will-change: transform;
}
</style>