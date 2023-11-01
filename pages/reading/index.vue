<template>
  <main class="p-4 m-0 lg:p-14">

    <Head>
      <Title>EJ Fox: 📖 Reading</Title>
    </Head>
    <ContentQuery path="/reading/" :sort="{ modified: -1 }" v-slot="{ data }">
      <div class="grid grid-cols-3 sm:grid-cols-8 gap-4 lg:gap-6 xl:gap-8">
        <div v-for="book in data" :key="book._path" class="relative overflow-hidden aspect-w-1 aspect-h-1 text-center">
          <NuxtLink :to="book._path" class="block w-full h-full">
            <img :src="book['kindle-sync'].bookImageUrl"
              class="absolute inset-0 w-full h-full object-contain hover:shadow-lg transition-shadow-lg">
            <div
              class="book-title absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p class="text-xs lg:text-lg text-white bg-black bg-opacity-75 p-1 rounded">{{ book.title }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </ContentQuery>
  </main>
</template>
<script setup lang="ts">
import { countPhotos, filterStrongTags } from "~/helpers";
import anime from "animejs/lib/anime.es.js";
import { timeFormat } from "d3-time-format";

definePageMeta({
  documentDriven: false,
  pageTransition: false,
});

const formatDate = timeFormat("%B %d, %Y");

onMounted(() => {
  // use anime to animate the books in
  nextTick(() => {
    // wait 100ms for the page to render
    anime.timeline({
      // easing: "easeInOutQuad",
      // elastic
      easing: "easeOutElastic(1, .8)",
      duration: 420,
      delay: anime.stagger(40),
    })
      .add({
        targets: ".relative",
        opacity: [0, 1],
        scale: [0.25, 1],
      })
  });
});
</script>