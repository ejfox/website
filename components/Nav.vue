<template>
  <nav class="mt4">
    <ul class="list ma0 pa0 ml6 db cf w-50">
      <li class="pv2 db fl fw8 link red bg-white mr2 tracked mr4">
        <span class="dib v-top">EJ Fox</span>
      </li>

      <NuxtLink
        class="pa2 db fl fw4 link bg-white black mr2 pointer"
        tag="li"
        to="/"
        >🏠 Home</NuxtLink
      >
      <NuxtLink
        class="pa2 db fl fw4 link bg-white black mr2 pointer"
        tag="li"
        to="/projects"
        >📋 Projects</NuxtLink
      >
      <NuxtLink
        class="pa2 db fl fw4 link bg-white black mr2 pointer"
        tag="li"
        to="/blog/"
        >📝 Blog</NuxtLink
      >
      <!-- <NuxtLink class="pa2 db fl fw4 link black bg-white mr3 mr4-l" tag="li" to="/photos/">Photos</NuxtLink> -->
    </ul>
  </nav>
</template>
<script setup>
import anime from "animejs/lib/anime.es.js";

onMounted(() => {
  // use anime to animate the intro text
  anime({
    targets: "nav a",
    opacity: [0, 1],
    translateX: ["-400%", 0],
    backgroundColor: ["#fff", "rgba(255,255,255,0."],
    easing: "easeOutQuad",
    duration: 550,
    delay: anime.stagger(170),
  });
});
</script>
<style>
nav a {
  transition: all 2ms ease-out;
}
#nav-circle-svg {
  height: 0.7em;
  width: 0.7em;
}

#nav-circle {
  fill: transparent;
  stroke: #ccc;
  stroke-width: 10;
}

.router-link-active {
  /* color: red; */
  /* color: #E7040F */
  font-weight: 800;
}
</style>
