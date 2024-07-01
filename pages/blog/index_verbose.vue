<template>
  <main class="dark:bg-gray-900 p-2 md:p-4 text-sm">

    <div class="flex items-center space-x-4">
      <span v-if="filterOutDrafts">Filtering out drafts</span>
      <span v-else>Showing drafts</span>
      <UToggle v-model="filterOutDrafts" />
    </div>


    <ContentQuery path="/blog/" :sort="{ date: -1 }" v-slot="{ data }">
      <h2>
        {{ data.length }} articles
      </h2>
      <h3 v-if="filterOutDrafts">
        {{ blogIndexFilter(data).length }} articles after filtering drafts
      </h3>
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="border-b py-2">Title</th>
            <!-- <th class="border-b py-2">Slug</th> -->
            <th class="border-b py-2">Words</th>
            <th class="border-b py-2">Date</th>
            <th class="border-b py-2">Modified</th>
            <th class="border-b py-2">Time Diff</th>

            <!-- <th class="border-b py-2">Description</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in blogIndexSort(blogIndexFilter(data))" :key="article._path">
            <td class="p-2">
              <UIcon v-if="article.hidden" name="i-formkit-hidden" class="opacity-80 mr-1" />

              <NuxtLink :to="article._path"
                :class="['pr-4 link cursor-pointer', !article.draft ? 'font-bold' : 'font-light']">
                {{ article.title }}
              </NuxtLink>

              <UIcon v-if="article.draft" name="i-carbon-result-draft" class="opacity-30" />





              <div>
                <span class="text-xs tracking-wider font-light text-gray-500 dark:text-gray-500">
                  {{ article._path }}
                </span>
              </div>
            </td>

            <!-- words -->
            <td class=" py-2 text-right pr-2" :style="{
        color: wordCountColorScale(article.readingTime?.words)
      }">{{ article.readingTime?.words }}</td>

            <!-- <td class="text-xs py-2">
              <span class="text-gray-500 dark:text-gray-500">
                {{ article._path }}
              </span>
            </td> -->
            <td class=" p-2" :style="{
        color: dateColorScale(new Date(article.date))
      }">{{ prettyTime(article.date) }}</td>
            <td class=" p-2" :style="{
        color: timeDiffScale(calcTimeDiff(new Date(article.date), new Date(article.modified)))
      }">{{ prettyTime(article.modified) }}</td>
            <td class="text-right" :style="{
        display: article.modified && article.date ? 'table-cell' : 'none',
        color: timeDiffScale(calcTimeDiff(new Date(article.date), new Date(article.modified)))
      }">{{ calcTimeDiff(new Date(article.date), new Date(article.modified)) }} days</td>

            <!-- <td class="border-b py-2">{{ article.description }}</td> -->
          </tr>
        </tbody>
      </table>
    </ContentQuery>
  </main>
</template>
<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { countPhotos, filterStrongTags } from '~/helpers'
// import anime from "animejs/lib/anime.es.js";
import { timeFormat } from 'd3-time-format'
import { scaleLinear } from 'd3'
import tailwindConfig from '#tailwind-config'
// get date formatting and parsing from date-fns
import { formatDistanceToNow, format } from 'date-fns'

const primaryColor = useAppConfig().ui.primary
const primaryColorHex = tailwindConfig.theme.colors[primaryColor][500]

const formatDate = timeFormat('%B %d, %Y')

function prettyTime(dateIsoString) {
  if (!dateIsoString) return null
  // parse the date iso string into a date 
  // console.log('dateIsoString', dateIsoString)
  // const date = new Date(dateIsoString)
  // make sure we can handle 2023-10822-207T8:1409:38:50-04:00 too
  const date = new Date(dateIsoString.split('T')[0])
  // if it's not a valid time value return null
  if (isNaN(date)) return null
  // format the date into a human readable string
  return format(date, 'yyyy-MM-dd')
}

function calcTimeDiff(date1, date2) {
  const diff = Math.abs(date1 - date2)
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
  // make sure diffDays is a number
  // otherwise return null
  return isNaN(diffDays) ? null : diffDays
}

//wordcount color scale from 300 to 3000
const wordCountColorScale = scaleLinear()
  .domain([300, 3000])
  .range(['rgba(50, 50, 50, 0.6)', primaryColorHex])

// date color scale from 2015 to 2025
const dateColorScale = scaleLinear()
  .domain([new Date('2015-01-01'), new Date()])
  // .range(['black', 'rgba(30,30,30'])
  .range(['rgba(0, 255, 0, 0)', primaryColorHex])

const timeDiffScale = scaleLinear()
  .domain([0, 100])
  .range(['rgba(50, 50, 50, 0.6)', primaryColorHex])


const filterOutDrafts = ref(true)

const blogIndexFilter = (articles) => {
  if (!articles) return articles

  // filter out drafts
  if (filterOutDrafts.value) {
    articles = articles.filter((article) => !article.draft)
  }

  return articles
}

const blogIndexSort = (articles) => {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function featuredArticle(data) {
  if (!data) return null

  const sortedData = blogIndexSort(blogIndexFilter(data))
  return sortedData[0]
}
</script>