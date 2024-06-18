<template>
  <div ref="scrapCard" class="scrap-card" :style="computedStyle">
    <ScrapItem :scrap="props.scrap" :showDetails="false" class="text-[11px]" />
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  scrap: {
    type: Object,
    required: true,
  },
  initialPosition: {
    type: Object,
    required: true,
  },
  zIndex: {
    type: Number,
    default: 0,
  },
})

const scrapCard = ref(null)


const scrapId = computed(() => {
  if (!props.scrap.scrap_id) {
    console.error('Scrap is missing a scrap_id', props.scrap)
  }
  return props.scrap.scrap_id
})

const scrapPosition = useLocalStorage(`scrap-position-${scrapId.value}`, props.initialPosition)


const { x, y, isDragging, style } = useDraggable(scrapCard, {
  // initialValue: props.initialPosition,
  initialValue: scrapPosition.value,
  preventDefault: true,
})

// we need to add our prop-based z-index to the style
const computedStyle = computed(() => {
  return style.value + `z-index: ${props.zIndex};`
})


const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}
</script>

<style scoped>
.scrap-card {
  @apply fixed;
  /* @apply absolute; */
  @apply w-1/5 h-52 overflow-hidden bg-white text-black text-xs shadow-md rounded-lg p-0.5 border border-slate-500;
  /* @apply bg-white text-black text-xs shadow-md rounded-lg p-4 mb-4 w-64 h-64 border-4 border-red-500 overflow-hidden; */

}
</style>