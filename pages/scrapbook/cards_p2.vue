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
import { useRafFn, useElementSize } from '@vueuse/core';
import useScrap from '~/composables/useScrap.js';
import p2 from 'p2';

const world = new p2.World({
  gravity: [0, 0] // No gravity in the world setup
});

const { combinedData } = useScrap();
const scrapNodes = ref([]);
const scrapgraphcontainer = ref(null);
const { width, height } = useElementSize(scrapgraphcontainer);
const scrapels = ref([]);
const scrapSizes = ref([]);

// Function to update physics bodies or create new ones if they don't exist
const setupPhysics = () => {
  scrapNodes.value.forEach((node, index) => {
    const size = scrapSizes.value[index];
    if (node.body) {
      // Update existing body shape if it exists
      node.body.shapes[0].width = size.width;
      node.body.shapes[0].height = size.height;
    } else {
      // Create a new physics body if it doesn't exist
      const body = new p2.Body({
        mass: 1,
        position: [node.x, node.y],
        damping: 0.7,
      });
      const shape = new p2.Box({
        width: size.width,
        height: size.height
      });
      body.addShape(shape);
      world.addBody(body);
      node.body = body;
    }
  });
};

// Observe combinedData to initialize scrapNodes
watch(combinedData, (newData) => {
  scrapNodes.value = newData.slice(0, 50).map(data => ({
    x: Math.random() * width.value,
    y: Math.random() * height.value,
    ...data,
    body: null
  }));
}, { immediate: true });

// Physics update loop using RAF
const { pause, resume } = useRafFn(() => {
  // console.log('raf')
  world.step(1);  // Simulation step
  scrapNodes.value.forEach(node => {
    console.log(node.body)
    if (node.body) {
      node.x = node.body.position[0];
      node.y = node.body.position[1];
    }
  });
}, { immediate: false });

// Watch for changes in scrapSizes to update physics bodies
watch(scrapSizes, (newSizes) => {
  setupPhysics();
  resume(); // Resume physics simulation after updating sizes
}, { immediate: true, deep: true });

// Monitor scrapels to update sizes
onMounted(() => {
  watch(scrapels, () => {
    console.log('scrapels', scrapels.value)
    scrapSizes.value = scrapels.value.map(el => {
      console.log({el})
      // const rect = el.getBoundingClientRect();
      return { width: el.width, height: el.height };
    });
    // Ensure physics bodies are updated after sizes are known
    setupPhysics();
    resume()
  }, { immediate: true });
});
</script>

<style>
#scrapgraphcontainer {
  /* min-height: 500vh; */
  min-height: 100vh;
}
</style>
