<template>
  <div class="scrap-feed">
    <div v-for=" (scrap, index) in displayedScrap" :key="index" class="aspect-w-9 aspect-h-16 bg-gray-950 mb-1">
      <div class="scrap-item-container  flex flex-col justify-center items-center">
        <ScrapPortraitCard :scrap="scrap" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ScrapPortraitCard from '~/components/Scrap/PortraitCard.vue'

const { combinedData: data } = useScrap();

const displayedScrap = computed(() => {
  if (!data.value) return []
  return data.value.slice(0, 10)
})

</script>

<style scoped></style>
