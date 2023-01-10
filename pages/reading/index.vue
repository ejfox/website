<template>
  <main class="pt4 ma0">
    <Head>
      <Title>EJ Fox: 📖 Reading</Title>
    </Head>
    <ContentQuery path="/reading/" :sort="{date: -1}"  v-slot="{ data }">
      <div
        v-for="book in data"
        :key="book._path"
        class="w-20 w-10-l dib ma0 pa0 ba b--white overflow-hidden v-top"
      >
        <!-- <pre>{{ book['kindle-sync'] }}</pre> -->
        
        <!-- do another contentquery and contentrenderer instead of contentdoc for this specific article in the list, so we can get additional data in the doc, like readingTime -->
        <!-- <ContentQuery :path="book._path" v-slot="{ data }" find="one"> -->
          <!-- {{Object.keys(data[0])}} -->


          <NuxtLink
            :to="book._path"
            class="link"
            >
            <img
          :src="book['kindle-sync'].bookImageUrl"

          class=""
          />
          </NuxtLink
          >
        <!-- </ContentQuery> -->
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
  // use anime to animate the articles in
  nextTick(() => {
    // wait 100ms for the page to render
    anime({
      targets: ".article",
      opacity: [0, 1],
      translateX: ["-22vw", 0],
      easing: "easeOutQuad",
      duration: 620,
      delay: anime.stagger(220),
    });
  });
});
</script>
<style>
.headline-sans-serif {
  font-family: "Fjalla One", sans-serif;
}

.footnotes ul,
.footnotes ol {
  padding: 0;
  margin: 0;
  margin-left: 1rem;
  margin-right: 1rem;
}

@media screen and (min-width: 60em) {
  .footnotes ul,
  .footnotes ol {
    margin-left: 8rem;
  }
}

.footnotes li {
  list-style: none;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
</style>
