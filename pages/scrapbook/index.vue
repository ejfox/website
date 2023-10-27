<template>
  <div class="dark:text-white">
    <h3 class="text-6xl text-bold text-center py-8">Scrapbook</h3>

    <div class="w-4/12 mx-auto mb-10">
      <USelectMenu v-model="viewByMode" :options="viewOptions">
      </USelectMenu>
    </div>

    <div v-if="viewByMode.slug === 'weekly'" class="container mx-auto px-10 break-words">
      <div v-if="pending">Loading...</div>
      <div v-else class="space-y-6">
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="">
          <h3 class="text-5xl font-bold mb-2 text-center" v-html="weekToString(week)"></h3>
          <div v-if="scraps" v-for="scrap in scraps" class="p-2 max-w-prose mx-auto">
            <div class="flex items-center mb-2 opacity-50">
              <div class="mr-2">
                <span v-if="scrap.type === 'mastodon'">
                  <a :href="scrap.href" target="_blank" class="">
                    <UIcon name="i-la-mastodon" color="gray" />
                  </a>
                </span>
                <span v-if="scrap.type === 'pinboard'">
                  <UIcon name="i-uil-bookmark" color="gray" />
                </span>
                <span v-if="scrap.type === 'arena'">
                  <UIcon name="i-ph-asterisk" color="gray" />
                </span>
              </div>
              <h5 class="text-sm font-thin">{{ prettyScrapTimestamp(scrap.time) }}</h5>
            </div>
            <a v-if="scrap.href" :href="scrap.href" target="_blank" class="text-lg font-bold mb-2 block">
              {{ scrap.description }}
            </a>
            <span v-if="scrap?.content" class="text-sm mb-2" v-html="scrap.content"></span>
            <div v-if="scrap?.images" class="flex flex-wrap">
              <a :href="scrap.href" target="_blank" class="w-full">
                <div v-if="scrap.images.length === 1" class="w-full">
                  <img :src="scrap.images[0]" class="w-full drop-shadow-md rounded-sm mb-2" />
                </div>
                <div v-else-if="scrap.images.length === 2" class="w-full flex">
                  <img :src="scrap.images[0]" class="drop-shadow-md rounded-sm mb-2 w-1/2" />
                  <img :src="scrap.images[1]" class="drop-shadow-md rounded-sm mb-2 w-1/2" />
                </div>
                <div v-else-if="scrap.images.length === 3" class="flex">
                  <img :src="scrap.images[0]" class="drop-shadow-md rounded-sm mb-2 w-1/3" />
                  <img :src="scrap.images[1]" class="drop-shadow-md rounded-sm mb-2 w-1/3" />
                  <img :src="scrap.images[2]" class="drop-shadow-md rounded-sm mb-2 w-1/3" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="viewByMode.slug === 'grid'" class="w-5/6 mx-auto">
      <div v-if="pending">Loading...</div>
      <div v-else>
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="mb-8">
          <h5 v-html="weekToString(week)" class="text-xl font-bold py-2"></h5>
          <div class="columns-2 md:columns-3 lg:columns-4 xl:columns-6">
            <div v-for="scrap in scraps" class="mb-8">
              <UCard class="min-h-full">
                <template #header v-if="scrap?.content">
                  <a v-if="scrap.href" :href="scrap.href" target="_blank" class="">
                    {{ scrap.description }}
                  </a>
                </template>

                <div class="flex items-center justify-center">
                  <div v-if="!scrap?.content">
                    <!-- just a link with the url-->
                    <a v-if="scrap.href" :href="scrap.href" target="_blank" class="text-sm leading-tight">
                      {{ scrap.description }}
                    </a>
                  </div>
                  <span v-if="scrap?.content" class="text-xs font-light" v-html="scrap.content"></span>
                  <div v-if="scrap.images" class="mt-2">
                    <div v-if="scrap.images.length === 1" class="w-full">
                      <img :src="scrap.images[0]" class="w-full drop-shadow-md rounded-sm" />
                    </div>
                    <div v-else-if="scrap.images.length === 2" class="w-full flex">
                      <img :src="scrap.images[0]" class="drop-shadow-md rounded-sm w-1/2" />
                      <img :src="scrap.images[1]" class="drop-shadow-md rounded-sm w-1/2" />
                    </div>
                    <div v-else-if="scrap.images.length > 2" class="flex">
                      <img v-for="image in scrap.images" :key="image" :src="image"
                        class="drop-shadow-md rounded-sm w-1/3" />
                    </div>
                  </div>
                </div>

                <template #footer>
                  <div class="text-xs flex items-center justify-between">
                    <div class="dark:text-slate-500">
                      {{ format(new Date(scrap.time), 'MMM d, yyyy') }}
                    </div>

                    <!-- type-->
                    <div class="hidden md:inline-block">
                      <a :href="scrap.href" target="_blank" class="text-xs">
                        <span v-if="scrap.type === 'mastodon'" class="dark:text-primary-900">
                          Commentary
                        </span>
                        <span v-if="scrap.type === 'pinboard'" class="dark:text-blue-900">
                          Bookmark
                        </span>
                        <span v-if="scrap.type === 'arena'">
                          Scrapbook
                        </span>
                        <!-- external link icon that links to it-->

                        <UIcon name="la:external-link-alt" color="gray" />
                      </a>
                    </div>

                    <!-- <div class="hidden md:inline-block dark:text-slate-700 ml-2">
                      {{ format(new Date(scrap.time), 'h:mma') }}
                    </div> -->
                  </div>
                </template>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { format } from 'date-fns';



