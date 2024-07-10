<template>
  <UCard class="scrap-item group cursor-default p-4 transition-colors">
    <h4 class="text-lg dark:text-white">{{ scrap.title }}</h4>



    <!-- Description -->
    <div v-if="scrap.description" class="font-medium" v-html="scrap.description" />
    <div class="space-y-4">
      <!-- Tags -->
      <div v-if="scrap.tags" class="flex flex-wrap gap-2">
        <div v-for="tag in JSON.parse(scrap.tags)">
          <NuxtLink :to="`/scrapbook/tags?tag=${tag}`" :key="tag" class="text-sm">
            <UBadge :key="tag" color="gray" size="sm">
              {{ tag }}
            </UBadge>
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div v-if="parsedMarkdown && showSUmmary" class="font-serif prose dark:prose-invert max-w-none">
        <ContentRenderer :value="parsedMarkdown" />
      </div>
      <!-- <USkeleton v-else class="h-20 w-full" /> -->

      <!-- Metadata -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <UIcon :name="getIconName(scrap.type)" class="w-4 h-4" />
          <span>{{ formatDate(scrap.created_at) }}</span>
        </div>
        <div v-if="scrap.metadata.latitude && scrap.metadata.longitude"
          class="opacity-50 hover:opacity-100 transition-opacity">
          lat/lng {{ scrap.metadata.latitude }}, {{ scrap.metadata.longitude }}
        </div>
        <UButton :to="scrap.href" target="_blank" color="primary" variant="ghost" icon="i-heroicons-link" size="xs">
          Link
        </UButton>
      </div>


      <!-- Channel -->
      <div v-if="scrap.channel" class="text-gray-600">
        {{ scrap.channel }}
      </div>

      <div v-if="scrap.content" class="font-medium" v-html="scrap.content" />


      <!-- Images -->
      <div v-if="scrap.images?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img v-for="(image, index) in scrap.images" :key="index" :src="image" class="w-full h-auto rounded-lg" />
      </div>
    </div>

    <div class="text-xs mt-4 uppercase tracking-widest dark:text-gray-700 flex justify-start space-x-4">
      <div>
        <span>
          Show raw JSON
        </span>
        <UToggle v-model="showRaw" label="Show Raw" size="xs" class="mr-2" />
      </div>
      <div v-if="scrap.summary">
        <span>
          Show summary
        </span>
        <UToggle v-model="showSUmmary" label="Show Content" size="xs" class="mr-2" />
      </div>
    </div>

    <pre v-if="showRaw" class="text-xs max-h-48 overflow-auto bg-gray-950 p-1">{{ scrap }}</pre>

  </UCard>
</template>

<script setup>
import { format } from 'date-fns'
import { computedAsync } from '@vueuse/core'
import markdownParser from '@nuxt/content/transformers/markdown'

const showRaw = ref(false)
const showSUmmary = ref(false)

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

const parsedMarkdown = computedAsync(async () => {
  const markdownContent = props.scrap.summary
  if (!markdownContent) return null
  return await markdownParser.parse(null, markdownContent)
}, null)

const formatDate = (date) => {
  return format(new Date(date), 'MMM d')
}

const getIconName = (type) => {
  const iconMap = {
    'github-pr': 'i-ph-git-pull-request-fill',
    'github-star': 'i-material-symbols-light-kid-star-outline',
    'mastodon': 'i-mingcute-thought-fill',
    'user-github-issue': 'i-octicon-issue-opened-16',
    'github-gist': 'i-material-symbols-code-blocks-outline-sharp',
    'pinboard': 'i-cib-pinboard',
  }
  return iconMap[type] || 'i-heroicons-document'
}
</script>