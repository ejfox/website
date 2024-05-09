<template>
  <main class="dark:bg-gray-900 p-2 md:p-4">
    <!-- year navigation -->
    <div class="flex flex-col mb-4 sticky md:relative lg:relative backdrop-filter backdrop-blur-lg top-0 z-30">
      <div class="flex justify-between items-stretch">
        <!-- filter by year on and off -->
        <UButton icon="i-heroicons-rectangle-stack-20-solid" :trailing="true" color="gray" class="my-4"
          @click="filterByYear = !filterByYear">
          {{ filterByYear ? 'See all posts' : 'Filter by year' }}
        </UButton>
      </div>
      <div v-if="filterByYear" class="flex flex-wrap mt-2 align-middle">
        <UIcon name="i-heroicons-calendar-days" class="m-1 mr-3 text-2xl align-middle" />
        <UButton v-for="availableYear in blogYears" :class="[
          availableYear === blogYear
            ? 'bg-primary-500 dark:bg-slate-500 text-white dark:text-white'
            : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100',
          'text-sm font-medium rounded-md mr-2 mb-2',
        ]" :key="availableYear" :to="`/blog/?year=${availableYear}`">
          {{ availableYear }}
        </UButton>
      </div>
    </div>

    <ContentQuery path="/blog/" :sort="{ date: -1, modified: 1 }" v-slot="{ data }">
      <!-- featured article -->
      <div class="featured-articlemy-8 md:my-2 min-h-min pb-4 z-0" v-if="featuredArticle(data)">
        <div class="dark:bg-gray-900"></div>
        <div class="relative z-10 px-4 sm:px-6 lg:px-8 lg:py-40">
          <h2 class="text-4xl font-extrabold dark:text-white sm:text-5xl lg:text-8xl uppercase tracking-wide">
            {{ featuredArticle(data).title }}
          </h2>
          <p class="mt-6 max-w-3xl text-xl text-gray-400 dark:text-gray-300">
            {{ featuredArticle(data).dek }}
          </p>

          <div class="mt-5 lg:mt-16">
            <UButton icon="i-heroicons-arrow-up-right" size="lg" label="Read more" variant="solid" :trailing="true"
              @click="navigateTo(featuredArticle(data)._path)" />
          </div>
        </div>
      </div>

      <div v-for="article in blogIndexSort(blogIndexFilter(data))" :key="article._path">
        <UCard :class="[
          article.hidden ? 'hidden' : '',
          'opacity-80 xl:opacity-60 hover:opacity-100 transition duration-200 ease-in-out mb-4',
        ]">
          <div>
            <div
              class="flex justify-between items-center text-gray-400 dark:text-gray-600 text-xs md:text-sm mb-2 md:mb-4"
              v-if="article.title">
              <span v-if="article.modified">
                {{ formatDate(new Date(article.modified)) }}
              </span>
              <span v-else-if="article.date">
                {{ formatDate(new Date(article?.date)) }}
              </span>
              <span v-else>
                <USkeleton class="h-4 w-96 my-4" />
              </span>

              <span class="" v-if="countPhotos(article) > 2">{{ countPhotos(article) }} photos</span>

              <span class="inline-block pr-2" v-if="data?.readingTime?.minutes > 1">
                <UIcon name="i-heroicons-solid-clock" color="gray" />
                {{ data?.readingTime.text }}
              </span>
            </div>

            <NuxtLink v-if="article.title" :to="article._path"
              class="link font-bold text-gray-900 dark:text-gray-100 text-2xl md:text-3xl tracking-tight mb-2 md:mb-4 block hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200 cursor-pointer">
              {{ article.title }}
            </NuxtLink>
            <span v-else>
              <USkeleton class="h-8 w-96 my-4" />
            </span>

            <div class="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-2 md:mb-4"></div>

            <div class="text-gray-700 dark:text-gray-300 text-md max-w-prose">
              <div v-if="article.dek" class="font-light my-6">
                {{ article.dek }}
              </div>
              <div v-else-if="article.description" class="dek">
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
          </div>
        </UCard>
      </div>
    </ContentQuery>
  </main>
</template>
<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { countPhotos, filterStrongTags } from '~/helpers'
// import anime from "animejs/lib/anime.es.js";
import { timeFormat } from 'd3-time-format'

const formatDate = timeFormat('%B %d, %Y')

const blogYear = useRouteQuery('year', 2023, { transform: Number })

// an array with all the years that have articles
const blogYears = ref([
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
])

const filterByYear = ref(true)

/* take in some articles loaded through content and filter them- they must have a `date` property, and if they are `hidden: true` we should remove them */
const blogIndexFilter = (articles) => {
  if (!articles) return

  const filteredArticles = articles.filter((article) => {
    if (!article) return false
    if (!article.date) return false

    const articleYear = new Date(article.date).getFullYear()
    const isHidden = article.hidden
    const isSameYear = articleYear === blogYear.value

    return !isHidden && (filterByYear.value ? isSameYear : true)
  })

  return filteredArticles
}
/* take in some articles loaded through content and sort them by date, some articles also have a `modified` date that should be used so that articles modified most recently are at the top - not all articles have `modified` properties, but all articles should have `date` properties */
const blogIndexSort = (articles) => {
  // sorting prefers the modified date, but if that doesn't exist, it uses the date
  return articles.sort((a, b) => {
    if (a.modified && b.modified) {
      return new Date(b.modified) - new Date(a.modified)
    } else if (a.date && b.date) {
      return new Date(b?.date) - new Date(a?.date)
    } else {
      return 0
    }
  })
}

function featuredArticle(data) {
  if (!data) return null

  // const currentYear = new Date().getFullYear()
  // if (blogYear.value !== currentYear) return null

  const sortedData = blogIndexSort(blogIndexFilter(data))
  return sortedData[0]
}
</script>
<style scoped>
.featured-article h1,
h2,
h3 {
  font-family: "Fjalla One";
}
</style>
