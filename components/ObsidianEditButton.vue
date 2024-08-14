<template>
  <div>
    <UButton color="white" @click="navigateTo(generateObsidianDeepLink(page), { external: true })">
      Edit in Obsidian
    </UButton>
  </div>
</template>

<script setup>
const props = defineProps(['page'])

function generateObsidianDeepLink(page) {
  const path = page._path.replace('/blog/', '')
  return `obsidian://open?vault=ejfox&file=${path}`
}
</script>