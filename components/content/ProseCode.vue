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
  <div
    :class="[
      'overflow-x-auto w-100 ph3',
      codeCharCount > 100 ? 'f5 fw3' : 'f3',
      codeLineCount > 1 ? 'with-line-numbers' : '',
    ]"
  >
    <!-- {{slot}} -->
    <slot />
  </div>
</template>

<style>
code {
  max-width: 100vw;
  overflow-x: auto;
  /* word-break: break-word; */
  overflow-wrap: break-word;
}
pre {
  white-space: pre-wrap;
  line-height: 1.4em;
}
pre code .line {
  display: block;
  min-height: 1rem;
  margin-top: 0.15rem;
}

.with-line-numbers code {
  counter-reset: step;
  counter-increment: step 0;
}

.with-line-numbers code .line::before {
  font-size: 0.75rem;
  content: counter(step);
  counter-increment: step;
  width: 1.4rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.3);
}

.with-line-numbers code .line::before {
  content: counter(step);
}

/* add a stripe to every other line */
.with-line-numbers code .line:nth-child(2n) {
  background: rgba(115, 138, 148, 0.025);
}
</style>
