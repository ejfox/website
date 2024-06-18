<template>
  <div class="nuxt-loading-indicator" :style="indicatorStyle">
  </div>
</template>

<script setup>
import { useLoadingIndicator } from '#app/composables/loading-indicator'

const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
  color: {
    type: [String, Boolean],
    default: 'repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)',
  },
  errorColor: {
    type: String,
    default: 'repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)',
  },
  estimatedProgress: {
    required: false,
  },
})

const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator({
  duration: props.duration,
  throttle: props.throttle,
  estimatedProgress: props.estimatedProgress,
})


// transition from black to white
function loadColor(progress) {
  return `rgba(${progress + 100}, ${progress + 100}, ${progress + 100}, 1)`
}

const indicatorStyle = computed(() => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  pointerEvents: 'none',
  width: 'auto',
  height: `${props.height}px`,
  opacity: isLoading ? 1 : 0,
  // background: error ? props.errorColor : props.color || undefined,
  // background: error ? props.errorColor : loadColor(progress ? progress.value : 0),
  background: loadColor(progress ? progress.value : 0),
  backgroundSize: `${(100 / (progress ? progress.value : 0)) * 100}% auto`,
  transform: `scaleX(${progress ? progress.value : 0}%)`,
  transformOrigin: 'left',
  transition: 'transform 0.1s, height 0.4s, opacity 0.4s, background 0.4s',
  zIndex: 999999,
}))

</script>

<style scoped>
/* Your scoped styles here */
</style>