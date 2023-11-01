<template>
  <div class="dark:text-white">
    <svg ref="svg" class="w-screen h-screen"></svg>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { voronoi } from 'd3-voronoi';
import { format, subWeeks } from 'date-fns';
import { useMouse, useRafFn, useStorage } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router'
import anime from 'animejs';
import hash from 'object-hash';

const svg = ref(null);
let combinedData = [];
const pending = ref(null)
const scrapByWeek = ref(null)

const { width, height } = useWindowSize()

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
  const radiusIncrement = 3; // Adjust this value to change the spacing between spiral arms
  const angleIncrement = 0.09; // Adjust this value to change the tightness of the spiral

  let i = 0;
  const { pause, resume } = useRafFn(() => {
    if (i < combinedData.length) {
      const angle = angleIncrement * i;
      const radius = radiusIncrement * i;
      const x = width.value / 2 + radius * Math.cos(angle);
      const y = height.value / 2 + radius * Math.sin(angle);
      addElement(x, y, combinedData[i]);
      i++;
    } else {
      pause();
    }
  }, { immediate: true }); // Reduced interval for faster rendering
}

// Voronoi diagram for smart positioning
let voronoiDiagram = voronoi()
  .x((d) => d.x)
  .y((d) => d.y)
  .extent([[0, 0], [width.value, height.value]]);

function addElement(posX, posY, data) {
  const id = hash(data);
  const storageKey = `scrap-position-${id}`;
  const positionStorage = useStorage(storageKey, null);
  const storedPosition = positionStorage.value;

  // If no stored position, calculate a new one
  if (!storedPosition) {
    const positions = combinedData.map((d) => ({ x: d.x, y: d.y }));
    const diagram = voronoiDiagram(positions);
    const emptyCell = diagram.cells.find((cell) => cell && cell.site && cell.site.data === undefined);
    if (emptyCell && emptyCell.site) {
      positionStorage.value = { x: emptyCell.site.x, y: emptyCell.site.y };
    }
  }

  const svgSelection = d3.select(svg.value);
  const element = svgSelection.append('foreignObject')
    .attr('width', 200)
    .attr('height', 200)
    .attr('x', posX)
    .attr('y', posY)
    .append('xhtml:div')
    .classed('text-center scrap-item bg-black bg-opacity-50 py-2 rounded-lg drop-shadow-lg text-xs cursor-pointer max-w-prose', true)
    .classed('hover:bg-opacity-75 transition-all duration-200 ease-in-out', true)
    .style('overflow', 'hidden')

  if (data.images && data.images.length > 0) {
    element.append('img')
      .attr('src', data.images[0])
      .attr('style', 'max-width: 172px');
  } else {
    element.text(data.description);
  }

  // Add anime.js animation
  // anime({
  //   targets: element.node(),
  //   scale: [0.1, 1],
  //   opacity: [0, 1],
  //   easing: 'easeOutQuad',
  //   duration: 800,
  // });

  // Add d3 drag behavior
  const drag = d3.drag()
    .on("start", function() {
      d3.select(this).raise().classed("active", true);
    })
    .on("drag", function(event, d) {
      const newX = event.x;
      const newY = event.y;
      d3.select(this.parentNode)
        .attr('x', newX)
        .attr('y', newY);
      positionStorage.value = { x: newX, y: newY };
    })
    .on("end", function() {
      d3.select(this).classed("active", false);
    });

  element.call(drag);
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