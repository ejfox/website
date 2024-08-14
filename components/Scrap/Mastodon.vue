<template>
  <div class="post">
    <div class="content">
      <div v-if="parsedMarkdown" class="p-4 font-serif prose prose-2xl dark:prose-invert max-w-none">
        <ContentRenderer :value="parsedMarkdown" />
      </div>
      <!-- if it has any images in the image metadata, show them all -->
      <div v-if="scrap.metadata.images" :class="[scrap.metadata.images.length > 1 ? 'grid grid-cols-2 gap-4' : '']">
        <img v-for="image in scrap.metadata.images" :key="image.url" :src="image.url" alt="Scrap Image" />


      </div>

      <!-- <pre>{{ scrap.metadata }}</pre> -->


    </div>
  </div>
</template>


<script setup>
import { computedAsync } from '@vueuse/core'
import markdownParser from '@nuxt/content/transformers/markdown'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
})

// computed image to use
// const scrapImageUrl = computed(() => {
//   console.log(props.scrap)
//   if (props.scrap.metadata.images) {
//     return props.scrap.metadata.images[0].url
//   }
//   return null
// })

const parsedMarkdown = computedAsync(async () => {
  const markdownContent = props.scrap.content
  if (!markdownContent) return null
  return await markdownParser.parse(null, markdownContent)
}, null)

/* Mastodon posts look like
{
  "url": "https://mastodon.social/@ejfox/112802592755172057",
  "images": [
    {
      "url": "https://files.mastodon.social/media_attachments/files/112/802/592/503/053/828/original/6de5b99c2083603f.png",
      "description": null,
      "preview_url": "https://files.mastodon.social/media_attachments/files/112/802/592/503/053/828/small/6de5b99c2083603f.png"
    }
  ],
  "visibility": "public",
  "reblogs_count": 0,
  "favourites_count": 0
}
 */

</script>

<style scoped>
.post {
  @apply flex items-start gap-10;
}

.avatar {
  @apply w-12 h-12;
  /* Add avatar styles here */
}

.content {
  @apply flex-1;
}

.timestamp {
  @apply text-gray-500 text-sm;
}
</style>
