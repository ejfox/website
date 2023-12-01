<template>
  <div class="">
    <h3 class="text-xl md:text-6xl text-bold text-center py-1 md:py-8 tracking-widest font-bold text-gray-950 dark:text-gray-50
    ">Scrapbook
    </h3>

    <!-- search -->
    <div class="md:w-5/6 mx-auto">
      <div class="px-4 py-1 relative">
        <UInput v-model="searchText" type="text" icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search scraps..." class="w-full 
          fixed lg:relative bottom-0 left-0 right-0 z-50 shadow-lg" />

        <!-- add a close button to clear the search out -->
        <UIcon v-if="searchText.length > 0" name="i-heroicons-x-circle"
          class="fixed md:absolute md:bottom-12 right-0 md:mt-2 md:mr-3 z-50" @click="searchText = ''" />
      </div>


      <div class="p-4">
        <div v-if="searching">
          <UProgress animation="carousel" />
        </div>

        <div v-for=" [week, scraps] in filteredWeeksToDisplay" :key="week.week" class="mb-8">
          <h5 v-html="weekToString(week)"
            class="text-xl font-bold py-2 px-4 text-center sticky lg:relative backdrop-filter backdrop-blur-lg top-0 z-10 bg-white/25 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400">
          </h5>
          <div class="md:columns-3 lg:columns-4 xl:columns-5 p-4">
            <div v-for="scrap in scraps" :key="scrap.id"
              class="mb-8 text-xs w-1/2 md:w-full px-2 align-top inline-block md:block">
              <ScrapCard :scrap="scrap" />
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
import { ref, watchEffect, computed } from 'vue';
import { scrapToUUID } from '~/helpers';
import useScrap from '~/composables/useScrap.js';
import { debounce } from 'lodash';

const { scrapByWeek } = useScrap();

const weeksToShow = ref(6);
const weeksToDisplay = ref(null);
const searchText = ref('');
const searching = ref(false)

const debouncedSearchText = ref('');
const debouncedSearchTextHandler = debounce((value) => {
  debouncedSearchText.value = value;
}, 500);

watchEffect(() => {
  debouncedSearchTextHandler(searchText.value);
});

watchEffect(() => {
  const weeks = scrapByWeek.value;
  if (!weeks) return;

  let weeksToShowValue = new Map(
    [...weeks].sort((a, b) => b[0] - a[0])
  );

  weeksToShowValue = new Map([...weeksToShowValue].slice(0, weeksToShow.value));

  weeksToDisplay.value = weeksToShowValue;
});

const filteredWeeksToDisplay = computed(() => {
  if (!weeksToDisplay.value) return [];

  const filteredWeeks = new Map();

  if (debouncedSearchText.value.length === 0) {
    searching.value = false
    return weeksToDisplay.value;
  }

  for (const [week, scraps] of scrapByWeek.value) {
    const filteredScraps = scraps.filter(scrap => {
      const searchFields = Object.values(scrap).join(' ').toLowerCase();
      return searchFields.includes(debouncedSearchText.value.toLowerCase());
    });

    if (filteredScraps.length > 0) {
      filteredWeeks.set(week, filteredScraps);
    }
  }
  searching.value = false
  return filteredWeeks;
});

// watch search text and when it changes, set searching to true
watch(searchText, () => {
  searching.value = true
})

function weekToString(week) {
  const start = format(week, 'MMM d');
  const end = format(d3.timeWeek.offset(week, 1), 'MMM d');
  const year = format(week, 'YYY');
  return `Week of ${start} - ${end} <small class="opacity-50 font-light ml-2">${year}</small>`;
}

function prettyScrapTimestamp(timestamp) {
  const date = new Date(timestamp);
  return format(date, 'iii h:mm a');
}
</script>