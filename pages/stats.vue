<template>
  <div class="ph5 f1">
    <h2 class="mt0 mb2">Website Stats</h2>

    <h3 class="fw3">Total words written: <span class="fw8">{{ wordNumberFormat(totalWords) }}</span></h3>

    <h3 class="fw3">Total photos: <span class="fw8">{{ wordNumberFormat(totalPhotos) }}</span></h3>

    <h3 class="fw3">Total links: <span class="fw8">{{ wordNumberFormat(totalLinks) }}</span></h3>

    <h3 class="fw3">Total commits to the website: <span class="fw8">{{ wordNumberFormat(totalCommits) }}</span></h3>

  </div>
</template>
<script setup>
import { countWords, countLinks, countPhotos } from "~~/helpers";
import { format } from 'd3'
const contentQuery = queryContent('blog')

const wordNumberFormat = format(',')

const totalWords = ref(0)
const totalPhotos = ref(0)
const totalLinks = ref(0)

const docs = contentQuery.find()

// the website is hosted on a GitHub repo located at https://github.com/ejfox/website

// we want to use the GitHub public REST API to get the number of commits to the repo

const githubAPI = 'https://api.github.com/repos/ejfox/website/commits'

// we can use the fetch API to make a request to the GitHub API
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

// fetch returns a promise, so we can use async/await to wait for the response

// const githubResponse = await fetch(githubAPI)

// the response is a JSON string, so we can use the .json() method to parse it

// const githubData = await githubResponse.json()

// the GitHub API returns an array of commits, so we can get the length of the array

// const totalCommits = githubData.length

// unfortunately this does not return all of the commits, only the most recent 30, so we will have to use the GitHub API pagination to get all of the commits

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

docs.then((docs) => {
  totalWords.value = docs.reduce((acc, doc) => {
    return acc + countWords(doc)
  }, 0)

  totalPhotos.value = docs.reduce((acc, doc) => {
    return acc + countPhotos(doc)
  }, 0)

  totalLinks.value = docs.reduce((acc, doc) => {
    return acc + countLinks(doc)
  }, 0)
})

const totalMastodonFollowers = ref(0)



</script>