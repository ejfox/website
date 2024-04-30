<template>
  <div>
    <!-- a back button to the index -->
    <div class="flex md:justify-end">
      <UButton
        class="mx-4 md:m-4"
        color="gray"
        size="xs"
        :to="{ name: 'scrapbook' }"
      >
        Back to Scrapbook
      </UButton>
    </div>

    <!-- use tresjs to create a 3D style trading card display of the scrap -->

    <div class="mx-auto p-4 lg:p-24 justify-center flex flex-col">
      <ScrapItem v-if="scrap" :scrap="scrap" />
    </div>

    <VerboseScrapItem class="px-4 lg:px-24" v-if="scrap" :scrap="scrap" />

    <div
      class="mx-auto p-4 lg:p-24 md:min-h-screen justify-center flex flex-col monospace text-xs"
    >
      <UTable :rows="scrapRows" />
    </div>
  </div>
</template>

<script setup>
import { scrapToUUID, uuidToScrap } from '~/helpers'
import useScrap from '~/composables/useScrap.js'

const { combinedData } = useScrap()
const route = useRoute()
const slug = route.params.slug
const scrap = ref(null)

watch(combinedData, () => {
  if (!slug[0]) return
  if (!combinedData.value) return
  const matchScrap = uuidToScrap(slug[0], combinedData.value)
  scrap.value = matchScrap
})

const scrapRows = computed(() => {
  if (!scrap.value) return []

  const rows = Object.keys(scrap.value).map((key) => {
    return {
      name: key,
      value: scrap.value[key],
    }
  })

  return rows
})
</script>

<style scoped></style>
