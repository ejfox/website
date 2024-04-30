<template>
  <div
    class="scrap-pr-block group cursor-default py-2 bg-gray-100 dark:bg-gray-900 pl-1"
  >
    <h2 v-if="scraps.length > 2">{{ scraps.length }} PRs</h2>
    <div v-for="(scrap, index) in scraps" :key="index" class="">
      <div class="scrap-item group cursor-default mb-0.5">
        <UIcon
          v-if="scrap.type === 'user-github-pr'"
          name="i-ph-git-pull-request-fill"
          class="w-4 h-4 inline-block mr-0.5"
        />
        <span class="text-sm font-medium" v-html="scrap.description" />
        <!-- <span class="text-xs text-gray-200 dark:text-gray-800 line-clamp-1" v-if="scrap.content">{{ scrap.content }}</span> -->
        <div v-if="scrap.images?.length > 0" class="w-full">
          <img
            v-for="(image, index) in scrap.images"
            :key="index"
            :src="image"
            class="max-w-full block mx-auto mb-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  scraps: {
    type: Array,
    required: true,
  },
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d')
}
</script>

<style scoped></style>
