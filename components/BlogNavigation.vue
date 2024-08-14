<template>
  <div class="clearfix py-8 px-4 md:px-8">
    <NuxtLink v-if="prev" :to="prev._path"
      class="dim px-4 py-4 w-40 w-20-ns text-gray-500 block absolute left-2 lh-title">
      <span class="inline-block">&#8592;</span>
      {{ prev.title }}
      <div class="text-gray-500 text-sm font-light">
        {{ formatDate(new Date(prev.date)) }}
      </div>
    </NuxtLink>

    <NuxtLink v-if="next" :to="next._path"
      class="dim px-4 py-4 w-40 w-20-ns text-gray-500 block absolute right-2 lh-title text-right">
      {{ next.title }}
      <span class="inline-block">&#8594;</span>
      <div class="text-gray-500 text-sm font-light text-right">
        {{ formatDate(new Date(next.date)) }}
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { timeFormat } from 'd3-time-format'

defineProps(['prev', 'next'])

const formatDate = timeFormat("%B %Y")
</script>