<template>
  <div>
    <h3
      class="text-xl md:text-6xl font-bold text-center py-1 md:py-8 tracking-widest text-gray-950 dark:text-gray-50"
    >
      Scrapbook
    </h3>

    <div class="md:w-5/6 mx-auto">
      <div class="p-4">
        <select v-model="selectedWeek" class="mb-4 p-2 rounded border-gray-300">
          <option v-for="week in weekOptions" :value="week" :key="week">
            {{ weekToString(week) }}
          </option>
        </select>
        <div v-if="selectedWeekScrap">
          <h5
            v-html="weekToString(selectedWeek)"
            class="text-2xl font-bold p-2 text-center md:text-left sticky lg:relative backdrop-filter backdrop-blur-lg top-0 z-10 bg-white/25 dark:bg-neutral-900/50 md:dark:bg-transparent text-gray-600 dark:text-gray-400 rounded-sm my-4"
          ></h5>
          <div>
            <ScrapCard
              v-for="scrap in selectedWeekScrap"
              :key="scrap.id"
              :scrap="scrap"
              :show-footer="true"
              class="my-4 w-full px-2 align-top inline-block md:block"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import useScrap from '~/composables/useScrap.js'
import { useStorage } from '@vueuse/core'

const { scrapByWeek } = useScrap()

const selectedWeek = useStorage('scrapbook-selected-week', '')

const weekOptions = computed(() => {
  const weeks = scrapByWeek.value
  if (!weeks) return []

  return [...weeks].sort((a, b) => b[0] - a[0]).map(([week]) => week)
})

const selectedWeekScrap = computed(() => {
  if (!selectedWeek.value) return null
  return scrapByWeek.value.get(selectedWeek.value) || null
})
function weekToString(week) {
  const start = format(week, 'MMM d')
  const end = format(
    new Date(week.getTime() + 6 * 24 * 60 * 60 * 1000),
    'MMM d',
  )
  const year = format(week, 'yyyy')
  return `Week of ${start} - ${end}, ${year}`
}

function weekToStringHtml(week) {
  const plainString = weekToString(week)
  return `${plainString.slice(
    0,
    -5,
  )}<small class="opacity-50 font-light ml-2">${plainString.slice(-4)}</small>`
}
</script>
