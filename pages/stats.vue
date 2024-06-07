<template>
  <div class="px-4 md:px-24 pt-8">
    <!-- Stats grid -->
    <div class="grid grid-flow-col grid-rows-3 gap-4">
      <StatsCard :value="totalWords" label="Total Words written" />
      <StatsCard :value="totalPhotos" label="Photos Posted" />
      <StatsCard :value="totalPosts" label="Blog posts" />
      <StatsCard v-if="typeof draftCount === 'number'" :value="draftCount" label="Current Drafts" />
    </div>

    <UDivider class="py-16" />

    <!-- Words by year section -->
    <div class="col-span-2 lg:col-span-4">
      <h2 class="text-3xl">Words written by year</h2>
      <div class="py-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="year in wordsByYear" :key="year.year" class="text-center rounded-md min-h-24 pt-5"
          :style="{ backgroundColor: wordsToColor(year.words) }">
          <h2 class="text-2xl">{{ year.year }}</h2>
          <div class="flex items-baseline justify-evenly text-balance leading-5">
            <span class="p-2">
              <UIcon name="i-ic-round-text-snippet" class="mr-1" />
              {{ wordNumberFormat(year.words) }} published words
            </span>
            <span v-if="draftWordsByYear[year.year]" class="p-2">
              <UIcon name="i-ic-baseline-textsms" class="mr-1" />
              <span class="opacity-50">
                {{ wordNumberFormat(draftWordsByYear[year.year]) }} drafted words
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { countPhotos, stringLengthToFontSize } from '~~/helpers'
import { format, scaleLinear } from 'd3'
import tailwindConfig from '#tailwind-config'

const primaryColor = useAppConfig().ui.primary
const primaryColorHex = tailwindConfig.theme.colors[primaryColor][500]
const wordNumberFormat = format(',')

const totalPosts = ref(0)
const totalWords = ref(0)
const totalPhotos = ref(0)

const { data: blogData } = await useAsyncData('blog', () => queryContent('/blog/').find())
const { data: draftPosts } = await useAsyncData('draftPosts', () => queryContent('blog/drafts/').find())

// Compute total years
const totalYears = computed(() => {
  return [...new Set(blogData.value.map((article) => new Date(article.date).getFullYear()))]
})

// Compute maximum words in a year
const maxWordsInAYear = computed(() => {
  return Math.max(...wordsByYear.value.map((year) => year.words))
})

// Function to convert word count to color
function wordsToColor(wordCount) {
  const colorScale = scaleLinear()
    .domain([0, maxWordsInAYear.value])
    .range(['rgba(0, 255, 0, 0)', primaryColorHex])

  return colorScale(wordCount)
}

// Watch blogData and update stats
watch(
  blogData,
  () => {
    totalWords.value = blogData.value.reduce((acc, article) => acc + article.readingTime.words, 0)
    totalPhotos.value = blogData.value.reduce((acc, article) => acc + countPhotos(article), 0)
    totalPosts.value = blogData.value.length
  },
  { immediate: true },
)

// Compute words by year
const wordsByYear = computed(() => {
  const years = blogData.value.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    acc[year] = (acc[year] || 0) + article.readingTime.words
    return acc
  }, {})

  return Object.entries(years)
    .map(([year, words]) => ({ year, words }))
    .reverse()
    .filter((year) => year.year !== 'NaN')
})

// Compute draft words by year
const draftWordsByYear = computed(() => {
  const years = draftPosts.value.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    acc[year] = (acc[year] || 0) + (article?.readingTime.words || 0)
    return acc
  }, {})

  return Object.fromEntries(
    Object.entries(years)
      .map(([year, words]) => [year, words])
      .reverse(),
  )
})

// Compute draft count
const draftCount = computed(() => draftPosts.value.length)
</script>

<style>
.stats-classes {
  @apply text-8xl font-bold p-4 text-center min-h-48 min-w-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center;
}

.captions-classes {
  @apply text-sm uppercase font-thin py-2 lg:py-4;
}
</style>