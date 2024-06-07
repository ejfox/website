<template>
  <div class="page-metadata text-xs flex flex-wrap">
    <div class="text-gray-500 font-light text-sm  flex-wrap items-center space-y-2">
      <!-- let the user know if the article is in progress or not -->
      <span v-if="doc.inprogress" class="inline-flex items-center mr-4 text-primary-200 dark:text-primary-700">
        <UIcon name="bi:exclamation-triangle" class="mr-1 text-sm pb-1 " />
        <span>This post is a draft, and updates are expected</span>
      </span>

      <span class="mr-4 inline-flex items-center" v-if="doc.date" title="Date created">
        <UIcon name="ant-design:calendar-outlined" class="mr-1 text-sm pb-1" />
        <span class="hidden lg:inline-block mr-1 font-bold">Started</span>
        {{ formatBlogDate(new Date(doc.date)) }}
      </span>

      <span class="mr-4 whitespace-nowrap inline-flex items-center" v-if="doc.modified" title="Date modified">
        <UIcon name="ic:round-edit-calendar" class="mr-1 text-sm pb-1" />
        <span class="hidden lg:inline-block mr-1 font-bold">Last Updated</span>
        {{ formatBlogDate(new Date(doc.modified)) }}
      </span>


      <div class="inline-flex items-center p-0 m-0">
        <span class="mr-4 whitespace-nowrap inline-flex items-center" v-if="doc.readingTime?.words > 100">
          <UIcon name="bi:card-text" class="mr-1 text-sm pb-1" />
          {{ doc.readingTime?.words }} words
        </span>

        <span class="mr-4 whitespace-nowrap inline-flex items-center" v-if="doc.readingTime?.text !== '1 min read'">
          <UIcon name="bi:clock-history" class="mr-1 text-sm pb-1" />
          {{ doc.readingTime?.text }}
        </span>

        <span class="mr-4 whitespace-nowrap inline-flex items-center" v-if="countPhotos(doc) > 0">
          <UIcon name="ant-design:camera-filled" class="mr-1 text-sm pb-1" />
          {{ countPhotos(doc) }} photo<span v-if="+countPhotos(doc) > 1">s</span>
        </span>

        <span class="mr-4 whitespace-nowrap inline-flex items-center" v-if="countLinks(doc) > 1">
          <UIcon name="bi:link" class="mr-1 text-sm pb-1" />
          {{ countLinks(doc) }} links
        </span>
      </div>
    </div>

    <div class="strong-tags text-xs font-light text-gray-500 mt-1 italic" v-if="filterStrongTags(doc).length > 0">
      Highlights:
      <span v-for="tag in filterStrongTags(doc)" :key="tag" class="tag inline-block mr-2 mb-2 px-1 py-1 bg-gray-100">
        {{ tag }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { timeFormat } from 'd3-time-format'
import {
  countWords,
  countPhotos,
  countLinks,
  filterStrongTags,
} from '~~/helpers'
const { doc } = defineProps({
  doc: {
    type: Object,
    required: true,
  },
})

const formatBlogDate = timeFormat('%B %d, %Y')
</script>
