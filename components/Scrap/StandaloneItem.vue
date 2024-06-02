<template>
  <div class="scrap-item group cursor-default pointer border-1 border-gray-200 align-baseline">
    <div v-if="scrap">
      <!-- <pre>{{ scrap }}</pre> -->
      <!-- <div class="flex items-center justify-between mb-0.5">

      <div class="text-xs text-gray-500 opacity-5 group-hover:opacity-0.500 transition-opacity">{{
        
      }}</div>
      <a :href="scrap.href" target="_blank" class="text-xs text-blue-500 hover:underline">
        Link
      </a>
    </div> -->
      <!-- <pre>{{ scrap }}</pre> -->

      <div class="hidden">
        <!-- PR icon if type is user-github-pr -->
        <UIcon v-if="scrap.source === 'github-pr'" name="i-ph-git-pull-request-fill" class="w-4 h-4 inline ml-0.5" />

        <UIcon v-if="scrap.source === 'github-star'" name="i-material-symbols-light-kid-star-outline"
          class="w-4 h-4 inline ml-0.5" />

        <UIcon v-if="scrap.source === 'mastodon'" name="i-mingcute-thought-fill" class="w-4 h-4 inline ml-0.5" />

        <UIcon v-if="scrap.source === 'user-github-issue'" name="i-octicon-issue-opened-0.56"
          class="w-4 h-4 inline ml-0.5" />

        <UIcon v-if="scrap.source === 'github-gist'" name="i-material-symbols-code-blocks-outline-sharp"
          class="w-4 h-4 inline ml-0.5" />

        <UIcon v-if="scrap.source === 'pinboard'" name="i-cib-pinboard" class="w-4 h-4 inline ml-0.5" />
      </div>

      <small class="opacity-50 inline-block overflow-hidden mr-1 align-top mb-0.5 text-xs"
        @click="navigateTo(scrap.href, { external: true })">
        <!-- {{ formatDate(scrap.time) }} -->
        &lt;+{{ scrapTypeToSymbol(scrap.source) }} {{ scrap.source }}&gt;
      </small>

      <!-- <span v-if="scrap.source === 'mastodon'" class="mb-0.5 text-xs font-medium leading-7 w-5/6"
      v-html="scrap.description" /> -->

      <span v-if="scrap.source === 'mastodon-post' ||
      scrap.source === 'github-star' ||
      scrap.source === 'pinboard' ||
      scrap.source === 'github-gist' ||
      scrap.source === 'github-pr'
      " class="inline mb-0.5 text-xs leading-none align-top">{{ scrap.description }}</span>

      <!-- <span class="line-clamp-1 text-xs" v-html="scrap.content" /> -->

      <span class="inline line-clamp-1 text-xs align-top mb-0.5">
        {{ scrap.content }}
      </span>

      <NuxtLink v-if="scrap.scrap_id" :to="`/scrapbook/${scrap.scrap_id}`"
        class="opacity-30 inline-block overflow-hidden px-1 align-top mb-0.5 text-xs">{{ scrap.scrap_id }}</NuxtLink>

      <!-- if we have scrap.channel, show it -->
      <!-- <span class="mb-0.5 text-xs text-gray-600" v-if="scrap.channel">
      {{ scrap.channel }}
    </span> -->
    </div>
    <div v-if="error" class="text-red-500">{{ error.message }}</div>
    <div v-if="pending" class="text-gray-500">Loading...</div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { scrapTypeSymbols } from '~/helpers'


// TODO: Make this *standalone* scrap item component
// meaning it gets the scrap ID from the parent component
// fetches the actual data from supabase
// and then displays itself- no need to pass in the scrap object

const props = defineProps({
  scrapId: {
    type: String,
    required: true,
  },
})

// create a Nuxt useAsyncData that fetches the scrap object with supabase
const supabase = useSupabaseClient()

const { data, error, pending } = useAsyncData(
  async () => {
    const queryScrapid = props.scrapId
    console.log('queryScrapid', queryScrapid)
    const { data, error } = await supabase
      .from('scraps')
      .select('*')
      .eq('scrap_id', queryScrapid)
      .single()

    console.log('data', data)
    return { data, error }
  },
  { immediate: true }
)

const scrap = computed(() => data.value.data)

function scrapTypeToSymbol(type) {
  if (!type) return ''
  // if the type is 'github-pr'
  // just turn it into 'github'
  // if (type.includes('github')) {
  //   return 'github'
  // }
  return scrapTypeSymbols[type]
}

const formatDate = (date) => {
  return format(new Date(date), 'M-dd|hh:mma')
}
</script>

<style scoped></style>
