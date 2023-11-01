<template>
  <div class="dark:text-white">
    <svg ref="svg" class="w-screen h-screen"></svg>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { voronoi } from 'd3-voronoi';
import { format, subWeeks } from 'date-fns';
import { useMouse, useRafFn, useStorage, useWindowSize } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router'
import anime from 'animejs';
import hash from 'object-hash';

const svg = ref(null);
let combinedData = [];
const pending = ref(null)
const scrapByWeek = ref(null)

// Use VueUse function to get window size
const { width, height } = useWindowSize()

// const voronoiDiagram = computed(() => voronoi().x(d => d.x).y(d => d.y).extent([[0, 0], [width.value, height.value]]));

const { data: bookmarksData, pending: bookmarksPending, error: bookmarksError } = useFetch('/data/scrapbook/bookmarks.json', {
  server: false
});

const { data: mastodonData, pending: mastodonPending, error: mastodonError } = useFetch('/data/scrapbook/mastodon.json', {
  server: false
});

const { data: arenaData, pending: arenaPending, error: arenaError } = useFetch('/data/scrapbook/arena.json', {
  server: false
});

watchEffect(() => {
  if (!bookmarksPending.value && !mastodonPending.value && !arenaPending.value) {
    pending.value = false;
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
        images: status.media_attachments.map((attachment) => attachment.preview_url),
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
    ];
    // console.log(combinedData);
    scrapByWeek.value = scrapbookDataToWeeks(combinedData);
    renderSvg();
  }
});

function renderSvg() {
  const svgSelection = d3.select(svg.value);
  // The following line of code is creating an array of objects, where each object represents a position on the SVG canvas.
  // The 'map' function is used to iterate over each item in the 'combinedData' array.
  // For each item (represented by 'd'), it creates a new object.
  // This object has three properties: 'x', 'y', and 'data'.
  // The 'x' and 'y' properties represent the x and y coordinates of the position on the SVG canvas.
  // These coordinates are generated randomly using the 'Math.random' function, which returns a random number between 0 and 1.
  // This random number is then multiplied by the width and height of the SVG canvas (represented by 'width.value' and 'height.value') to get a random position within the canvas.
  // The 'data' property is set to the current item in the 'combinedData' array (represented by 'd').
  // This means that each position on the SVG canvas is associated with a specific item from the 'combinedData' array.
  const positions = combinedData.map((d, i) => ({ x: Math.random() * width.value, y: Math.random() * height.value, data: d }));

  let i = 0;
  const { pause, resume } = useRafFn(() => {
    if (i < positions.length) {
      const { x, y } = positions[i];
      addElement(x, y, positions[i].data);
      i++;
    } else {
      pause();
    }
  }, { immediate: true }); // Reduced interval for faster rendering
}

function drawVoronoi() {
  const svgSelection = d3.select(svg.value);

  // Calculate the Voronoi diagram based on the existing scraps
  const positions = addedScraps.value.map(d => [d.x, d.y]);
  
  // Check if there are positions to generate the Voronoi diagram from
  if (positions.length > 0) {
    const voronoiDiagram = voronoi().extent([[0, 0], [width.value, height.value]])(positions);

    // Find the cell with the largest area
    let largestArea = 0;
    let largestCell;
    voronoiDiagram.polygons().forEach(cell => {
      const area = d3.polygonArea(cell);
      if (area > largestArea) {
        largestArea = area;
        largestCell = cell;
      }
    });

    // Remove the old Voronoi diagram
    svgSelection.selectAll(".voronoi").remove();

    // Draw the new Voronoi diagram
    svgSelection.selectAll(".voronoi")
      .data(voronoiDiagram.polygons())
      .enter().append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; }) // Check if d is not null before joining
      .attr("class", "voronoi")
      .style("fill", d => d.data === largestCell.data ? "rgba(255,0,0,0.5)" : "none") // Fill the largest cell with red color
      .style("stroke", "#2077b4")
      .style("stroke-width", "1px");
  }
}

const addedScraps = ref([])

function addElement(posX, posY, data) {
  const id = hash(data);
  const storageKey = `scrap-position-${id}`;
  const positionStorage = useStorage(storageKey, null);

  // Add the new scrap to the addedScraps array with the given position
  addedScraps.value.push({ x: posX, y: posY, data: data });

  const svgSelection = d3.select(svg.value);
  const element = svgSelection.append('foreignObject')
    .attr('width', 200)
    .attr('height', 200)
    .attr('x', posX)
    .attr('y', posY)
    .append('xhtml:div')
    .classed('text-center text-white scrap-item bg-black bg-opacity-50 py-2 rounded-lg drop-shadow-lg text-xs cursor-pointer max-w-prose', true)
    .classed('hover:bg-opacity-75 transition-all duration-200 ease-in-out', true)
    .style('overflow', 'hidden')

  if (data.images && data.images.length > 0) {
    element.append('img')
      .attr('src', data.images[0])
      .attr('style', 'max-width: 172px');
  } else {
    element.text(data.description);
  }

  // Draw the Voronoi diagram
  drawVoronoi();
}

function scrapbookDataToWeeks(data) {
  if (!data.length) return null;
  const scrapByWeekMap = d3.group(data, (d) => {
    const date = new Date(d.time);
    const week = d3.timeWeek.floor(date);
    return week;
  });

  // sort scraps within each week in descending order of their time property
  scrapByWeekMap.forEach((scraps, week) => {
    scraps.sort((a, b) => new Date(b.time) - new Date(a.time));
  });

  // trim to only the selected year
  const selectedYear = 2023
  const scrapByWeekMapTrimmed = new Map();
  scrapByWeekMap.forEach((scraps, week) => {
    const year = format(week, 'yyyy');
    if (+year === +selectedYear) {
      scrapByWeekMapTrimmed.set(week, scraps);
    }
  });

  // return scrapByWeekMap;
  return scrapByWeekMapTrimmed
}
</script>
