<template>
  <div>
    <h3>Scrapbook</h3>

    <!-- a select for the viewBy mode: weekly, concept, arrange-->
    <select v-model="viewByMode">
      <option value="weekly">Weekly</option>
      <option value="concept">Concept</option>
      <option value="arrange">Arrange</option>
    </select>

    <!-- <pre>{{ scrapbookData }}</pre> -->

    <!-- <pre>{{ scrapByWeek }}</pre> -->

    <div v-if="viewByMode === 'weekly'">
      <div v-if="pending">Loading...</div>
      <div v-else class="flex flex-wrap">
        <div v-for="[week, scraps] in scrapByWeek" :key="week.week" class="w-third flex-item pa2 overflow-hidden">
          <h3>{{ weekToString(week) }}</h3>
          <div v-if="scraps" v-for="scrap in scraps" :key="scrap.id">
            <h4 class="f6 lh-title mv1 pv1">
              <a :href="scrap.href" target="_blank" class="dark-gray fw3 link">
                {{ scrap.description }}
              </a>
            </h4>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as d3 from 'd3'
// import date-fns
import { format, parseISO, formatISO, formatDistanceToNow } from 'date-fns'
const viewByMode = ref('weekly')

// make a function to convert the week date object to a human readable string
function weekToString(week) {
  const start = format(week, 'MMM d')
  const end = format(d3.timeWeek.offset(week, 1), 'MMM d')
  return `${start} - ${end}`
}


// use Nuxt's built in useFetch to get the json data
const { data: scrapbookData, pending, error } = await useFetch('/data/scrapbook/bookmarks.json', {
  server: false
})

console.log('error', error.value)

const scrapByWeek = ref(null)

function scrapbookDataToWeeks(data) {
  console.log('data', data.value)
  if (!data.value) return null
  if (!data.value.length) return null
  const scrapByWeekMap = d3.group(data.value, (d) => {
    const date = new Date(d.time)
    const week = d3.timeWeek.floor(date)
    return week
  })
  console.log('scrapByWeekMap', scrapByWeekMap)
  return scrapByWeekMap
}

watchEffect(() => {
  scrapByWeek.value = scrapbookDataToWeeks(scrapbookData)
})
</script>
