<template>
  <UCard :class="['min-h-full leading-tight dark:text-slate-500  overflow-y-auto', maxHeight ? 'max-h-96' : '']"
    v-if="scrap">
    <!-- <template #header v-if="scrap?.content">
      
    </template> -->
    <template #footer>
      <div class="text-xs flex items-center justify-between md:opacity-50 hover:opacity-100 transition-opacity">
        <div class="">
          <NuxtLink :to="`/scrapbook/${scrapToUUID(scrap)}`" class="" v-if="scrap?.time">
            {{ format(new Date(scrap.time), dateFormatString) }}
          </NuxtLink>
        </div>
        <div class="md:inline-block">
          <a :href="scrapToUUID(scrap)" target="_blank" class="text-xs" v-if="scrap?.type">
            <span v-if="scrap.type === 'mastodon'" class="text-gray-500 opacity-50">
              <UIcon name="i-logos-mastodon-icon" />
            </span>
            <span v-if="scrap.type === 'pinboard'" class="dark:text-blue-900">
              <span v-if="scrap.type === 'pinboard'" class="dark:text-blue-900">
                <UIcon name="i-simple-line-icons-tag" />
              </span>
            </span>
            <span v-if="scrap.type === 'arena'">
              <UIcon name="i-simple-line-icons-picture" />
            </span>
            <span v-if="scrap.type === 'github-star'">
              <UIcon name="i-logos-github" class="w-8 dark:invert opacity-50" />
            </span>
            <span v-if="scrap.type === 'user-github'">
              <!-- GitHub -->
              <UIcon name="i-logos-github" class="w-8 dark:invert opacity-50" />
            </span>
            <span v-if="scrap.type === 'user-github-issue'">
              <UIcon name="i-logos-github" class="w-8 dark:invert opacity-50" />
            </span>
          </a>
        </div>
      </div>
    </template>
    <div class="flex flex-col overflow-x-auto">
      <!-- if we DO have a scrap description -->
      <div v-if="scrap?.description" class="">
        <a :href="scrapToUUID(scrap)" target="_blank" class="leading-tight text-gray-700 dark:text-gray-300"
          v-html="scrap?.description" />
      </div>
      <!-- no scrap content -->
      <div v-else-if="!scrap?.content" class="text-xs">
        <a :href="scrapToUUID(scrap)" target="_blank" class="" v-html="scrap?.description" />
      </div>
      <!-- if we DO have scrap content -->
      <span v-if="scrap?.content" class="text-xs mt-2" v-html="scrap.content"></span>
      <!-- if we have images -->
      <div v-if="scrap?.images" class="">
        <div v-if="scrap.images.length === 1" class="w-full mt-4">
          <img :src="scrap.images[0]" class="w-full drop-shadow-md rounded-sm" />
        </div>
        <div v-else-if="scrap?.images.length === 2" class="w-full flex">
          <img :src="scrap.images[0]" class="drop-shadow-md rounded-sm w-1/2" />
          <img :src="scrap.images[1]" class="drop-shadow-md rounded-sm w-1/2" />
        </div>
        <!-- if we have more than two images -->
        <div v-else-if="scrap.images.length > 2" class="flex mt-2">
          <img v-for="image in scrap.images" :key="image" :src="image" class="drop-shadow-md rounded-sm w-1/3" />
        </div>
      </div>
      <!-- if we have any videos -->
      <div v-if="scrap?.videos" class="mt-2 ml-2">
        <video v-for="video in scrap.videos" :key="video" :src="video" class="w-full drop-shadow-md rounded-sm"
          controls />
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { scrapToUUID } from '~/helpers';
import { format } from 'date-fns';
const { scrap, dateFormatString, maxHeight } = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
  dateFormatString: {
    type: String,
    default: 'EEEE',
  },
  maxHeight: {
    type: Boolean,
    default: true,
  }
});
</script>

<style scoped></style>