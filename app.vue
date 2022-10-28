<template>
  <div id="app-container" class="sans-serif w-100">
    <Nav
      class="absolute mv4 mh0 w-100 overflow-hidden z-4 left-0 left-1-l top-0 pa1"
    />

    <div
      id="page-overlay"
      class="fixed top-0 left-0 w-100 h-100 z-3 overflow-hidden ma0"
      style=""
    >
      <canvas id="page-overlay-canvas" class="w-100 h-100 ma0 pa0"></canvas>
    </div>

    <div class="w-100 mt5">
      <!-- <NuxtPage :key="$route.fullPath" /> -->
      <NuxtPage />
    </div>
  </div>
</template>
<script setup>
import anime from "animejs/lib/anime.es.js";

const route = useRoute();
watch(route, (oldVal, newVal) => {
  if (newVal.hash !== "") return;
  nextTick(() => {
    // wait 100ms and then animateOverlayOut
    setTimeout(() => {
      animateOverlayOut();
    }, 100);
  });
});

function animateOverlayOut() {
  // anime({
  //     targets: '#page-overlay',
  //     opacity: [1, 0],
  //     easing: 'easeOutQuad',
  //     duration: 500,
  //     delay: 500,
  //   })
}

onMounted(() => {
  // draw a canvas on #page-overlay that is the size of the window
  // when a user clicks, animate a circle from their mouse x/y that slowly grows to take over the screen for 1000ms
  // then, when the animation is complete, remove the canvas

  // get the canvas element
  const canvas = document.getElementById("page-overlay-canvas");

  // set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // get canvas context
  const ctx = canvas.getContext("2d");

  // make sure the canvas is not transparent
  canvas.style.opacity = 1;

  // draw a circle at the mouse x/y
  function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFF";
    ctx.fill();
  }

  const body = document.querySelector("body");

  // when the user clicks, draw a circle at the mouse x/y
  // then, animate the circle to grow to the size of the window
  // then, remove the canvas
  // body.addEventListener('click', (e) => {

  //   // if the click event is not a link, then ignore it
  //   if (e.target.tagName !== 'A') return

  //   // if the target is a link to a hash on this page, then ignore it
  //   if (e.target.hash !== '') return

  //   const x = e.clientX
  //   const y = e.clientY
  //   const r = 0

  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   drawCircle(x, y, r)

  //   anime({
  //     targets: canvas,
  //     duration: 1000,
  //     // easing: 'easeInExpo',
  //     easing: 'easeInOutCirc',
  //     update: (anim) => {
  //       const r = anim.progress * Math.max(window.innerWidth, window.innerHeight) * 0.015
  //       drawCircle(x, y, r)
  //     },
  //     complete: () => {
  //       // clear the canvas
  //       // ctx.clearRect(0, 0, canvas.width, canvas.height)
  //     }
  //   })
  // })
});
</script>

<style>
.sans-serif {
  font-family: "Signika Negative", sans-serif !important;
}

img {
  width: 100%;
  height: auto;
}

figure {
  margin: 0;
  padding: 0;
}

#page-overlay {
  pointer-events: none;
}

#app-container {
  /* width: 100vw; */
}
</style>
