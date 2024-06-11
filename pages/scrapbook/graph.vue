<template>
  <div class="w-full h-full">
    <div ref="scrapgraphcontainer" class="container mx-auto p-0 min-h-screen w-full">
      <svg ref="graphsvg" id="graph-svg" class="w-full">
        <g v-for="(link, i) in forceLinks" :key="link.id">
          <path :d="linkPosToPath(link)" stroke="#CCC" :stroke-opacity="linkToOpacity(link)" fill="transparent"
            stroke-width="2" stroke-linecap="round" />
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
                <ScrapVerboseScrapItem :scrap="circle" :show-details="false" class="text-[11px]" />
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
  .curve(d3.curveCatmullRom.alpha(0.8))
  .x((d) => d[0])
  .y((d) => d[1])

const cardHeight = 60
const cardWidth = 120
const buffer = 16

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

function linkPosToPath(d) {
  const midPointOffset = 0.1
  const midX = (d.source.x + d.target.x) / 2
  const midY = (d.source.y + d.target.y) / 2
  const offsetX = (d.target.y - d.source.y) * midPointOffset
  const offsetY = (d.source.x - d.target.x) * midPointOffset
  return line([
    [d.source.x, d.source.y],
    [midX + offsetX, midY + offsetY],
    [d.target.x, d.target.y],
  ])
}

const linkToOpacity = function (l) {
  // use the date of the source node to determine opacity
  const date = new Date(l.source.time)
  const opacity = d3.scaleLinear().domain([0, 6]).range([1, 0.1])
  return opacity(date.getDay())
}

watch(combinedData, async () => {
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
    .slice(0, 250)

  scrapNodes.value = trimmedData

  const times = trimmedData.map((d) => new Date(d.time))
  const timeExtent = d3.extent(times)

  const timeScale = d3
    .scaleTime()
    .domain(timeExtent)
    .range([height.value, 0])

  scrapNodes.value.forEach((d) => {
    const time = new Date(d.time)
    const day = time.getDay()
    d.x = width.value * (day / 6) // Initialize x position based on day of the week
    d.y = timeScale(time) // Initialize y position based on timeScale
  })

  const weekLinks = []
  const weeks = d3.timeWeeks(d3.min(data, (d) => new Date(d.time)), d3.max(data, (d) => new Date(d.time)))

  weeks.forEach((week, i) => {
    const weekData = data.filter((d) => {
      const time = new Date(d.time)
      return time >= week && time < weeks[i + 1]
    })

    weekData.forEach((d, i) => {
      if (i === weekData.length - 1) return
      weekLinks.push({
        source: d,
        target: weekData[i + 1],
      })
    })

    scrapNodes.value.push({
      x: 10, // Set a fixed x position for week nodes
      y: timeScale(week), // Initialize y position based on timeScale
      radius: width.value * 0.025,
      time: week,
      id: `week-${i}`,
      type: 'week',
    })
    weekLinks.push({
      source: weekData[weekData.length - 1],
      target: scrapNodes.value[scrapNodes.value.length - 1],
    })
  })

  forceLinks.value = weekLinks

  forceSim.value = d3
    .forceSimulation(scrapNodes.value)
    .force('link', d3.forceLink(forceLinks.value).id((d) => d.id).strength(0.3).distance(200))
    .force('charge', d3.forceManyBody().strength(-12).distanceMax(200).distanceMin(50))
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
      const day = time.getDay()
      return width.value * (day / 6)
    }))
})

const dateToWeekLabel = (date) => {
  return format(new Date(date), 'MMM d yy')
}

</script>
<style>
#graph-svg {
  min-height: 840vh;
}

.scrap-node {
  will-change: transform;
}
</style>