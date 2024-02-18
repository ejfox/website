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
      </div>


      <div class="p-4">
        <div v-if="searching">
          <UProgress animation="carousel" />
        </div>
      </div>

      <div>
        <div v-for=" [week, scraps] in filteredWeeksToDisplay" :key="week.week" class="">
          <h5 v-html="weekToString(week)"
            class="text-2xl font-bold p-2 text-center md:text-left sticky lg:relative backdrop-filter backdrop-blur-lg top-0 z-10 bg-white/25 dark:bg-neutral-900/50 md:dark:bg-transparent text-gray-600 dark:text-gray-400 rounded-sm my-4">
          </h5>
          <div class="">
            <div v-for="scrap in scraps" :key="scrap.id" class="my-4 w-full px-2 align-top inline-block md:block">
              <ScrapCard :scrap="scrap" :show-footer="true" />
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

const { scrapByWeek } = useScrap();

const weeksToShow = ref(6);
const weeksToDisplay = ref(null);
const searchText = ref('');
const searching = ref(false)

const debouncedSearchText = ref('');
const debouncedSearchTextHandler = useDebounceFn((value) => {
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