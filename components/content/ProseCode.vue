<script setup>
const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array,
    default: () => [],
  },
});

// make a computed for the length of the code string
const codeCharCount = computed(() => props.code.length);
const codeLineCount = computed(() => props.code.split("\n").length - 1);
</script>

<template>
  <div :class="[
    'overflow-x-auto dark:prose-invert shadow-sm',
    codeCharCount > 100 ? 'text-sm md:text-lg' : 'text-lg md:text-3xl',
    codeLineCount > 1 ? 'line-numbers' : '',
  ]">
    <slot />
  </div>
</template>