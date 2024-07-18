<template>
  <div class="w-full h-full">
    <pre>{{ status }}</pre>
    <p>{{ scraps.scraps.length }} scraps loaded</p>
    <!-- <pre>{{ scraps }}</pre> -->
    <div ref="scrapgraphcontainer" class="container mx-auto p-0 min-h-screen w-full">
      <div v-if="status === 'pending'" class="text-center p-4">
        Loading ...
      </div>
      <div v-else>
        <svg ref="graphsvg" id="graph-svg" class="w-full">
          <g v-for="(weekPath, i) in weekPaths" :key="i">
            <path :d="weekPath" stroke="#CCC" fill="transparent" :stroke-width="0.5" :data-week="i"
              :stroke-dashoffset="dashOffset" stroke-dasharray="2 2" />
          </g>

          <g v-for="circle in scrapNodes" :transform="`translate(${circle.x}, ${circle.y})`" class="scrap-node">
            <g v-if="circle.type === 'week'">
              <text font-size="24" text-anchor="middle" fill="#CCC" y="-4.5" x="20" class="uppercase">
                {{ dateToWeekLabel(circle.created_at) }}
              </text>
            </g>
            <g v-else>
              <foreignObject :width="cardWidth" :height="cardHeight">
                <div class="w-full leading-none bg-white/30 dark:bg-black/30 bg-blur-md" style="font-size: 9px">
                  <div class="text-white">
                    {{ formatDate(circle.created_at) }}
                  </div>
                  <ScrapGraphItem :scrap="circle" :showDetails="false" class="text-[11px]" />
                </div>
              </foreignObject>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import * as d3 from 'd3'
import ScrapItem from '~/components/Scrap/Item.vue'

const scrapNodes = ref([])
const scrapgraphcontainer = ref(null)
const { width, height } = useElementSize(scrapgraphcontainer)

const line = d3.line()
  .curve(d3.curveCatmullRom.alpha(0.5))
  .x((d) => d[0])
  .y((d) => d[1])

const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')

const MAX_SCRAPS_TO_SHOW = 100

const cardSize = 132
const cardHeight = cardSize
const cardWidth = cardSize
const buffer = 28
const padding = cardWidth * 1.5

const forceSim = ref(null)
const forceLinks = ref([])

const serviceColors = {
  'mastodon-post': '#b3e2cd',
  pinboard: '#fdcdac',
  'github-gist': '#cbd5e8',
  arena: '#f4cae4',
}

function getServiceColor(serviceName) {
  return serviceColors[serviceName] || '#999'
}

const weeks = ref([])

const weekPaths = computed(() => {
  if (!scrapNodes.value.length) return []

  const weekData = d3.group(scrapNodes.value, (d) => {
    const time = new Date(d.created_at)
    return weeks.value.findIndex((week) => time >= week && time < d3.timeWeek.offset(week, 1))
  })

  return Array.from(weekData, ([weekIndex, weekNodes]) => {
    const weekCoordinates = weekNodes.map((d) => [d.x, d.y])
    return line(weekCoordinates)
  })
})

const pathLength = ref(200)
const dashOffset = ref(0)

const currentPage = ref(1)
const PAGE_SIZE = 75

const { status, data: scraps } = await useLazyFetch('/api/scraps', {
  method: 'POST',
  body: JSON.stringify({ page: currentPage.value, pageSize: PAGE_SIZE }),
})



const processData = (data) => {
  if (!data || !data.length) {
    console.error('No data!')
    return
  }

  // console.log('Data received:', data)

  const processedData = data.map((d) => ({
    type: d.type,
    radius: cardHeight / 2,
    // fill: getServiceColor(d.type),
    created_at: d.created_at,
    ...d,
  }))

  const trimmedData = processedData
    // .filter((d) => d.description)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, MAX_SCRAPS_TO_SHOW)

  scrapNodes.value = trimmedData
  // console.log('Processed scrapNodes:', scrapNodes.value)

  const times = trimmedData.map((d) => new Date(d.created_at))
  const timeExtent = d3.extent(times)

  const timeScale = d3
    .scaleTime()
    .domain(timeExtent)
    .range([height.value - cardHeight, cardHeight * 2])

  scrapNodes.value.forEach((d) => {
    const time = new Date(d.created_at)
    const day = time.getDay()
    const JITTER = Math.random() * 20 - 10
    d.x = width.value * (day / 6) + JITTER
    d.y = timeScale(time)
  })

  weeks.value = d3.timeWeeks(d3.min(processedData, (d) => new Date(d.created_at)), d3.max(trimmedData, (d) => new Date(d.created_at)))

  forceSim.value = d3
    .forceSimulation(scrapNodes.value)
    .force('link', d3.forceLink(forceLinks.value).id((d) => d.id).strength(0.25).distance(width.value * 0.2))
    .force('charge', d3.forceManyBody().strength(-4).distanceMax(width.value * 0.25).distanceMin(cardHeight))
    .force(
      'collide',
      d3.forceCollide((d) => d.radius + buffer),
    )
    .force('y', d3.forceY((d) => timeScale(new Date(d.created_at))))
    .force('x', d3.forceX((d) => {
      const time = new Date(d.created_at)
      const day = time.getDay()
      const xPosition = width.value * (day / 6) + padding
      const totalWidth = width.value - padding * 2
      return xPosition * (totalWidth / width.value)
    }))
    .force('bounds', (alpha) => {
      scrapNodes.value.forEach((d) => {
        const radius = d.radius + buffer
        d.x = Math.max(radius, Math.min(width.value - radius, d.x))
        d.y = Math.max(radius, Math.min(height.value - radius, d.y))
        const rightBound = width.value - radius
        if (d.x > rightBound) {
          d.x = rightBound
        }
      })
    })
}

watch(scraps, (newScraps) => {
  if (newScraps) {
    processData(newScraps.scraps)
  }
}, { immediate: true })

function animateWeekPaths() {
  dashOffset.value += 0.05
  requestAnimationFrame(animateWeekPaths)
}

onMounted(() => {
  animateWeekPaths()
})

const dateToWeekLabel = (date) => format(new Date(date), 'MMM d yy')
</script>

<style>
#graph-svg {
  min-height: 720vh;
  border: 4px solid #999;
}

.scrap-node {
  will-change: transform;
}
</style>
