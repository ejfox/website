<template>
  <div class="dark:text-white" ref="parent">
    <svg ref="svg" class="w-full h-screen"></svg>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { voronoi } from 'd3-voronoi'
import { format, subWeeks } from 'date-fns'
import { useMouse, useRafFn, useStorage, useWindowSize } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import * as turf from '@turf/turf'
import anime from 'animejs'
import hash from 'object-hash'

const svg = ref(null)
let combinedData = []
const pending = ref(null)
const scrapByWeek = ref(null)

const intervalTime = 420

// Use VueUse function to get window size
// const { width, height } = useWindowSize()
const parent = ref(null)
const { width, height } = useElementSize(parent)

// const voronoiDiagram = computed(() => voronoi().x(d => d.x).y(d => d.y).extent([[0, 0], [width.value, height.value]]));

const {
  data: bookmarksData,
  pending: bookmarksPending,
  error: bookmarksError,
} = useFetch('/data/scrapbook/bookmarks.json', {
  server: false,
})

const {
  data: mastodonData,
  pending: mastodonPending,
  error: mastodonError,
} = useFetch('/data/scrapbook/mastodon.json', {
  server: false,
})

const {
  data: arenaData,
  pending: arenaPending,
  error: arenaError,
} = useFetch('/data/scrapbook/arena.json', {
  server: false,
})

watchEffect(() => {
  if (
    !bookmarksPending.value &&
    !mastodonPending.value &&
    !arenaPending.value
  ) {
    pending.value = false
    combinedData = [
      ...(bookmarksData.value || []).map((bookmark) => ({
        id: bookmark.id,
        href: bookmark.href,
        description: bookmark.description,
        content: bookmark.extended,
        time: bookmark.time,
        type: 'pinboard',
        ...bookmark,
      })),
      ...(mastodonData.value || []).map((status) => ({
        id: status.id,
        href: status.url,
        // content: status.content, // this includes HTML
        // instead we want to sanitize the HTML and get the text
        description: status.content.replace(/<[^>]*>?/gm, ''),
        time: status.created_at,
        type: 'mastodon',
        images: status.media_attachments.map(
          (attachment) => attachment.preview_url,
        ),
      })),
      ...(arenaData.value || []).map((block) => ({
        id: block.id,
        // href: block.source?.url || null,
        // link to the arena page for now
        href: `https://www.are.na/block/${block.id}`,
        content: block.description,
        time: block.created_at,
        type: 'arena',
        images: block.image ? [block.image.display.url] : [],
      })),
    ]

    // sort so most recent are at the top
    combinedData.sort((a, b) => new Date(b.time) - new Date(a.time))

    // filter combinedData to only images
    combinedData = combinedData.filter((d) => d.images && d.images.length > 0)

    // console.log(combinedData);
    scrapByWeek.value = scrapbookDataToWeeks(combinedData)
    renderSvg()
  }
})

let i = 0
function renderSvg() {
  const positions = combinedData.map((d, i) => ({
    x: Math.random() * width.value * 0.8,
    y: Math.random() * height.value * 0.8,
    data: d,
  }))

  // const { pause, resume } = useRafFn(() => {
  //   if (i < positions.length) {
  //     const { x, y } = positions[i];
  //     addElement(positions[i].data);
  //     i++;
  //     // Add a delay between each image rendering
  //   }
  // }, { immediate: true });

  // use setInterval to add a new element every 100ms
  setInterval(() => {
    if (i < positions.length) {
      const { x, y } = positions[i]
      addElement(positions[i].data)
      i++
      // Add a delay between each image rendering
    }
  }, intervalTime)
}

function drawVoronoi() {
  const svgSelection = d3.select(svg.value)

  // Calculate the Voronoi diagram based on the existing scraps
  const positions = addedScraps.value.map((d) => [d.x, d.y])

  // Check if there are positions to generate the Voronoi diagram from
  if (positions.length > 0) {
    const voronoiDiagram = voronoi().extent([
      [0, 0],
      [width.value, height.value],
    ])(positions)

    // Find the cell with the largest area
    let largestArea = 0
    let largestCell
    voronoiDiagram.polygons().forEach((cell) => {
      const area = d3.polygonArea(cell)
      if (area > largestArea) {
        largestArea = area
        largestCell = cell
      }
    })

    // Remove the old Voronoi diagram
    svgSelection.selectAll('.voronoi').remove()

    // Draw the new Voronoi diagram
    svgSelection
      .selectAll('.voronoi')
      .data(voronoiDiagram.polygons())
      .enter()
      .append('path')
      .attr('d', function (d) {
        return d ? 'M' + d.join('L') + 'Z' : null
      }) // Check if d is not null before joining
      .attr('class', 'voronoi')
      // .style("fill", d => d.data === largestCell.data ? "rgba(3,3,3,0.1)" : "none") // Fill the largest cell with red color
      .style('fill', 'none')
      .style('stroke', 'rgba(255,255,255,0.5)')
      .style('opacity', 0.25)
      .style('stroke-width', '1px')
  }
}

