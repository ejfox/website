<template>
  <div class="scrap-item group cursor-default">
    <div class="flex items-center justify-between mb-1">
      <div class="text-xs text-gray-500 opacity-5 group-hover:opacity-100 transition-opacity">{{ formatDate(scrap.time)
        }}</div>
      <a :href="scrap.href" target="_blank" class="text-xs text-blue-500 hover:underline">
        Link
      </a>
    </div>
    <!-- <pre>{{ scrap }}</pre> -->
    <div class="mb-1 text-sm font-medium" v-html="scrap.description" />

    <div class="mb-1 text-xs text-gray-600 " v-if="scrap.content">
      {{ scrap.content }}
    </div>
    <div v-if="scrap.images?.length > 0">
      <img v-for="(image, index) in scrap.images" :key="index" :src="image" class="max-w-full inline-block mb-2 mr-2">
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