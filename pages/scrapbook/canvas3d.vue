<script setup>
const { onLoop } = useRenderLoop()

</script>

<template>
  <div>
    <h1>Hello world</h1>
    <TresCanvas window-size>
      <TresPerspectiveCamera :position="[5, 5, 5]" />
      <OrbitControls />
      <TresMesh :position="[-2, 2, 0]" :rotation="[0, Math.PI, 0]">
        <TresConeGeometry :args="[1, 1.5, 3]" />
        <TresMeshToonMaterial color="#82DBC5" />
      </TresMesh>
      <EffectComposer>
        <Bloom />
      </EffectComposer>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[0, 2, 4]" :intensity="1" />
    </TresCanvas>
  </div>
</template>