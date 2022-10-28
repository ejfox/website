<template>
  <main class="pt4">
    <Head>
      <Title>EJ Fox: 📸 Photos</Title>
    </Head>
    <ContentQuery path="/photos/" :sort="{ date: -1 }" v-slot="{ data }">
      <div v-for="article in data" :key="article._path" class="">
        <ContentQuery
          :path="article._path"
          v-slot="{ data }"
          find="one"
          :limit="25"
        >
          <ContentRenderer :value="data">
            <NuxtLink :to="article._path" class="link">
              <ContentRendererMarkdown :value="data" />
            </NuxtLink>
          </ContentRenderer>
        </ContentQuery>
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
});

const formatDate = timeFormat("%B %d, %Y");

onMounted(() => {
  // use anime to animate the intro text
  // anime({
  //   targets: '.article',
  //   opacity: [0, 1],
  //   translateX: ['-22vw', 0],
  //   easing: 'easeOutQuad',
  //   duration: 720,
  //   delay: anime.stagger(250),
  // })
});
</script>
<style>
a:link,
a:hover {
  cursor: default;
}
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
