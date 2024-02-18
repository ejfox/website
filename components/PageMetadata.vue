<template>
  <div class="page-metadata pt-3 text-xs">
    <div class="block text-gray-500 font-light text-sm py-2">

      <!-- let the user know if the article is in progress or not -->
      <span v-if="doc.inprogress" class="">
        <UIcon name="bi:exclamation-triangle" class="mr-1 text-sm pb-1 text-gray-200 dark:text-gray-700" />
        This post is in progress, and updates are expected
      </span>

      <span class="mr-4 whitespace-nowrap inline-block text-gray-500" v-if="doc.date" title="Date created">
        <UIcon name="ant-design:calendar-outlined" class="mr-1 text-sm pb-1" />
        <span class="hidden lg:inline-block">
          Started
        </span>

        {{ formatBlogDate(new Date(doc.date)) }}
      </span>

      <span class="hidden lg:inline-block mr-4 whitespace-nowrap text-gray-500" v-if="doc.modified" title="Date modified">
        <UIcon name="ic:round-edit-calendar" class="mr-1 text-sm pb-1" />
        <span class="hidden lg:inline-block">
          Updated
        </span>

        {{ formatBlogDate(new Date(doc.modified)) }}
      </span>
      <span class="mr-4 whitespace-nowrap inline-block" v-if="doc.readingTime?.words > 100">
        <UIcon name="bi:card-text" class="mr-1 text-sm pb-1" />
        {{ doc.readingTime?.words }} words
      </span>
      <span class="mr-4 whitespace-nowrap inline-block" v-if="doc.readingTime?.text !== '1 min read'">
        <UIcon name="bi:clock-history" class="mr-1 text-sm pb-1" />
        {{ doc.readingTime?.text }}
      </span>
      <span class="mr-4 whitespace-nowrap inline-block" v-if="countPhotos(doc) > 0">
        <UIcon name="ant-design:camera-filled" class="mr-1 text-sm pb-1" />
        {{ countPhotos(doc) }} photo<span v-if="+countPhotos(doc) > 1">s</span>
      </span>

      <span class="mr-4 whitespace-nowrap inline-block" v-if="countLinks(doc) > 1">
        <UIcon name="bi:link" class="mr-1 text-sm pb-1" />
        {{ countLinks(doc) }} links
      </span>
    </div>
    <div class="strong-tags text-xs font-light text-gray-500 mt-1 italic" v-if="filterStrongTags(doc).length > 0">
      Highlights:
      <span v-for="tag in filterStrongTags(doc)" :key="tag" class="tag inline-block mr-2 mb-2 px-1 py-1 bg-gray-100">{{
        tag
      }}</span>
    </div>
  </div>
</template>
<script setup>
import { timeFormat } from "d3-time-format";
import {
  countWords,
  countPhotos,
  countLinks,
  filterStrongTags,
} from "~~/helpers";
const { doc } = defineProps({
  doc: {
    type: Object,
    required: true,
  },
});

const formatBlogDate = timeFormat('%B %d, %Y')

</script>