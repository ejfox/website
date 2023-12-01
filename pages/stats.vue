<template>
  <div class="px-4 md:px-24 pt-8">
    <div :class="statClasses">
      <h2 :class="stringLengthToFontSize(wordNumberFormat(totalWords))">{{ wordNumberFormat(totalWords) }}</h2>
      <p :class="captionClasses">Words written</p>
    </div>

    <div :class="statClasses">
      <h2 :class="stringLengthToFontSize(wordNumberFormat(totalPhotos))">{{ wordNumberFormat(totalPhotos) }}</h2>
      <p :class="captionClasses">Photos</p>
    </div>

    <div :class="statClasses">
      <h2 :class="stringLengthToFontSize(wordNumberFormat(totalPosts))">{{ wordNumberFormat(totalPosts) }}</h2>
      <p :class="captionClasses">Blog posts</p>
    </div>

    <div :class="statClasses">
      <h2 :class="stringLengthToFontSize(wordNumberFormat(totalCommits))">{{ wordNumberFormat(totalCommits) }}</h2>
      <p :class="captionClasses">Website commits</p>
    </div>

    <UDivider class="py-32" />

    <!-- show the words by year-->
    <div class="col-span-2 lg:col-span-4">
      <h2 class="md:text-5xl font-bold text-center md:text-left">Words by year</h2>
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

// make a widget to turn a string, determinehe # of chars (digits, really) and then decide which tailwindcss text size class to use
function stringLengthToFontSize(string) {
  const length = string.length
  if (length < 5) {
    return 'text-8xl'
  } else if (length < 6) {
    return 'text-7xl'
  } else if (length < 7) {
    return 'text-6xl'
  } else if (length < 8) {
    return 'text-5xl'
  } else if (length < 9) {
    return 'text-4xl'
  } else if (length < 10) {
    return 'text-3xl'
  } else if (length < 11) {
    return 'text-2xl'
  } else if (length < 12) {
    return 'text-xl'
  } else if (length < 13) {
    return 'text-lg'
  } else if (length < 14) {
    return 'text-base'
  } else if (length < 15) {
    return 'text-sm'
  } else if (length < 16) {
    return 'text-xs'
  } else {
    return 'text-xxs'
  }
}


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