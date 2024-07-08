<template>
  <div
    class="scrap-item group cursor-default pointer border-1 border-gray-200 align-baseline inline-block v-top mb-1 mr-8 lg:mr-16"
    v-if="scrap.content || scrap.description">
    <!-- <div class="flex items-center justify-between mb-0.5">

      <div class=-500 opacity-5 group-hover:opacity-0.500 transition-opacity">{{
        
      }}</div>
      <a :href="scrap.href" target="_blank" class=-500 hover:underline">
        Link
      </a>
    </div> -->
    <!-- <pre>{{ scrap }}</pre> -->


    <small class="opacity-50 inline-block overflow-hidden mr-1 align-top mb-0.5"
      @click="navigateTo(scrap.href, { external: true })">
      {{ formatDate(scrap.time) }}
      &lt;+{{ scrapTypeToSymbol(scrap.type) }} {{ scrap.type }}&gt;
    </small>

    <!-- <span v-if="scrap.type === 'mastodon'" class="mb-0.5 font-medium leading-7 w-5/6"
      v-html="scrap.description" /> -->
    <div v-if="showDetails">
      <span class="mb-0.5 align-top"
        v-html="scrap.type === 'mastodon-post' ? scrap.description : scrap.description"></span>

      <!-- <span class="line-clamp-1" v-html="scrap.content" /> -->

      <span class="inline line-clamp-1 align-top mb-0.5">
        {{ scrap.content }}
      </span>
    </div>

    <NuxtLink v-if="scrap.scrap_id" :to="`/scrapbook/${scrap.scrap_id}`"
      class="opacity-30 inline-block overflow-hidden align-top mb-0.5">{{ scrap.scrap_id }}</NuxtLink>

    <!-- if we have scrap.channel, show it -->
    <!-- <span class="mb-0.5-600" v-if="scrap.channel">
      {{ scrap.channel }}
    </span> -->
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { scrapTypeSymbols } from '~/helpers'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
  showDetails: {
    type: Boolean,
    default: true,
  },
})

function scrapTypeToSymbol(type) {
  // if the type is 'github-pr'
  // just turn it into 'github'
  if (type.includes('github')) {
    return 'github'
  }
  return scrapTypeSymbols[type]
}

const formatDate = (date) => {
  return format(new Date(date), 'M-dd|hh:mma')
}
</script>

<style scoped></style>
