<template>
  <div class="p-1 md:p-4 lg:p-8 w-full">
    <h1>Creating a new thread</h1>
    <!-- {{ scrapIds }} -->
    <div v-for="scrapId in scrapIdsArray" :key="scrapId" class="py-2">
      {{ scrapId }}

      <ScrapStandaloneItem :scrapId="scrapId" />
    </div>
  </div>
</template>

<script setup>
import { useRouteQuery } from '@vueuse/router'

// so a thread will come in with a query string with a bunch of scrap IDs separated by commas
// we will use that to populate the thread with the scraps
// and let the user maybe add more scraps to the thread
// or remove scraps from the thread
// before saving the thread to the DB, wherein we will redirect them to the thread page

const route = useRoute()

const scrapIds = computed(() => {
  if (!route.query) return []
  if (!route.query.scrapIds) return []
  return route.query.scrapIds
})

const scrapIdsArray = computed(() => {
  return scrapIds.value.split(',')
})
</script>

<style scoped></style>