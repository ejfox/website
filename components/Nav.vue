<template>
  <nav class="">
    <ul class="list ma0 pa1">
      <li class="pa2 db fl fw8 link red bg-white mr2 tracked">
        <!-- little red circle in html -->
        <!-- <span class="dib w1 h1 br-100 bg-red v-bottom"></span> -->
        <!-- little red circle in svg -->
        <svg
          id="nav-circle-svg"
          class="dib w1 h1 v-bottom pr2"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="5" id="nav-circle" />
        </svg>

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
// import { scaleLinear } from 'd3'
import anime from "animejs/lib/anime.es.js";

// definePageMeta({
//   keepAlive: true,
// });

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

  // make a loop where the red circle radius grows and shrinks
  anime({
    targets: "#nav-circle",
    fill: ["#ccc", "#999"],
    r: [45, 5],
    easing: "easeInOutCubic",
    duration: 4200,
    loop: true,
    direction: "alternate",
    // delay: 2500
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
  color: #E7040F
}
</style>
