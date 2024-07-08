<!-- GithubReleaseScrap.vue -->
<template>
  <div class="github-release-scrap">
    <h2 class="text-xl font-bold mb-2">{{ scrap.name }}</h2>
    <p class="text-gray-600 mb-4">{{ scrap.tagName }}</p>

    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <div class="markdown-body" v-html="renderedBody"></div>
    </div>

    <div class="mt-4 flex items-center space-x-4">
      <span class="flex items-center">
        <UIcon name="i-octicon-tag-16" class="w-4 h-4 mr-1" />
        Release
      </span>
      <span class="flex items-center">
        <UIcon name="i-octicon-calendar-16" class="w-4 h-4 mr-1" />
        {{ formatDate(scrap.publishedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { format } from 'date-fns'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

const renderedBody = computed(() => {
  if (props.scrap.body) {
    const rawHtml = marked(props.scrap.body)
    return DOMPurify.sanitize(rawHtml)
  }
  return ''
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}
</script>

<style scoped>
.markdown-body {
  /* Add some basic styling for the rendered markdown */
  font-size: 14px;
  line-height: 1.5;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}
</style>