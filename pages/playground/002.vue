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
          <!-- <Pixelation :granularity="pixelationAmount" /> -->
        </EffectComposer>
      </TresCanvas>
    </div>
  </div>
</template>

<script setup>
import { animate, createAnimatable, stagger } from "~/anime.esm.js";
import { scaleOrdinal } from 'd3'
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


const { combinedData: scraps } = useScrap();

// watch scraps, and when it is full of data, initSpheres
watch(scraps, (newVal) => {
  if (newVal.length > 0) {
    initSpheres();
  }
});

function onSphereHover(sphere) {
  // console.log('hover', sphere)
  // make this sphere twice as big
  const newSize = sphere.size * 2;

  // look for the sphere in the array and update it
  const index = spheres.value.findIndex((s) => s === sphere);
  if (index > -1) {
    spheres.value[index].size = newSize;
  }
}

// Initialize spheres at 0,0,0
const initSpheres = () => {

  const categoryColors = [
    "#ff6600",
    "#ff0066",
    "#6600ff",
    "#0066ff",
    "#00ff66",
    "#66ff00",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

  const scrapTypeCategoricalScale = scaleOrdinal()
    .domain(scraps.value.map((scrap) => scrap.type))
    .range(categoryColors);


  // make a sphere for every scrap
  scraps.value.forEach((scrap, index) => {
    const { x, y, z } = getRandom3DPosition(index);
    const size = 0.04;
    // color by scrap type
    const color = scrapTypeCategoricalScale(scrap.type);


    spheres.value.push({ x, y, z, size, color });
  });

};


const getRandom3DPosition = (index) => {
  const multiplier = 50;
  const x = noise3D(Math.random(), Math.random(), index) * multiplier;
  const y = noise3D(Math.random(), Math.random(), index) * multiplier;
  const z = noise3D(Math.random(), Math.random(), index) * multiplier;

  return { x, y, z };
};


onLoop(({ delta, elapsed }) => {
  // slowly rotate the sphere group on the x axis
  // sphereGroupRotation.value = {
  //   y: elapsed / 250,
  //   x: 0,
  //   z: 0,
  // };

  // cameraPosition.value = {
  //   x: cameraPosition.value.x,
  //   // y: cameraPosition.value.y + 0.001 * Math.sin(elapsed / 1000),
  //   y: cameraPosition.value.y + 0.025 * Math.sin(elapsed / 1000),
  //   // y: -elapsed / 25,
  //   z: cameraPosition.value.z - 0.01,
  // };

  // add a random circle around the camera
  // const { x, y, z } = getRandom3DPosition(elapsed);

  // get the current camera position
  // const { x, y, z } = cameraPosition.value;
  // // add a sphere at the current camera position
  // const radiusSize = 25;

  // // get a random position in the radius of the camera
  // const randomX = x + (Math.random() - 0.5) * radiusSize;
  // const randomY = y + (Math.random() - 0.5) * radiusSize;
  // const randomZ = z + (Math.random() - 0.5) * radiusSize;

  // // add a sphere at the random position
  // if (chance.bool()) {
  //   spheres.value.push({
  //     x: randomX,
  //     y: randomY,
  //     z: randomZ,
  //     size: 0.25,
  //     // color: "#ff6600",
  //     color: "#444",
  //   });
  // }



});
</script>

<style scoped></style>
