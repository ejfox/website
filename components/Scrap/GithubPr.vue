<!-- GithubPRScrap.vue -->
<template>
  <div class="github-pr-scrap">
    <h2 class="text-xl font-bold mb-2">{{ scrap.title }}</h2>
    <p class="text-gray-600 mb-4">PR #{{ scrap.number }} in {{ scrap.repoName }}</p>

    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <div class="markdown-body" v-html="renderedBody"></div>
    </div>

    <div class="mt-4 flex items-center space-x-4">
      <span class="flex items-center">
        <UIcon :name="statusIcon" class="w-4 h-4 mr-1" />
        {{ scrap.state }}
      </span>
      <span class="flex items-center">
        <UIcon name="i-octicon-git-commit-16" class="w-4 h-4 mr-1" />
        {{ scrap.commits }} commits
      </span>
      <span class="flex items-center">
        <UIcon name="i-octicon-diff-16" class="w-4 h-4 mr-1" />
        {{ scrap.changedFiles }} files changed
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

const renderedBody = computed(() => {
  if (props.scrap.body) {
    const rawHtml = marked(props.scrap.body)
    return DOMPurify.sanitize(rawHtml)
  }
  return ''
})

const statusIcon = computed(() => {
  switch (props.scrap.state) {
    case 'open':
      return 'i-octicon-git-pull-request-16'
    case 'closed':
      return 'i-octicon-git-pull-request-closed-16'
    case 'merged':
      return 'i-octicon-git-merge-16'
    default:
      return 'i-octicon-git-pull-request-16'
  }
})
</script>

<style scoped>
/* Add the same markdown-body styles as in GithubRepoScrap.vue */
</style>