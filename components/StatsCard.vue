<template>
  <div class="stats-classes">
    <div>
      <h2 :class="stringLengthToFontSize(wordNumberFormat(value))">
        {{ wordNumberFormat(value) }}
      </h2>
      <p class="captions-classes">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
import { stringLengthToFontSize } from '~~/helpers'
import { format } from 'd3'

const wordNumberFormat = format(',')

defineProps({
  value: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>