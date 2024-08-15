<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
    <h1 class="text-white text-2xl mb-4">Conceptual Basins</h1>
    <ClientOnly>
      <div ref="p5Container"></div>
      <div class="mt-4 grid grid-cols-2 lg:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="text-white">Grid Size</label>
          <UInput v-model="gridSize" type="number" :max="maxGridSize" />
        </div>
        <div class="flex flex-col">
          <label class="text-white">Noise Scale</label>
          <UInput v-model="noiseScale" type="number" step="0.01" />
        </div>
        <div class="flex flex-col">
          <label class="text-white">Terrain Height</label>
          <UInput v-model="terrainHeight" type="number" />
        </div>
        <div class="flex flex-col">
          <label class="text-white">Rotation Speed</label>
          <URange v-model="rotationSpeed" type="number" step="0.001" />
        </div>
        <div class="flex flex-col">
          <label class="text-white">Terrain Zoom</label>
          <URange v-model="terrainZoom" type="number" step="0.1" min="0.1" />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core';

const { width, height } = useWindowSize()
const p5Container = ref(null);
let p5Instance = null;

console.log(width.value, height.value);

// Interactive controls
const gridSize = ref(72);
const noiseScale = ref(0.05);
const terrainHeight = ref(140);
const rotationSpeed = ref(0.005);
const maxGridSize = ref(Math.floor(Math.min(width.value, height.value) / 20));

const terrainZoom = ref(0.9)

// Other variables
const canvasWidth = width.value;
const canvasHeight = height.value;
let terrain = [];
let peakPoint = { x: 0, y: 0, z: 0 };
let valleyPoint = { x: 0, y: 0, z: 0 };
let midPoint = { x: 0, y: 0, z: 0 };
let angle = 0;
let font;

onMounted(async () => {
  if (process.client) {
    const p5 = await import('p5');

    const sketch = (p) => {
      p.preload = () => {
        font = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf');
      };

      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
        p.textFont(font);
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
        generateTerrain();
      };

      p.draw = () => {
        p.background(0);
        p.stroke(255, 50);
        p.noFill();

        p.rotateX(p.PI / 3);
        p.rotateZ(angle);
        angle += rotationSpeed.value;

        drawTerrain();
        drawPeakValleyConnection();
        drawLabel(peakPoint, "SPLIFF", [255, 0, 0]);
        drawLabel(valleyPoint, "JAVASCRIPT", [0, 0, 255]);
        drawLabel(midPoint, "OPTIMUM CREATIVITY", [0, 255, 0]);
      };

      function generateTerrain() {
        terrain = [];
        peakPoint = { x: 0, y: 0, z: -Infinity };
        valleyPoint = { x: 0, y: 0, z: Infinity };

        for (let y = 0; y < gridSize.value; y++) {
          terrain[y] = [];
          for (let x = 0; x < gridSize.value; x++) {
            let noiseVal = p.noise(x * noiseScale.value, y * noiseScale.value);
            let z = p.map(noiseVal, 0, 1, -terrainHeight.value / 2, terrainHeight.value / 2);
            terrain[y][x] = z;

            if (z > peakPoint.z) {
              peakPoint = { x, y, z };
            }
            if (z < valleyPoint.z) {
              valleyPoint = { x, y, z };
            }
          }
        }

        midPoint = {
          x: (peakPoint.x + valleyPoint.x) / 2,
          y: (peakPoint.y + valleyPoint.y) / 2,
          z: (peakPoint.z + valleyPoint.z) / 2
        };
      }

      function drawTerrain() {
        let s = canvasWidth / gridSize.value;
        p.beginShape(p.LINES);
        for (let y = 0; y < gridSize.value - 1; y++) {
          for (let x = 0; x < gridSize.value; x++) {
            p.vertex(x * s * terrainZoom.value - canvasWidth / 2, y * s * terrainZoom.value - canvasHeight / 2, terrain[y][x]);
            p.vertex(x * s * terrainZoom.value - canvasWidth / 2, (y + 1) * s * terrainZoom.value - canvasHeight / 2, terrain[y + 1][x]);
            if (x < gridSize.value - 1) {
              p.vertex(x * s * terrainZoom.value - canvasWidth / 2, y * s * terrainZoom.value - canvasHeight / 2, terrain[y][x]);
              p.vertex((x + 1) * s * terrainZoom.value - canvasWidth / 2, y * s * terrainZoom.value - canvasHeight / 2, terrain[y][x + 1]);
            }
          }
        }
        p.endShape();
      }

      function drawPeakValleyConnection() {
        let s = canvasWidth / gridSize.value;
        p.stroke(255, 255, 0);
        p.strokeWeight(2);
        p.line(
          peakPoint.x * s * terrainZoom.value - canvasWidth / 2, peakPoint.y * s * terrainZoom.value - canvasHeight / 2, peakPoint.z,
          valleyPoint.x * s * terrainZoom.value - canvasWidth / 2, valleyPoint.y * s * terrainZoom.value - canvasHeight / 2, valleyPoint.z
        );
        p.strokeWeight(1);
      }

      function drawLabel(point, text, color) {
        let s = canvasWidth / gridSize.value;
        p.push();
        p.translate(point.x * s * terrainZoom.value - canvasWidth / 2, point.y * s * terrainZoom.value - canvasHeight / 2, point.z);
        p.fill(color);
        p.noStroke();
        p.sphere(5);
        p.translate(0, -20, 0);

        p.rotateZ(-angle);
        p.rotateX(-p.PI / 3);

        p.fill(255);
        p.text(text, 0, 0);
        p.pop();
      }
    };

    p5Instance = new p5.default(sketch, p5Container.value);
  }
});

watch([gridSize, noiseScale, terrainHeight, terrainZoom], generateTerrain);

function generateTerrain() {
  if (p5Instance) {
    p5Instance.generateTerrain();
  }
}

onUnmounted(() => {
  if (process.client && p5Instance) {
    p5Instance.remove();
  }
});
</script>