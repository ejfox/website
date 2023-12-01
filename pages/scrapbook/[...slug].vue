<template>
  <div>
    <!-- a back button to the index -->
    <div class="flex md:justify-end">
      <UButton class="mx-4 md:m-4" color="gray" size="xs" :to="{ name: 'scrapbook' }">
        Back to Scrapbook
      </UButton>
    </div>
    <div class="max-w-lg mx-auto p-4 lg:p-10 md:min-h-screen justify-center flex flex-col">
      <ScrapCard :scrap="scrap" :date-format-string="'MMM d, yyyy – h:mm a'" :max-height="false" />
    </div>

    <!-- {{ scrap }} -->
    <UTable :rows="scrapRows" />

  </div>
</template>

<script setup>
import { scrapToUUID, uuidToScrap } from '~/helpers'
import useScrap from '~/composables/useScrap.js';

const { combinedData } = useScrap();

// we need to get the desired uuid from the slug
// we can do this by getting the last item in the slug array
// and then converting it to a scrap
const route = useRoute()
const slug = route.params.slug

const scrap = ref(null)

watchEffect(() => {
  scrap.value = uuidToScrap(slug[0], combinedData.value)
})

// to use UTable from Nuxt UI, we need to generate rows and columns from the data
// we want to use the object keys as each row, with a column for name and value

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