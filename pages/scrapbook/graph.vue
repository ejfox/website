<template>
  <div class="w-full h-full">
    <div ref="scrapgraphcontainer" class="container mx-auto p-0 min-h-screen w-full">
      <svg ref="graphsvg" id="graph-svg" class="w-full">
        <g v-for="(weekPath, i) in weekPaths" :key="i">
          <path :d="weekPath" stroke="#CCC" fill="transparent" :stroke-width="0.5" :data-week="i"
            :stroke-dashoffset="dashOffset" stroke-dasharray="2 2" />
        </g>

        <g v-for="circle in scrapNodes" :transform="`translate(${circle.x}, ${circle.y})`" class="scrap-node">
          <g v-if="circle.type === 'week'">
            <text font-size="24" text-anchor="middle" fill="#CCC" y="-4.5" x="20" class="uppercase">
              {{ dateToWeekLabel(circle.time) }}
            </text>
          </g>
          <g v-else>
            <foreignObject :width="cardWidth" :height="cardHeight">
              <div class="w-full leading-none bg-white/30 dark:bg-black/30 bg-blur-md" style="font-size: 9px">
                <!-- <ScrapVerboseScrapItem :scrap="circle" :show-details="false" class="text-[11px]" /> -->

                <!-- day of week -->
                <div class="text-white ">
                  {{ formatDate(circle.time) }}
                </div>

                <ScrapItem :scrap="circle" :showDetails="false" class="text-[11px]" />
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import useScrap from '~/composables/useScrap.js'
import { format } from 'date-fns'
import * as d3 from 'd3'

const { combinedData } = useScrap()

const scrapNodes = ref([])
const scrapgraphcontainer = ref(null)
const { width, height } = useElementSize(scrapgraphcontainer)

const line = d3.line()
  // .curve(d3.curveLinear)
  // catmull rom
  .curve(d3.curveCatmullRom.alpha(0.5))
  .x((d) => d[0])
  .y((d) => d[1])


const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}


const MAX_SCRAPS_TO_SHOW = 100

const cardSize = 132
const cardHeight = cardSize
const cardWidth = cardSize
const buffer = 28
const padding = cardWidth * 1.5

const forceSim = shallowRef(null)
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

const weeks = shallowRef([])
/**
 * Computes the week paths based on the scrap nodes.
 * @returns {Array} The array of week paths.
 */
const weekPaths = computed(() => {
  // If there are no scrap nodes, return an empty array
  if (!scrapNodes.value.length) return []

  // Group the scrap nodes by week
  const weekData = d3.group(scrapNodes.value, (d) => {
    const time = new Date(d.created_at)
    // Find the index of the week that the scrap node belongs to
    return weeks.value.findIndex((week) => time >= week && time < d3.timeWeek.offset(week, 0))
  })

  // Convert the week data into an array of week paths
  return Array.from(weekData, ([weekIndex, weekNodes]) => {
    // Map the week nodes to their coordinates
    const weekCoordinates = weekNodes.map((d) => [d.x, d.y])
    // Generate a line path based on the week coordinates
    return line(weekCoordinates)
  })
})

// const pathLength = ref(null)
const pathLength = ref(200)
const dashOffset = ref(0)

function processData() {
  if (!combinedData.value) console.error('no data!')

  const data = combinedData.value.map((d) => ({
    type: d.type,
    radius: cardHeight / 2,
    fill: getServiceColor(d.type),
    time: d.time,
    ...d,
  }))

  const trimmedData = data
    .filter((d) => d.description)
    // sort by time
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, MAX_SCRAPS_TO_SHOW)

  scrapNodes.value = trimmedData

  const times = trimmedData.map((d) => new Date(d.time))
  const timeExtent = d3.extent(times)

  const timeScale = d3
    .scaleTime()
    .domain(timeExtent)
    // .range([height.value, 0])
    // add some padding
    // .range([cardHeight * 2, height.value - cardHeight])
    // upside down
    .range([height.value - cardHeight, cardHeight * 2])

  scrapNodes.value.forEach((d) => {
    const time = new Date(d.time)
    const day = time.getDay()
    const JITTER = Math.random() * 20 - 10
    d.x = width.value * (day / 6) + JITTER
    d.y = timeScale(time)
  })

  weeks.value = d3.timeWeeks(d3.min(data, (d) => new Date(d.time)), d3.max(trimmedData, (d) => new Date(d.time)))

  forceSim.value = d3
    .forceSimulation(scrapNodes.value)
    .force('link', d3.forceLink(forceLinks.value).id((d) => d.id).strength(0.25).distance(width.value * 0.2))
    .force('charge', d3.forceManyBody().strength(-4).distanceMax(width.value * 0.25).distanceMin(cardHeight))
    .force(
      'collide',
      d3.forceCollide((d) => d.radius + buffer),
    )
    .force(
      'y',
      d3.forceY((d) => timeScale(new Date(d.time))),
    )
    .force('x', d3.forceX((d) => {
      const time = new Date(d.time)
      if (isNaN(time)) {
        console.log('Invalid time:', d.time)
      }
      const day = time.getDay()

      const xPosition = width.value * (day / 6) + padding
      const totalWidth = width.value - padding * 2
      return xPosition * (totalWidth / width.value)
    }))
    // add a force to make sure that the nodes don't go off the screen
    .force('bounds', (alpha) => {
      scrapNodes.value.forEach((d) => {
        const radius = d.radius + buffer
        d.x = Math.max(radius, Math.min(width.value - radius, d.x))
        d.y = Math.max(radius, Math.min(height.value - radius, d.y))
        // Make sure they don't go off the right side of the screen
        const rightBound = width.value - radius
        if (d.x > rightBound) {
          d.x = rightBound
        }
      })
    })
}

watch(combinedData, processData)

function animateWeekPaths() {
  dashOffset.value += 0.05
  requestAnimationFrame(animateWeekPaths)
}

onMounted(() => {
  pathLength.value = Math.max(...weekPaths.value.map((path) => path.getTotalLength()))

  animateWeekPaths()
})

const dateToWeekLabel = (date) => {
  return format(new Date(date), 'MMM d yy')
}
</script>

<style>
#graph-svg {
  min-height: 720vh;
}

.scrap-node {
  will-change: transform;
}
</style>