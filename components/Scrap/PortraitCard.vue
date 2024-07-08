<template>
  <div class="portrait-card mb-8  text-3xl p-16">

    <!-- if it has .images, make a big bg of the first image -->
    <!-- <div class="image" v-if="scrap.images && scrap.images.length > 0"
      :style="{ backgroundImage: `url(${scrap.images[0]})` }">
    </div> -->



    <!-- <div class="text-9xl">
      <UIcon v-if="scrap.type === 'github-pr'" name="i-ph-git-pull-request-fill" class="icon" />

      <UIcon v-if="scrap.type === 'github-star'" name="i-material-symbols-light-kid-star-outline" class="icon" />

      <UIcon v-if="scrap.type === 'mastodon'" name="i-mingcute-thought-fill" class="icon" />

      <UIcon v-if="scrap.type === 'user-github-issue'" name="i-octicon-issue-opened-0.56" class="icon" />

      <UIcon v-if="scrap.type === 'github-gist'" name="i-material-symbols-code-blocks-outline-sharp" class="icon" />

      <UIcon v-if="scrap.type === 'pinboard'" name="i-cib-pinboard" class="icon" />
    </div> -->

    <NuxtLink v-if="scrap.scrap_id" :to="`/scrapbook/${scrap.scrap_id}`"
      class="scrap-id text-sm py-8 dark:text-slate-700">{{ scrap.scrap_id
      }}
    </NuxtLink>

    <div v-if="scrap.type === 'mastodon-post' ||
      scrap.type === 'github-star' ||
      scrap.type === 'pinboard' ||
      scrap.type === 'github-gist' ||
      scrap.type === 'github-pr'
      " class="description text-6xl break-words my-4 w-full dark:text-slate-50">{{
      scrap.description }}
    </div>



    <div class="date-info mt-12 break-words dark:text-slate-300" @click="navigateTo(scrap.href, { external: true })">

      {{ formatDate(scrap.created_at) }}


    </div>
    <div class="dark:text-slate-500">
      +{{ scrap.type }}
    </div>

    <div class="mb-12 text-base dark:text-slate-600">
      {{ hoursAgo(scrap.created_at) }} hours ago
    </div>



    <!-- <div class="content ">
      {{ scrap.content }}
    </div> -->

    <!-- URL -->
    <div class="url text-lg leading-none my-8 break-words w-full overflow-hidden dark:text-slate-600" v-if="scrap.href">
      <!-- <a :href="scrap.href" target="_blank" rel="noopener noreferrer">{{ scrap.href }}</a> -->
      <!-- show the domain in parts -->
      <span v-for="(part, index) in domainInParts" :key="index" :class="[domainPartColor(index)]">{{ part
        }}/</span>

    </div>



    <!-- if we have scrap.channel, show it -->
    <!-- <span class="channel" v-if="scrap.channel">
      {{ scrap.channel }}
    </span> -->
  </div>
</template>

<script setup>
import { format, formatRelative } from 'date-fns'
const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})
const formatDate = (date) => {
  // return format(new Date(date), 'M-dd|hh:mma')
  // use a relative time format
  return formatRelative(new Date(date), new Date())
}

const hoursAgo = (date) => {
  const diff = new Date() - new Date(date)
  return Math.floor(diff / 1000 / 60 / 60)
}

// we want to split the URL into parts so we can shade the domain differently
const domainInParts = computed(() => {
  if (!props.scrap.href) return []
  return props.scrap.href.split('/')
})

// function domainPartColor(index) {
//   // we wanna go from white to black
//   const shade = 100 - index * 10
//   return `hsl(0, 0%, ${shade}%)`
// }

// we gon use tailwind colors instead
function domainPartColor(index) {
  let lightShade = 800
  let darkShade = 200
  if (index === 0) {
    lightShade = 500
    darkShade = 700
  } else if (index === 1) {
    lightShade = 400
    darkShade = 600
  } else if (index === 2) {
    lightShade = 300
    darkShade = 500
  } else if (index === 3) {
    lightShade = 200
    darkShade = 400
  } else if (index === 4) {
    lightShade = 100
    darkShade = 300
  } else {
    lightShade = 50
    darkShade = 200
  }
  return `dark:text-slate-${darkShade} text-slate-${lightShade}`
}
</script>

<style scoped></style>
