<template>
  <div class="project-status flex">
    <div v-for="n in totalBubbles" :key="n" class="bubble flex items-center justify-center"
      :class="{ 'bg-primary-500': n <= filledBubbles }"></div>
  </div>
</template>

<style scoped>
.bubble {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e2e8f0;
  margin-right: 5px;
}

.bg-blue-500 {
  background-color: #4299e1;
}
</style>

<script>
export default {
  props: {
    totalBubbles: {
      type: Number,
      default: 10
    },
    filledBubbles: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.bubble {
  /* Styles for bubbles */
}

.bubble.filled {
  /* Styles for filled bubbles */
}
</style>