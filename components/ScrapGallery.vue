<template>
  <div class="scrap-gallery group cursor-default">
    <div class="group-metadata">
      <!-- time range of the group -->
      <div class="text-xs text-gray-500 opacity-5 group-hover:opacity-100 transition-opacity">{{ formatDate(scraps[0].time) }}
      </div>

    </div>
    <div :class="['grid gap-1', gridCols]">
      <div v-for="(scrap, index) in scraps" :key="index" class="aspect-w-1 aspect-h-1">
        <a :href="scrap.href">
          <img :src="scrap.images[0]" :alt="`Image ${index + 1}`" :class="['w-full h-full', objectScale]">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'



const props = defineProps({
  scraps: {
    type: Array,
    required: true,
  },
})

// a computed to determine the number of gridcols
const gridCols = computed(() => {
  if (props.scraps.length === 1) return 'grid-cols-1'
  if (props.scraps.length < 3) return 'grid-cols-2'
  if (props.scraps.length < 5) return 'grid-cols-3'
  if (props.scraps.length < 10) return 'grid-cols-4'
  return 'grid-cols-3'
})

// if less than 3 items object-fit, if more than 3 object-cover
const objectScale = computed(() => {
  // if (props.scraps.length < 3) return 'object-fit'
  // show full image with no scaling
  if (props.scraps.length > 3) return 'object-cover'
  return 'object-contain'

})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>