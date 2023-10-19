<template>
  <div>
    <h3>Scrapbook</h3>

    <!-- a select for the viewBy mode: weekly, concept, arrange-->
    <select v-model="viewByMode">
      <option value="weekly">Weekly</option>
      <option value="concept">Concept</option>
      <option value="arrange">Arrange</option>
    </select>

    <div v-if="viewByMode === 'weekly'">
      <div v-if="pending">Loading...</div>
      <div v-else class="flex flex-wrap">
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="w-third flex-item pa2 overflow-hidden">
          <h3>{{ weekToString(week) }}</h3>
          <div v-if="scraps" v-for="scrap in scraps" :key="scrap.id">
            <h4 class="f6 lh-title mv1 pv1">
              <a v-if="scrap.href" :href="scrap.href" target="_blank" class="dark-gray fw3 link">
                {{ scrap.description }}
              </a>
              <span v-if="scrap?.content" v-html="scrap.content"></span>
              <div v-if="scrap?.images">
                <img v-for="image in scrap.images" :src="image" class="w-100" />

              </div>
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { format } from 'date-fns';

const viewByMode = ref('weekly');

function weekToString(week) {
  const start = format(week, 'MMM d');
  const end = format(d3.timeWeek.offset(week, 1), 'MMM d');
  return `${start} - ${end}`;
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
  if (!bookmarksPending.value && !mastodonPending.value) {
    pending.value = false;
    const combinedData = [
      ...(bookmarksData.value || []),
      ...(mastodonData.value || []).map((status) => ({
        id: status.id,
        href: status.url,
        content: status.content,
        time: status.created_at,
        type: 'mastodon',
        images: status.media_attachments.map((attachment) => attachment.preview_url),
      })),
      ...(arenaData.value || []).map((block) => ({
        id: block.id,
        href: block.source?.url || null,
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
  return scrapByWeekMap;
}

</script>
