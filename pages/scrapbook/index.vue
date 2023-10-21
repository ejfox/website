<template>
  <div>
    <h3>Scrapbook</h3>

    <!-- a select for the viewBy mode: weekly, concept, arrange-->
    <!-- <select v-model="viewByMode">
      <option value="weekly">Weekly</option>
      <option value="grid">Grid</option>
    </select> -->

    <USelect v-model="viewByMode" :options="['weekly', 'grid']" size="sm" />

    <div v-if="viewByMode === 'weekly'">
      <div v-if="pending">Loading...</div>
      <div v-else class="">
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="pa2 overflow-hidden mb5 w-third-l fl">
          <h3 v-html="weekToString(week)"></h3>
          <div v-if="scraps" v-for="scrap in scraps" class="bb b--moon-gray pv2">
            <div class="dib mr2">
              <span v-if="scrap.type === 'mastodon'">
                <a :href="scrap.href" target="_blank" class="dark-gray fw3 link">
                  <Icon name="la:mastodon" color="gray" />
                </a>
              </span>
              <span v-if="scrap.type === 'pinboard'">
                <Icon name="uil:bookmark" color="gray" />
              </span>
            </div>

            <h5 class="mv0 pv0 fw1 gray dib mr1 ttu">{{ prettyScrapTimestamp(scrap.time) }}</h5>

            <a v-if="scrap.href" :href="scrap.href" target="_blank" class="dark-gray fw3 link">
              {{ scrap.description }}
            </a>
            <span v-if="scrap?.content" class="bg-light-yellow fw1 f7 lh-title ml1" v-html="scrap.content"></span>
            <div v-if="scrap?.images">
              <a :href="scrap.href" target="_blank" class="link">
                <img v-for="image in scrap.images" :src="image"
                  :class="['scrap-image', scrap.images.length > 2 ? 'w-third' : 'w-100']" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="viewByMode === 'grid'">
      <div v-if="pending">Loading...</div>
      <div v-else>
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="flex flex-wrap">
          <h5 v-html="weekToString(week)" class="bb w-100 pv3 f1 serif"></h5>
          <div class="flex flex-wrap">
            <div v-for="scrap in scraps"
              class="w5 flex-item flex flex-column justify-center items-center pa2 overflow-auto">
              <div class="pv3 overflow-y-auto h5">
                <a v-if="scrap.href" :href="scrap.href" target="_blank" class="dark-gray fw3 link">
                  {{ scrap.description }}
                </a>
                <br />
                <span v-if="scrap?.content" class="bg-light-yellow fw1 f7 lh-title" v-html="scrap.content"></span>
                <div v-if="scrap.images" class="pa3">
                  <img v-for="image in scrap.images" :src="image" class="" />
                </div>
              </div>
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

const viewByMode = ref('grid');

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
