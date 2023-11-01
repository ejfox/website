<template>
  <div class="dark:text-white">
    <svg ref="svg" class="w-screen h-screen"></svg>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import { useStorage } from '@vueuse/core';

const svg = ref(null);
let data = [
  { id: 1, x: 50, y: 50, width: 100, height: 100, fill: 'red' },
  { id: 2, x: 150, y: 150, width: 100, height: 100, fill: 'blue' },
  { id: 3, x: 250, y: 250, width: 100, height: 100, fill: 'green' },
];

// Check if positions exist in local storage and use them
data = data.map((d) => {
  const objectPosition = useStorage(`objectPosition-${d.id}`, { x: d.x, y: d.y });
  return { ...d, x: objectPosition.value.x, y: objectPosition.value.y };
});

onMounted(() => {
  const svgSelection = d3.select(svg.value);
  const objects = svgSelection.selectAll('foreignObject')
    .data(data)
    .enter()
    .append(() => document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'))
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .append('xhtml:div')
    .style('width', '100%')
    .style('height', '100%')
    .style('background-color', (d) => d.fill);

  const dragHandler = d3.drag()
    .on('start', function(event, d) {
      d3.select(this)
        .style('background-color', 'black');
    })
    .on('drag', function(event, d) {
      d3.select(this.parentNode)
        .attr('x', event.x)
        .attr('y', event.y);
      const objectPosition = useStorage(`objectPosition-${d.id}`, { x: d.x, y: d.y });
      objectPosition.value = { x: event.x, y: event.y };
    })
    .on('end', function(event, d) {
      d3.select(this)
        .style('background-color', d.fill);
    });

  objects.call(dragHandler);
});
</script>