<template>
  <main class="pt-16 dark:bg-gray-900 p-4">
    <ContentQuery path="/blog/" :sort="{ date: -1, modified: 1 }" v-slot="{ data }">
      <!-- featured article -->
      <div class="my-10 md:my-2 min-h-min pb-8">
        <div class="dark:bg-gray-900"></div>
        <div class="relative z-10 px-4 sm:px-6 lg:px-8 lg:py-40">
          <h2 class="text-sm font-semibold text-slate-500 tracking-wide uppercase">
            Latest blog post
            <span class="text-slate-400 dark:text-slate-600 pl-4">
              {{ formatDate(new Date(featuredArticle(data).date)) }}
            </span>
          </h2>
          <h1 class="text-4xl font-extrabold tracking-tight dark:text-white sm:text-5xl lg:text-9xl">
            {{ featuredArticle(data).title }}
          </h1>
          <p class="mt-6 max-w-3xl text-xl text-gray-400 dark:text-gray-300">
            {{ featuredArticle(data).dek }}
          </p>
          <div class="mt-10">
            <NuxtLink :to="featuredArticle(data)._path"
              class="text-base font-medium text-white dark:text-white bg-primary-500 dark:bg-slate-500 px-6 py-3 rounded-md shadow-lg">
              Read more
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="columns columns-1 md:columns-3 gap-4 lg:gap-5 xl:columns-5">
        <UCard v-for="article in blogIndexSort(blogIndexFilter(data))" :key="article._path" :class="[
          article.hidden ? 'hidden' : '',
          'opacity-80 xl:opacity-60 hover:opacity-100 transition duration-200 ease-in-out mb-4',
        ]">
          <div>
            <!-- do another contentquery and contentrenderer instead of contentdoc for this specific article in the list, so we can get additional data in the doc, like readingTime -->
            <ContentQuery :path="article._path" v-slot="{ data, toc }" find="one">
              <div
                class="flex justify-between items-center text-gray-400 dark:text-gray-600 text-xs md:text-sm mb-2 md:mb-4">
                <span v-if="article.modified">
                  {{ formatDate(new Date(article.modified)) }}
                </span>

                <span v-else>
                  {{ formatDate(new Date(article.date)) }}
                </span>

                <span class="" v-if="countPhotos(article) > 2">{{ countPhotos(article) }} photos</span>

                <span class="inline-block pr-2" v-if="data?.readingTime.minutes > 1">
                  <UIcon name="i-heroicons-solid-clock" color="gray" />
                  {{ data?.readingTime.text }}
                </span>
              </div>

              <NuxtLink :to="article._path" style="overflow-wrap: break-word"
                class="link font-bold text-gray-900 dark:text-gray-100 text-2xl md:text-3xl tracking-tight mb-2 md:mb-4 block hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200">
                {{ article.title }}</NuxtLink>

              <div class="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-2 md:mb-4"></div>

              <div class="text-gray-700 dark:text-gray-300 text-md max-w-prose">
                <div v-if="article.dek" class="font-light my-6">
                  {{ article.dek }}
                </div>
                <div v-else="article.description" class="dek">
                  {{ article.description }}
                </div>
              </div>

              <div class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                <div class="article-toc">
                  <ul class="list-none flex flex-wrap justify-start items-center">
                    <UButton v-for="link of article.body.toc.links" :key="link.id" color="gray"
                      class="mr-2 mb-2 font-light" size="xs" :to="`${article._path}#${link.id}`">
                      {{ link.text }}
                    </UButton>
                  </ul>
                </div>
              </div>
            </ContentQuery>
          </div>
        </UCard>
      </div>
    </ContentQuery>
  </main>
</template>
<script setup lang="ts">
import { countPhotos, filterStrongTags } from '~/helpers'
// import anime from "animejs/lib/anime.es.js";
import { timeFormat } from 'd3-time-format'

const formatDate = timeFormat('%B %d, %Y')

/* take in some articles loaded through content and filter them- they must have a `date` property, and if they are `hidden: true` we should remove them */
const blogIndexFilter = (articles) => {
  if (!articles) return
  return articles.filter((article) => {
    if (!article) return false

    return article.date && !article.hidden
  })
}

/* take in some articles loaded through content and sort them by date, some articles also have a `modified` date that should be used so that articles modified most recently are at the top - not all articles have `modified` properties, but all articles should have `date` properties */
const blogIndexSort = (articles) => {
  return articles.sort((a, b) => {
    if (a.modified && b.modified) {
      return new Date(b.modified) - new Date(a.modified)
    } else if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date)
    } else {
      return 0
    }
  })
}

function featuredArticle(data) {
  return blogIndexSort(blogIndexFilter(data))[0]
}
</script>
<style></style>
