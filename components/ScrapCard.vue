<template>
  <section class="my-2 md:my-8 lg:my-20 md:mb-10" v-if="scrap">

    <div class="flex flex-col">

      <div v-if="scrap.description" class="max-w-prose text-4xl leading-tight">
        <div v-if="scrap?.description" :class="[scrap.type === 'mastodon' ? 'text-4xl leading-normal my-4' : '']
          ">
          <a :href="scrap.href" target="_blank" class="" v-html="scrap?.description" />
        </div>
        <div v-if="scrap?.content" class="max-w-prose py-2 my-2 monospace text-sm" v-html="scrap.content"></div>
        <div v-else="scrap?.summaryAgain" class="max-w-prose text-justify text-sm">
          <div v-if="scrap?.summaryAgain" class="py-2 my-2" v-html="scrap.summaryAgain"></div>
        </div>
      </div>




      <!-- if we have images -->
      <div v-if="scrap?.images" class="">
        <div v-if="scrap.images.length === 1" class="w-full mt-4">
          <img :src="scrap.images[0]" class="max-w-full drop-shadow-md rounded-md" />
        </div>
        <div v-else-if="scrap?.images.length === 2" class="w-full flex">
          <img :src="scrap.images[0]" class="drop-shadow-md rounded-md" />
          <img :src="scrap.images[1]" class="drop-shadow-md rounded-md" />
        </div>
        <!-- if we have more than two images -->
        <div v-else-if="scrap.images.length > 2" class="flex mt-2">
          <img v-for="image in scrap.images" :key="image" :src="image" class="drop-shadow-md rounded-md w-1/3" />
        </div>
      </div>
      <!-- if we have any videos -->
      <div v-if="scrap?.videos" class="mt-2 ml-2">
        <video v-for="video in scrap.videos" :key="video" :src="video" class="w-full drop-shadow-md rounded-md"
          controls />
      </div>
    </div>

    <div v-if="showFooter">
      <div class="md:opacity-50 hover:opacity-100 transition-opacity ">
        <div class="inline-block mr-2">
          <a :href="scrapToUUID(scrap)" target="_blank" class="text-xs" v-if="scrap?.type">
            <span v-if="scrap.type === 'mastodon'" class="text-gray-500 opacity-50">
              <UIcon name="i-simple-icons-mastodon" />
            </span>
            <span v-if="scrap.type === 'pinboard'" class="dark:text-blue-900">
              <span v-if="scrap.type === 'pinboard'" class="dark:text-blue-900">
                <UIcon name="i-simple-icons-pinboard" />
              </span>
            </span>
            <span v-if="scrap.type === 'arena'">
              <UIcon name="i-simple-line-icons-picture" />
            </span>
            <span v-if="scrap.type === 'github-star'">
              <UIcon name="i-simple-icons-github" class="w-8 dark:invert opacity-50" />
            </span>
            <span v-if="scrap.type === 'user-github'">
              <UIcon name="i-simple-icons-github" class="w-8 dark:invert opacity-50" />
            </span>
            <span v-if="scrap.type === 'user-github-issue'">
              <UIcon name="i-simple-icons-github" class="w-8 dark:invert opacity-50" />
            </span>
          </a>
        </div>

        <div class="text-xs inline-block uppercase monospace">
          <NuxtLink :to="`/scrapbook/${scrapToUUID(scrap)}`" class="
          opacity-50 hover:opacity-100 transition-opacity
          " v-if="scrap?.time">
            {{ format(new Date(scrap.time), dateFormatString) }}
          </NuxtLink>
        </div>
      </div>
    </div>


  </section>
</template>

<script setup>
import { scrapToUUID } from '~/helpers';
import { format } from 'date-fns';
const { scrap, dateFormatString, maxHeight, showFooter } = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
  dateFormatString: {
    type: String,
    default: 'EEEE MMM do, haaa',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped></style>