function weekToString(week) {
  const start = format(week, 'MMM d');
  const end = format(d3.timeWeek.offset(week, 1), 'MMM d');
  const year = format(week, 'YYY');
  return `${start} - ${end} <small class="o-50">${year}</small>`;
}

function prettyScrapTimestamp(timestamp) {
  const date = new Date(timestamp);
  return format(date, 'iii h:mm a');
}

const viewOptions = [
  {
    label: 'Grid',
    slug: 'grid',
    icon: 'uil:grid',
  },
  {
    label: 'Weekly',
    slug: 'weekly',
    icon: 'uil:calendar-alt',
  },
];

const viewByMode = ref(viewOptions[0]);

const { data: bookmarksData, pending: bookmarksPending, error: bookmarksError } = useFetch('/data/scrapbook/bookmarks.json', {
  server: false
});

const { data: mastodonData, pending: mastodonPending, error: mastodonError } = useFetch('/data/scrapbook/mastodon.json', {
  server: false
});

const { data: arenaData, pending: arenaPending, error: arenaError } = useFetch('/data/scrapbook/arena.json', {
  server: false
});

const pending = ref(true);
const scrapByWeek = ref(null);

watchEffect(() => {
  if (!bookmarksPending.value && !mastodonPending.value && !arenaPending.value) {
    pending.value = false;
    const combinedData = [
      ...(bookmarksData.value || []).map((bookmark) => ({
        id: bookmark.id,
        href: bookmark.href,
        description: bookmark.description,
        content: bookmark.extended,
        time: bookmark.time,
        type: 'pinboard',
        ...bookmark,
      })),
      ...(mastodonData.value || []).map((status) => ({
        id: status.id,
        href: status.url,
        // content: status.content, // this includes HTML
        // instead we want to sanitize the HTML and get the text
        description: status.content.replace(/<[^>]*>?/gm, ''),
        time: status.created_at,
        type: 'mastodon',
        images: status.media_attachments.map((attachment) => attachment.preview_url),
      })),
      ...(arenaData.value || []).map((block) => ({
        id: block.id,
        // href: block.source?.url || null,
        // link to the arena page for now
        href: `https://www.are.na/block/${block.id}`,
        content: block.description,
        time: block.created_at,
        type: 'arena',
        images: block.image ? [block.image.display.url] : [],
      })),
    ];
    console.log(combinedData);
    scrapByWeek.value = scrapbookDataToWeeks(combinedData);
  }
});

function scrapbookDataToWeeks(data) {
  if (!data.length) return null;
  const scrapByWeekMap = d3.group(data, (d) => {
    const date = new Date(d.time);
    const week = d3.timeWeek.floor(date);
    return week;
  });

  // sort scraps within each week in descending order of their time property
  scrapByWeekMap.forEach((scraps, week) => {
    scraps.sort((a, b) => new Date(b.time) - new Date(a.time));
  });

  // trim to only the selected year
  const selectedYear = 2023
  const scrapByWeekMapTrimmed = new Map();

  scrapByWeekMap.forEach((scraps, week) => {
    const year = format(week, 'yyyy');
    if (+year === +selectedYear) {
      scrapByWeekMapTrimmed.set(week, scraps);
    }
  });

  // return scrapByWeekMap;
  return scrapByWeekMapTrimmed
}

</script>
<style scoped>
.scrap-image {
  /* max-width: 34rem; */
}
</style>
