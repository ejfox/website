<!-- GithubRepoScrap.vue -->
<template>
  <div class="github-repo-scrap">
    <h2 class="text-xl font-bold mb-2">{{ scrap.name }}</h2>
    <p class="text-gray-600 mb-4">{{ scrap.description }}</p>

    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 class="text-lg font-semibold mb-2">README.md</h3>
      <div class="markdown-body" v-html="renderedReadme"></div>
    </div>

    <div v-if="scrap.images && scrap.images.length > 0" class="grid grid-cols-2 gap-4">
      <div v-for="(image, index) in scrap.images" :key="index" class="relative">
        <img :src="image" :alt="`Screenshot ${index + 1}`" class="w-full h-auto rounded-lg shadow-md">
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          Screenshot {{ index + 1 }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center space-x-4">
      <span class="flex items-center">
        <UIcon name="i-octicon-star-16" class="w-4 h-4 mr-1" />
        {{ scrap.stargazers_count }}
      </span>
      <span class="flex items-center">
        <UIcon name="i-octicon-repo-forked-16" class="w-4 h-4 mr-1" />
        {{ scrap.forks_count }}
      </span>
      <span class="flex items-center">
        <UIcon name="i-octicon-eye-16" class="w-4 h-4 mr-1" />
        {{ scrap.watchers_count }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

const renderedReadme = computed(() => {
  if (props.scrap.readme) {
    const rawHtml = marked(props.scrap.readme)
    return DOMPurify.sanitize(rawHtml)
  }
  return ''
})
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