<template>
  <h1
    :id="id"
    class="f1 f-subheadline-l near-black lh-title ttu mt0 mv2 measure-narrow headline-sans-serif pa2 ml6-l"
  >
    <slot />
  </h1>
</template>
<script setup>
defineProps(["id"]);
</script>
<style scoped>
/* .f-headline-l {
  font-size: 9rem !important;
} */
.headline-sans-serif {
  font-family: "Fjalla One", sans-serif;
}
</style>
