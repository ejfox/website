<template>
  <div class="scrap-item group cursor-default py-2">
    <div class="flex items-center justify-between mb-1">
      <div class=" text-gray-500 opacity-5 group-hover:opacity-100 transition-opacity">
        {{ formatDate(scrap.created_at) }}
      </div>
      <a :href="scrap.href" target="_blank" class=" text-blue-500 hover:underline">
        Link
      </a>
    </div>
    <!-- <pre>{{ scrap }}</pre> -->
    <!-- <small class="opacity-50">{{scrap.type}}</small> -->

    <!-- PR icon if type is user-github-pr -->
    <UIcon v-if="scrap.type === 'github-pr'" name="i-ph-git-pull-request-fill" class="w-4 h-4 inline-block ml-1" />

    <UIcon v-if="scrap.type === 'github-star'" name="i-material-symbols-light-kid-star-outline"
      class="w-4 h-4 inline-block ml-1" />

    <UIcon v-if="scrap.type === 'mastodon'" name="i-mingcute-thought-fill" class="w-4 h-4 inline-block ml-1" />

    <UIcon v-if="scrap.type === 'user-github-issue'" name="i-octicon-issue-opened-16"
      class="w-4 h-4 inline-block ml-1" />

    <UIcon v-if="scrap.type === 'github-gist'" name="i-material-symbols-code-blocks-outline-sharp"
      class="w-4 h-4 inline-block ml-1" />

    <UIcon v-if="scrap.type === 'pinboard'" name="i-cib-pinboard" class="w-4 h-4 inline ml-0.5" />

    <div class="mb-1  font-medium" v-html="scrap.description" />

    <!-- if we have scrap.channel, show it -->
    <div class="mb-1  text-gray-600" v-if="scrap.channel">
      {{ scrap.channel }}
    </div>

    <div class="mb-1  text-gray-600" v-if="scrap.content">
      {{ scrap.content }}
    </div>
    <div v-if="scrap.images?.length > 0" class="w-full">
      <img v-for="(image, index) in scrap.images" :key="index" :src="image" class="max-w-full block mb-2" />
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d')
}
</script>

<style scoped></style>
