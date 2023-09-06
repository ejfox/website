<template>
  <main class="pt4 ma0">

    <Head>
      <Title>EJ Fox: 📝 Blog</Title>
    </Head>
    <ContentQuery path="/blog/" :sort="{ date: -1, modified: 1 }" v-slot="{ data }">
      <article v-for="article in blogIndexSort(blogIndexFilter(data))" :key="article._path"
        :class="['index-article article bg-white w-100 w-third-l v-top mb4-l mb3-l pa2 pa3-ns pa4-l pb4-l pv0-l bn-l pr2-l overflow-hidden', article.hidden ? 'dn' : 'dib']">
        <div>
          <!-- do another contentquery and contentrenderer instead of contentdoc for this specific article in the list, so we can get additional data in the doc, like readingTime -->
          <ContentQuery :path="article._path" v-slot="{ data, toc }" find="one">


            <NuxtLink :to="article._path" style="overflow-wrap: break-word;"
              class="link b near-black db pv2 f2 f1-l lh-title ttu word-wrap pr headline-sans-serif mv0 article-title-link pointer">
              {{
                article.title
              }}</NuxtLink>

            <small class="mv0 pv0 moon-gray fw5 f6" v-if="article.modified">
              {{ formatDate(new Date(article.modified)) }}
            </small>

            <small class="mv0 pv0 moon-gray fw5 f6" v-else>
              {{ formatDate(new Date(article.date)) }}
            </small>

            <div class="reading-time moon-gray mb2 fw1 pr2 f6">
              <span class="dib pr2" v-if="data?.readingTime.minutes > 1">
                {{ data?.readingTime.text }}
              </span>

              <span class="dib pr2" v-if="countPhotos(article) > 2">{{ countPhotos(article) }} photos</span>
            </div>

            <div class="fw3 pv2 i">
              <div v-if="article.dek" class="dek">{{ article.dek }}</div>
              <div v-else="article.description" class="dek">
                {{ article.description }}
              </div>
            </div>

            <div class="gray f6">
              <div class="article-toc">
                <ul class="list w-100 f6 fw3 f5-l fr ml2 ml5-ns mv0 mv1-l">
                  <li v-for="link of article.body.toc.links" :key="link.id"
                    class="mv1 pa1 ph2 dib mr2 ba br2 b--near-white dim">
                    <a :href="`${article._path}#${link.id}`" class="link gray
                    ">
                      {{ link.text }}</a>
                  </li>
                </ul>
              </div>

            </div>
          </ContentQuery>
        </div>
      </article>
    </ContentQuery>
  </main>
</template>
<script setup lang="ts">
import { countPhotos, filterStrongTags } from "~/helpers";
// import anime from "animejs/lib/anime.es.js";
import { timeFormat } from "d3-time-format";

definePageMeta({
  documentDriven: false,
  pageTransition: false,
});

const formatDate = timeFormat("%B %d, %Y");

/* take in some articles loaded through content and filter them- they must have a `date` property, and if they are `hidden: true` we should remove them */
const blogIndexFilter = (articles) => {
  if (!articles) return
  return articles.filter((article) => {
    if (!article) return false;

    return article.date && !article.hidden;
  });
};

/* take in some articles loaded through content and sort them by date, some articles also have a `modified` date that should be used so that articles modified most recently are at the top - not all articles have `modified` properties, but all articles should have `date` properties */
const blogIndexSort = (articles) => {
  return articles.sort((a, b) => {
    if (a.modified && b.modified) {
      return new Date(b.modified) - new Date(a.modified);
    } else if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    } else {
      return 0;
    }
  });
};

onMounted(() => {
  // use anime to animate the articles in
  nextTick(() => {
    // wait 100ms for the page to render
    // anime({
    //   targets: ".article",
    //   opacity: [0, 1],
    //   translateX: ["-22vw", 0],
    //   easing: "easeOutQuad",
    //   duration: 620,
    //   delay: anime.stagger(220),
    // });
  });
});
</script>
<style>
.article-title-link {
  transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  transition: transform 1s cubic-bezier(0.25, 0.8, 0.25, 1), text-shadow 0.3s ease;
}

.article-title-link:hover {
  transform: translate3d(0, -2px, 0) scale3d(1.005, 1.005, 1);
  /* text-shadow transitions quicker for a slight lead-in effect */
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), text-shadow 0.15s ease;
}

.article-title-link:active {
  transform: translate3d(0, -2px, 0) scale3d(1.02, 1.02, 1);
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
  transition: transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1), text-shadow 0.15s ease;
  outline: none;
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

.index-article .article-toc ul,
.index-article .article-toc ol {
  margin-left: 0 !important;
}
</style>