function getLargestCell() {
  const positions = addedScraps.value.map((d) => [d.x, d.y])

  if (positions.length > 0) {
    const voronoiDiagram = voronoi().extent([
      [0, 0],
      [width.value, height.value],
    ])(positions)

    let largestArea = 0
    let largestCell
    voronoiDiagram.polygons().forEach((cell) => {
      const area = d3.polygonArea(cell)
      if (area > largestArea) {
        largestArea = area
        largestCell = cell
      }
    })

    return largestCell
  }

  return null
}

const addedScraps = ref([])

// function getRandomPositionInCell(cell) {
//   const [minX, minY] = d3.polygonHull(cell).reduce(([minX, minY], [x, y]) => [Math.min(minX, x), Math.min(minY, y)], [Infinity, Infinity]);
//   const [maxX, maxY] = d3.polygonHull(cell).reduce(([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)], [-Infinity, -Infinity]);
//   const posX = minX + Math.random() * (maxX - minX);
//   const posY = minY + Math.random() * (maxY - minY);
//   // ensure image is not too close to the edge
//   const tooClose = 50
//   if (posX < tooClose) posX = tooClose;
//   if (posX > width.value - tooClose) posX = width.value - tooClose;
//   if (posY < tooClose) posY = tooClose;
//   if (posY > height.value - tooClose) posY = height.value - tooClose;
//   return [posX, posY];
// }

// refactor to use turf centerOfMass to find the center of mass of the cell
function getCenterOfMass(cell) {
  // // a cell is an array of arrays of [x, y] coordinates
  // // usually it has 4 - and we need to convert that to a GeoJSON polygon
  // console.log('cell', cell)
  // const cellGeoJson = turf.polygon(cell);
  // console.log('cellGeoJson', cellGeoJson)

  // const centerOfMass = turf.centerOfMass(cellGeoJson);
  // return centerOfMass;
  return cell[cell.length - 1]
}

function addElement(data) {
  const id = hash(data)
  const storageKey = `scrap-position-${id}`
  const positionStorage = useStorage(storageKey, null)

  let posX, posY

  // If there are already scraps, calculate the centroid of the largest cell
  if (addedScraps.value.length > 0) {
    const largestCell = getLargestCell()
    if (largestCell) {
      // [posX, posY] = getRandomPositionInCell(largestCell);
      ;[posX, posY] = getCenterOfMass(largestCell)
    }
  } else {
    // If there are no scraps yet, generate random position
    posX = Math.random() * width.value
    posY = Math.random() * height.value
  }

  // Add the new scrap to the addedScraps array with the given position
  addedScraps.value.push({ x: posX, y: posY, data: data })

  const { width: pageWidth, height: pageHeight } = useWindowSize()

  const svgSelection = d3.select(svg.value)
  const element = svgSelection
    .append('foreignObject')
    .attr('width', 500)
    .attr('height', 500)
    .attr('x', posX)
    .attr('y', posY)
    .append('xhtml:div')
    .classed(
      'text-center text-white scrap-item py-2 rounded-lg  text-xs cursor-pointer',
      true,
    )
    .classed(
      'hover:bg-opacity-75 transition-all duration-200 ease-in-out',
      true,
    )
    .style('overflow', 'hidden')

  if (data.images && data.images.length > 0) {
    element
      .append('img')
      .classed('rounded drop-shadow-lg', true)
      .attr('src', data.images[0])
      // .attr('style', 'max-width: 92px');
      .attr('style', 'max-width: 29vw')
  } else {
    element.text(data.description)
  }

  // Draw the Voronoi diagram
  drawVoronoi()
}

function scrapbookDataToWeeks(data) {
  if (!data.length) return null
  const scrapByWeekMap = d3.group(data, (d) => {
    const date = new Date(d.time)
    const week = d3.timeWeek.floor(date)
    return week
  })

  // sort scraps within each week in descending order of their time property
  scrapByWeekMap.forEach((scraps, week) => {
    scraps.sort((a, b) => new Date(b.time) - new Date(a.time))
  })

  // trim to only the selected year
  const selectedYear = 2023
  const scrapByWeekMapTrimmed = new Map()
  scrapByWeekMap.forEach((scraps, week) => {
    const year = format(week, 'yyyy')
    if (+year === +selectedYear) {
      scrapByWeekMapTrimmed.set(week, scraps)
    }
  })

  // return scrapByWeekMap;
  return scrapByWeekMapTrimmed
}
</script>
