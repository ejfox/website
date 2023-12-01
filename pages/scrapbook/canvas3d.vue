<script setup>
const { onLoop } = useRenderLoop()

let cubes = ref(Array(5).fill().map((_, index) => {
  return {
    position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    label: `Hypercard ${index + 1}`,
  }
}));

</script>

<template>
  <div>
    <h1>Hello world</h1>
    <TresCanvas window-size>
      <TresPerspectiveCamera :position="[5, 5, 5]" />
      <OrbitControls />
      <TresMesh v-for="(cube, index) in cubes" :key="index" :position="cube.position" :rotation="cube.rotation">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshBasicMaterial color="#82DBC5" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[0, 2, 4]" :intensity="1" />
    </TresCanvas>
  </div>
</template>

<style scoped>
.label {
  position: absolute;
  transform-style: preserve-3d;
  color: #000;
  background: #fff;
  padding: 5px;
  border-radius: 5px;
}
</style>