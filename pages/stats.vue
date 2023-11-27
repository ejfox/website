<template>
  <div class="px-24 pt-8">
    <div :class="statClasses">
      <h2>{{ wordNumberFormat(totalWords) }}</h2>
      <p :class="captionClasses">Words written</p>
    </div>

    <div :class="statClasses">
      <h2>{{ wordNumberFormat(totalPhotos) }}</h2>
      <p :class="captionClasses">Photos</p>
    </div>

    <div :class="statClasses">
      <h2>{{ wordNumberFormat(totalPosts) }}</h2>
      <p :class="captionClasses">Blog posts</p>
    </div>

    <div :class="statClasses">
      <h2>{{ wordNumberFormat(totalCommits) }}</h2>
      <p :class="captionClasses">Website commits</p>
    </div>

    <UDivider class="py-32" />

    <!-- show the words by year-->
    <div class="col-span-2 lg:col-span-4">
      <h2 class="text-5xl font-bold">Words by year</h2>
      <div class="py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="year in wordsByYear" :key="year.year" class="text-center">
          <h2 class="text-lg font-serif font-bold">{{ wordNumberFormat(year.words) }}</h2>
          <p class="text-sm">{{ year.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { countWords, countLinks, countPhotos } from "~~/helpers";
import { format } from 'd3'

const statClasses = "text-8xl font-bold p-4 text-center"
const captionClasses = "text-sm uppercase font-thin pt-2 opacity-60"

const wordNumberFormat = format(',')

const totalPosts = ref(0)
const totalWords = ref(0)
const totalPhotos = ref(0)


const { data } = await useAsyncData('blog', () => queryContent('/blog/').find())

// watch docs, and update the totalWords ref whenever the docs change
watch(data, () => {
  console.log('data changed')
  console.log(data.value)
  totalWords.value = data.value.reduce((acc, article) => {
    return acc + article.readingTime.words
  }, 0)

  totalPhotos.value = data.value.reduce((acc, article) => {
    return acc + countPhotos(article)
  }, 0)

  totalPosts.value = data.value.length


}, { immediate: true })

const wordsByYear = computed(() => {
  const years = data.value.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    if (!acc[year]) {
      acc[year] = 0
    }
    acc[year] += article.readingTime.words
    return acc
  }, {})

  return Object.entries(years).map(([year, words]) => {
    return {
      year,
      words
    }
  }).reverse().filter((year) => year.year !== 'NaN')
})




// the website is hosted on a GitHub repo located at https://github.com/ejfox/website
// we want to use the GitHub public REST API to get the number of commits to the repo
const githubAPI = 'https://api.github.com/repos/ejfox/website/commits'
const totalCommits = ref(0)
const getCommits = async (url) => {
  const githubResponse = await fetch(url)
  const githubData = await githubResponse.json()

  totalCommits.value += githubData.length

  if (githubResponse.headers.get('Link')) {
    const links = githubResponse.headers.get('Link').split(',')
    const nextLink = links.find((link) => link.includes('rel="next"'))
    if (nextLink) {
      const nextURL = nextLink.split(';')[0].replace('<', '').replace('>', '')
      getCommits(nextURL)
    }
  }
}

getCommits(githubAPI)



</script>