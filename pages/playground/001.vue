<template>
  <div class="">
    <div class="absolute -z-10 left-0 top-0 pointer-events-none">
      <TresCanvas window-size alpha shadows class="pointer-events-none opacity-50"
        style="pointer-events: none !important">
        <TresPerspectiveCamera ref="cam" :position="[cameraPosition.x, cameraPosition.y, cameraPosition.z]" :fov="50"
          :near="0.4" :far="1000" />


        <TresGroup :rotation="[
          sphereGroupRotation.x,
          sphereGroupRotation.y,
          sphereGroupRotation.z,
        ]">
          <TresMesh v-for="sphere in spheres" :position="[sphere.x, sphere.y, sphere.z]">
            <TresSphereGeometry :args="[sphere.size]" />
            <TresMeshBasicMaterial :color="sphere.color" :opacity="0.9" />
          </TresMesh>
        </TresGroup>

        <EffectComposer>
          <Pixelation :granularity="pixelationAmount" />
        </EffectComposer>
      </TresCanvas>
    </div>
  </div>
</template>

<script setup>
import { animate, createAnimatable, stagger } from "~/anime.esm.js";
import { TresCanvas, useLoader, extend } from "@tresjs/core";
import Chance from "chance";

import { createNoise3D } from "simplex-noise";
import {
  EffectComposer,
  DepthOfField,
  Glitch,
  Noise,
  Outline,
  Pixelation,
  Vignette,
} from "@tresjs/post-processing";

const cameraPosition = ref({ x: 0, y: 0, z: 1 });
const cam = shallowRef(null);
const sphereGroupRotation = ref({ x: 0, y: 0, z: 0 });
const noise3D = createNoise3D();
const spheres = ref([]);
const { onLoop } = useRenderLoop();
const { y } = useWindowScroll();
const { x: mouseX, y: mouseY } = useMouse();
import { useRoute } from "vue-router";
const route = useRoute();

// init chance
const chance = new Chance();

// Initialize spheres at 0,0,0
const initSpheres = () => {
  const numSpheres = 150; // Number of spheres to generate

  for (let i = 0; i < numSpheres; i++) {

    const color = Math.random() > 0.98 ? '#ff6600' : '#444'
    // const color = "#999";

    const { z: randomZ } = getRandom3DPosition(i);

    // place the spheres in huge grid with the center at 0,0
    const gridAmt = 25;
    const gridPad = 0.5;
    const gridOffset = (gridAmt * gridPad) / 2;
    const x = 5 + (i % gridAmt) * gridPad - gridOffset;
    const y = Math.floor(i / gridAmt) * gridPad - gridOffset + 8;
    // const z = -20 + (i % gridAmt) * gridPad - gridOffset;
    const z = randomZ
    const size = 0.04;
    // const size = Math.sqrt(z) * 5;

    // spheres.value.push({ x: 0, y: 0, z: 0, size, color });
    spheres.value.push({ x, y, z, size, color });
  }
};


const getRandom3DPosition = (index) => {
  const multiplier = 50;
  const x = noise3D(Math.random(), Math.random(), index) * multiplier;
  const y = noise3D(Math.random(), Math.random(), index) * multiplier;
  const z = noise3D(Math.random(), Math.random(), index) * multiplier;

  return { x, y, z };
};

let camAnimation;
onMounted(() => {
  initSpheres();

  camAnimation = createAnimatable(cameraPosition.value, {
    x: 0,
    y: 0,
    z: 0,
    duration: 3200,
    ease: "out(10)",
  });


});


// watch the route and when it changes, push the spheres around a bit
// watch(route, (newRoute, oldRoute) => {
//   distributeSpheresRandomly();
// });

const pixelationAmount = ref(0);

// watch the scroll and animate the camera using the scroll position
// watch(y, (newY, oldY) => {
//   // animate the camera position based on the scroll position
//   camAnimation.y(newY * 0.00025);
// });


// make the pixelation decrease as the y increases
// const pixelationAmount = computed(() => {
//   // return 22 - y.value / 75
//   return 0;
// });

onLoop(({ delta, elapsed }) => {
  // slowly rotate the sphere group on the x axis
  // sphereGroupRotation.value = {
  //   y: elapsed / 250,
  //   x: 0,
  //   z: 0,
  // };

  cameraPosition.value = {
    x: cameraPosition.value.x,
    // y: cameraPosition.value.y + 0.001 * Math.sin(elapsed / 1000),
    y: cameraPosition.value.y + 0.025 * Math.sin(elapsed / 1000),
    // y: -elapsed / 25,
    z: cameraPosition.value.z - 0.01,
  };

  // add a random circle around the camera
  // const { x, y, z } = getRandom3DPosition(elapsed);

  // get the current camera position
  const { x, y, z } = cameraPosition.value;
  // add a sphere at the current camera position
  const radiusSize = 25;

  // get a random position in the radius of the camera
  const randomX = x + (Math.random() - 0.5) * radiusSize;
  const randomY = y + (Math.random() - 0.5) * radiusSize;
  const randomZ = z + (Math.random() - 0.5) * radiusSize;

  // add a sphere at the random position
  if (chance.bool()) {
    spheres.value.push({
      x: randomX,
      y: randomY,
      z: randomZ,
      size: 0.25,
      // color: "#ff6600",
      color: "#444",
    });
  }



});
</script>

<style scoped>
.bg-with-texture {
  background: url("/bg_texture.png");
  /* background-size: cover; */
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #f5f5f5;
  /* min-height: 100vh; */
  position: relative;
  overflow: hidden;
}
</style>
