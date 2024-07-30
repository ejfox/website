<template>
  <div>
    <h4 class="text-lg">{{ scrap.title }}</h4>
    <!-- show the actual URL as metadata -->
    <div class="tracking-wide px-4 pt-4">
      <a :href="scrap.metadata.href" target="_blank" class="text-xs">{{
      scrap.metadata.href }}</a>
    </div>

    <!-- <div class="text-xs mt-4 uppercase tracking-widest dark:text-gray-700 p-2">
      Show summary
      <UToggle v-if="scrap.summary" v-model="showSummary" label="Show summary" size="xs" />
    </div> -->

    <div v-if="scrap.description" class="font-medium" v-html="scrap.description" />

    <div class="">
      <!-- Content -->
      <div v-if="parsedMarkdown && showSummary" class="font-serif prose prose-sm dark:prose-invert p-2">
        <ContentRenderer :value="parsedMarkdown" />
      </div>
    </div>



  </div>
</template>

<script setup>
import { computedAsync } from '@vueuse/core'
import markdownParser from '@nuxt/content/transformers/markdown'

const showSummary = ref(true)

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
</script>