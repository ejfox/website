<template>
  <main class="pt4 ma0">

    <Head>
      <Title>EJ Fox: 📝 Blog</Title>
    </Head>
    <ContentQuery path="/blog/" :sort="{ date: -1 }" v-slot="{ data }">
      <div v-for="article in data" :key="article._path"
        class="article bg-white w-100 w-50-l dib v-top mb4 mb6-l pa2 pa4-l pb4 pv0-l bn-l pr6-l overflow-hidden bb b--light-gray">
        <!-- do another contentquery and contentrenderer instead of contentdoc for this specific article in the list, so we can get additional data in the doc, like readingTime -->
        <ContentQuery :path="article._path" v-slot="{ data, toc }" find="one">
          <!-- {{Object.keys(data[0])}} -->

          <small class="mv0 pv0 gray fw7">{{
              formatDate(new Date(article.date))
          }}</small>

          <NuxtLink :to="article._path"
            class="link b near-black dim db pv2 f2 f1-l lh-solid ttu word-wrap pr headline-sans-serif mv0">{{ article.title
            }}</NuxtLink>

          <div class="reading-time moon-gray mb2 fw1 pr2">
            <span class="dib pr2" v-if="data?.readingTime.minutes > 1">
              {{ data?.readingTime.text }}
            </span>

            <span class="dib pr2" v-if="countPhotos(article) > 2">{{ countPhotos(article) }} photos</span>
          </div>

          <div class="gray f6">
            <!-- <pre>{{ article.body.toc }}</pre> -->
            <div class="article-toc" v-if="article.body.toc.links.length">
              <ul class="list w-100 f5 fr ml2 ml5-ns">
                <li v-for="link of article.body.toc.links" :key="link.id" class="mv1 pa1 dib mr2 ba br2 b--light-gray">
                  <a :href="`${article._path}#${link.id}`" class="link gray
                  ">
                  {{ link.text }}</a>
                </li>
              </ul>
            </div>
            <div v-else>
              <div v-if="article.dek" class="dek fw3">{{ article.dek }}</div>
              <div v-else="article.description" class="dek">
                {{ article.description }}
              </div>
            </div>
          </div>
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
