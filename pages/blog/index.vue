<template>
  <main class="dark:bg-gray-900 p-2 md:p-4">
    <!-- year navigation -->
    <div
      class="flex flex-col mb-4 md:relative lg:relative backdrop-filter backdrop-blur-lg top-0 w-full pointer-events-auto">
      <div class="">
        <UButton to="/blog/index_verbose" class="my-4" color="white">
          See all posts
        </UButton>
      </div>
      <div v-if="filterByYear" class="flex flex-wrap mt-2 align-middle w-full justify-start items-stretch">
        <UIcon name="i-heroicons-calendar-days" class="m-1 mr-3 text-2xl align-middle" />
        <div v-for="availableYear in blogYears" class="mr-3 mb-3">
          <UChip :show="availableYear === blogYear" :text="getYearPostCount(availableYear)" size="2xl">
            <UButton class="cursor-pointer" :color="availableYear === blogYear ? 'white' : 'gray'" :key="availableYear"
              :to="`/blog/?year=${availableYear}`">
              {{ availableYear }}
            </UButton>
          </UChip>
        </div>
      </div>
    </div>

    <div v-for="article in  sortedFilteredArticles " :key="article._path">
      <UCard :class="[
        article.hidden ? 'hidden' : '',
        'mb-4 max-w-screen-md overflow-hidden',
      ]">
        <div class="lg:p-4 xl:p-8">
          <div
            class="flex justify-between items-center text-gray-400 dark:text-gray-600 text-xs md:text-sm mb-2 md:mb-4"
            v-if="article.title">
            <span v-if="article.date">
              {{ formatDate(new Date(article?.date)) }}
            </span>
            <span v-else>
              <USkeleton class="h-4 w-96 my-4" />
            </span>

            <span class="" v-if="countPhotos(article) > 2">{{ countPhotos(article) }} photos</span>

            <span class="inline-block pr-2" v-if="article?.readingTime?.minutes > 1">
              <UIcon name="i-heroicons-solid-clock" color="gray" />
              {{ article?.readingTime.text }}
            </span>
          </div>

          <!-- <NuxtLink v-if="article.title" :to="article._path"
            class="link font-bold text-gray-900 dark:text-gray-100 text-2xl md:text-3xl tracking-tight mb-2 md:mb-4 block hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200 cursor-pointer">
            {{ article.title }}
          </NuxtLink>
          <span v-else>
            <USkeleton class="h-8 w-96 my-4" />
          </span> -->

          <div class="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-2 md:mb-4"></div>

          <div class="article-toc text-gray-600 dark:text-gray-400 text-sm md:text-base pb-4">
            <ul class="list-none flex flex-wrap justify-start items-center">
              <li v-for="link of article.body?.toc?.links" :key="link.id">
                <UButton color="gray" class="mr-2 mb-2 font-light" size="xs" :to="`${article._path}#${link.id}`">
                  {{ link.text }}
                </UButton>
              </li>

            </ul>
          </div>

          <div class="text-gray-700 dark:text-gray-300 text-md max-w-prose">
            <!-- <div v-if="article.dek" class="font-light my-6">
              {{ article.dek }}
            </div>
            <div v-else-if="article.description" class="dek">
              {{ article.description }}
            </div> -->

            <div class="prose lg:prose-lg dark:prose-invert">
              <ContentRendererMarkdown :value="article" />
            </div>
          </div>


        </div>
      </UCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { countPhotos, filterStrongTags } from '~/helpers'
import { timeFormat } from 'd3-time-format'

const formatDate = timeFormat('%B %d, %Y')

const blogYear = useRouteQuery('year', 2023, { transform: Number })

const { status, data } = await useLazyAsyncData('blog', () => queryContent('/blog/').find())

const blogYears = ref([
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
])

const filterByYear = ref(true)


const blogIndexFilter = (articles) => {
  // console.log('articles', articles)
  if (!articles) return
  if (!articles.length) return

  const filteredArticles = unref(articles).filter((article) => {
    if (!article) return false
    if (!article.date) return false

    return !isHidden(article) && (filterByYear.value ? isSameYear(article) : true)
  })

  return filteredArticles
}

const isHidden = (article) => {
  return article.hidden
}

const isSameYear = (article) => {
  const articleYear = new Date(article.date).getFullYear()
  return articleYear === blogYear.value
}

const filteredByHidden = computed(() => {
  return data.value.filter((article) => !isHidden(article))
})

const filteredByYear = computed(() => {
  return filteredByHidden.value.filter((article) => isSameYear(article))
})

const blogIndexSort = (articles) => {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const sortedFilteredArticles = computed(() => blogIndexSort(blogIndexFilter(data.value)))

const postCountByYear = computed(() => {
  const postCountByYear = {}
  if (!data.value) return postCountByYear
  if (!data.value.length) return postCountByYear
  for (const article of data.value) {
    if (isHidden(article)) continue
    const year = new Date(article.date).getFullYear()
    if (!postCountByYear[year]) postCountByYear[year] = 0
    postCountByYear[year]++
  }
  return postCountByYear
})

function getYearPostCount(year) {
  return postCountByYear.value[year] || 0
}
</script>

<style scoped>
.featured-article h1,
h2,
h3 {
  font-family: "Fjalla One";
}
</style>
